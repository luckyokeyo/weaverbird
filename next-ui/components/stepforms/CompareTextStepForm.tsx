import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './CompareTextStepForm.module.scss';
import { CompareTextStep } from '@/lib/steps';

const CompareTextStepForm: React.FC<BaseStepFormProps<CompareTextStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'comparetext',
      newColumnName: '',
      strCol1: '',
      strCol2: '',
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const duplicateColumnName = props.columnNames?.includes(editedStep.newColumnName)
    ? `A column name "${editedStep.newColumnName}" already exists. You will overwrite it.`
    : undefined;

  const handleSubmit = () => {
      submit();
  };

  return (
    <StepFormWrapper
      title="Compare Text Columns"
      stepName="comparetext"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="New column name (for the comparison result):"
          value={editedStep.newColumnName}
          placeholder="Enter a column name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          messageWarning={duplicateColumnName}
        />
      </div>

      <div className={styles.strCol1Input}>
        <ColumnPicker
          name="First text column to compare:"
          value={editedStep.strCol1}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, strCol1: val })}
          placeholder="Select a column"
          dataPath=".strCol1"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.strCol2Input}>
        <ColumnPicker
          name="Second text column to compare:"
          value={editedStep.strCol2}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, strCol2: val })}
          placeholder="Select a column"
          dataPath=".strCol2"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>
    </StepFormWrapper>
  );
};

export default CompareTextStepForm;
