import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './DuplicateColumnStepForm.module.scss';
import { DuplicateColumnStep } from '@/lib/steps';

const DuplicateColumnStepForm: React.FC<BaseStepFormProps<DuplicateColumnStep>> = (props) => {
  const {
    initialStepValue = { name: 'duplicate', column: '', newColumnName: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Duplicate column"
      stepName="duplicate"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnInput}>
        <ColumnPicker
          name="Duplicate column..."
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

      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="New column name:"
          value={editedStep.newColumnName}
          placeholder="Enter a column name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default DuplicateColumnStepForm;
