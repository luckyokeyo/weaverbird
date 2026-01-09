import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import MultiselectWidget from './widgets/Multiselect';
import styles from './PercentageStepForm.module.scss';
import { PercentageStep } from '@/lib/steps';

const PercentageStepForm: React.FC<BaseStepFormProps<PercentageStep>> = (props) => {
  const {
    initialStepValue = { name: 'percentage', column: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Percentage of total"
      stepName="percentage"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.valueColumnInput}>
        <ColumnPicker
          name="Value column..."
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Enter a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="(Optional) Group by..."
          value={editedStep.group}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, group: val as string[] })}
          placeholder="Add columns"
          dataPath=".group"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="(Optional) New column name:"
          value={editedStep.newColumnName}
          placeholder={`${editedStep.column}_PCT`}
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default PercentageStepForm;
