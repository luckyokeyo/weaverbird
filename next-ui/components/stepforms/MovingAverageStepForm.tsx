import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import MultiselectWidget from './widgets/Multiselect';
import styles from './MovingAverageStepForm.module.scss';
import { MovingAverageStep } from '@/lib/steps';

const MovingAverageStepForm: React.FC<BaseStepFormProps<MovingAverageStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'movingaverage',
      valueColumn: '',
      columnToSort: '',
      movingWindow: null as any, // movingWindow is number, assuming null is allowed initially?
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Computate Moving Average"
      stepName="movingaverage"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.valueColumnInput}>
        <ColumnPicker
          name="Value column:"
          value={editedStep.valueColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, valueColumn: val })}
          placeholder="Select a column"
          dataPath=".valueColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.columnToSortInput}>
        <ColumnPicker
          name="Reference column to sort (usually dates):"
          value={editedStep.columnToSort}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, columnToSort: val })}
          placeholder="Select a column"
          dataPath=".columnToSort"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.movingWindowInput}>
        <InputTextWidget
          name="Moving window (in number of rows):"
          value={editedStep.movingWindow}
          placeholder="Enter a number of rows"
          onChange={(val) => setEditedStep({ ...editedStep, movingWindow: val ? Number(val) : 0 })}
          // dataPath=".movingWindow"
          // errors={errors} // Need to map errors correctly if needed
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>

      <div className={styles.groupsInput}>
        <MultiselectWidget
          name="(Optional) Group by:"
          value={editedStep.groups}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groups: val as string[] })}
          placeholder="Select columns"
          dataPath=".groups"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="(Optional) New column name:"
          value={editedStep.newColumnName}
          placeholder={`${editedStep.valueColumn}_MOVING_AVG`}
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default MovingAverageStepForm;
