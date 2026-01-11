import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import InputTextWidget from './widgets/InputText';
import styles from './FormulaStepForm.module.scss';
import { FormulaStep } from '@/lib/steps';
// mathjs parse is used in validation in Vue.
// We should check if we can import it.
import { parse } from 'mathjs';
import { escapeForUseInRegExp } from '@/lib/helpers';
 import { ValidationError } from '@/lib/translators/base';

const FormulaStepForm: React.FC<BaseStepFormProps<FormulaStep>> = (props) => {
  const {
    initialStepValue = { name: 'formula', newColumn: '', formula: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit, validate: baseValidate, setErrors } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  // Custom validation logic from Vue
  const validate = () => {
    // Call base validation first
    // But useStepForm's validate updates `errors` state.
    // We want to append to it.

    // Hack: useStepForm validate returns boolean.
    // We can call it, then check errors.

    // Wait, `validate` in `useStepForm` sets errors.
    // If we want to add errors, we should do it after.

    let isValid = baseValidate(editedStep);
    const extraErrors: ValidationError[] = [];

    const formula = editedStep.formula;
    try {
      if (typeof formula === 'string') {
        let formulaEscaped = formula;
        const regexCols = new RegExp(
          `${escapeForUseInRegExp('[')}(.*?)${escapeForUseInRegExp(']')}`,
          'g',
        );
        formulaEscaped = formulaEscaped.replace(regexCols, 'col');
        if (props.variableDelimiters) {
          const regexVars = new RegExp(
            `${escapeForUseInRegExp(props.variableDelimiters.start)}(.*?)${escapeForUseInRegExp(
              props.variableDelimiters.end,
            )}`,
            'g',
          );
          formulaEscaped = formulaEscaped.replace(regexVars, 'var');
        }
        parse(formulaEscaped);
      }
    } catch (e) {
      console.error('Error while parsing formula:', formula, e);
      isValid = false;
      extraErrors.push({
        dataPath: '.formula',
        message: 'Parsing error: invalid formula',
        keyword: 'parsing',
        // schemaPath and params missing in ValidationError type but present in Ajv ErrorObject
        // ValidationError type: dataPath, keyword, message.
      });
    }

    if (!isValid) {
      // Merge errors
      // Access current errors from state is tricky inside the function if updated by baseValidate
      // But baseValidate updates state.
      // We can use a ref or just setErrors with callback.
      setErrors((prevErrors) => {
          // If prevErrors is null, use extraErrors
          // If prevErrors has values, append extraErrors
          return [...(prevErrors || []), ...extraErrors];
      });
      return false;
    }
    return true;
  };

  // Override submit
  const handleSubmit = () => {
      if (validate()) {
          onFormSaved(editedStep);
      }
  };

  const duplicateColumnName = props.columnNames?.includes(editedStep.newColumn)
    ? `A column name "${editedStep.newColumn}" already exists. You will overwrite it.`
    : undefined;

  return (
    <StepFormWrapper
      title="Formula"
      stepName="formula"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.newColumnInput}>
        <InputTextWidget
          name="New column:"
          value={editedStep.newColumn}
          placeholder="Enter a new column name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumn: val || '' })}
          messageWarning={duplicateColumnName}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>
      <div className={styles.formulaInput}>
        <InputTextWidget
          name="Formula:"
          value={editedStep.formula}
          placeholder=""
          onChange={(val) => setEditedStep({ ...editedStep, formula: val || '' })}
          // errors={errors} // extract error for .formula
          messageError={errors?.find(e => e.dataPath === '.formula' || e.dataPath === 'formula')?.message}
        />
      </div>
    </StepFormWrapper>
  );
};

export default FormulaStepForm;
