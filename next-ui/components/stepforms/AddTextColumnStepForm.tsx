import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import InputTextWidget from './widgets/InputText';
import styles from './AddTextColumnStepForm.module.scss';
import { AddTextColumnStep } from '@/lib/steps';

const AddTextColumnStepForm: React.FC<BaseStepFormProps<AddTextColumnStep>> = (props) => {
  const {
    initialStepValue = { name: 'text', newColumn: '', text: '' },
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
    // In Vue: if errors === null, setSelectedColumns({ column: newColumn })
    // We rely on useStepForm's submit to call onFormSaved if valid.
    submit();
    // After submission, parent can handle column selection if needed.
  };

  return (
    <StepFormWrapper
      title="Add Text Column"
      stepName="text"
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
          // dataPath=".newColumn"
          // errors={errors}
          messageWarning={duplicateColumnName}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>
      <div className={styles.textInput}>
        <InputTextWidget
          name="Enter a text:"
          value={editedStep.text}
          placeholder=""
          onChange={(val) => setEditedStep({ ...editedStep, text: val || '' })}
          // dataPath=".text"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>
    </StepFormWrapper>
  );
};

export default AddTextColumnStepForm;
