import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './AbsoluteValueStepForm.module.scss';
import { AbsoluteValueStep } from '@/lib/steps';

const AbsoluteValueStepForm: React.FC<BaseStepFormProps<AbsoluteValueStep>> = (props) => {
  const {
    initialStepValue = { name: 'absolutevalue', column: '', newColumn: '' },
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

  const handleSubmit = () => {
    // Vue checks errors === null then setSelectedColumns
    // We let useStepForm handle submit, parent can handle callback
    submit();
  };

  return (
    <StepFormWrapper
      title="Absolute Value"
      stepName="absolutevalue"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.columnInput}>
        <ColumnPicker
          name="Value column:"
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Select a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

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
    </StepFormWrapper>
  );
};

export default AbsoluteValueStepForm;
