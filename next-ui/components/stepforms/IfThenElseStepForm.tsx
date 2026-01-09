import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import InputTextWidget from './widgets/InputText';
// Need IfThenElseWidget. It is a complex widget.
// import IfThenElseWidget from './widgets/IfThenElseWidget';
import styles from './IfThenElseStepForm.module.scss';
import { IfThenElseStep } from '@/lib/steps';
import omit from 'lodash/omit';

// Stub for IfThenElseWidget
const IfThenElseWidget = React.lazy(() => import('./widgets/IfThenElseWidget'));

const IfThenElseStepForm: React.FC<BaseStepFormProps<IfThenElseStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'ifthenelse',
      newColumn: '',
      if: { column: '', value: '', operator: 'eq' },
      then: '',
      else: '',
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const duplicateColumnName = props.columnNames?.includes(editedStep.newColumn)
    ? `A column name "${editedStep.newColumn}" already exists. You will overwrite it.`
    : undefined;

  const ifthenelse = omit(editedStep, ['name', 'newColumn']);

  const updateIfThenElse = (newVal: any) => {
      setEditedStep({ ...editedStep, ...newVal });
  };

  const handleSubmit = () => {
      // In Vue it cleaned up step before submit?
      // this.editedStep = { ...this.editedStep, ...omit(this.editedStep, ['name', 'newColumn']) };
      // This seems redundant.
      submit();
  };

  return (
    <StepFormWrapper
      title="Add a conditional column"
      stepName="ifthenelse"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.newColumnInput}>
        <InputTextWidget
          name="New column:"
          value={editedStep.newColumn}
          placeholder="Enter a name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumn: val || '' })}
          messageWarning={duplicateColumnName}
        />
      </div>

      <React.Suspense fallback={<div>Loading...</div>}>
        <IfThenElseWidget
            isRoot
            value={ifthenelse}
            // errors={errors}
            availableVariables={props.availableVariables}
            variableDelimiters={props.variableDelimiters}
            trustedVariableDelimiters={props.trustedVariableDelimiters}
            columnTypes={props.columnTypes}
            onChange={updateIfThenElse}
        />
      </React.Suspense>
    </StepFormWrapper>
  );
};

export default IfThenElseStepForm;
