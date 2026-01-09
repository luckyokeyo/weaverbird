import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import styles from './ToLowerStepForm.module.scss';
import { ToLowerStep } from '@/lib/steps';

const ToLowerStepForm: React.FC<BaseStepFormProps<ToLowerStep>> = (props) => {
  const {
    initialStepValue = { name: 'lowercase', column: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Convert column to lowercase"
      stepName="lowercase"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnInput}>
        <ColumnPicker
          name="Convert column..."
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Enter a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ToLowerStepForm;
