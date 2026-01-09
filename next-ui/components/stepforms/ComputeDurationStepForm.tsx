import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './ComputeDurationStepForm.module.scss';
import { ComputeDurationStep } from '@/lib/steps';

type DurationUnit = 'days' | 'hours' | 'minutes' | 'seconds';

const ComputeDurationStepForm: React.FC<BaseStepFormProps<ComputeDurationStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'duration',
      newColumnName: '',
      startDateColumn: '',
      endDateColumn: '',
      durationIn: 'days',
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

  const durationUnits: DurationUnit[] = ['days', 'hours', 'minutes', 'seconds'];

  return (
    <StepFormWrapper
      title="Compute Duration"
      stepName="duration"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="New colum name:"
          value={editedStep.newColumnName}
          placeholder="Enter a new column name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          messageWarning={duplicateColumnName}
        />
      </div>

      <div className={styles.startDateColumnInput}>
        <ColumnPicker
          name="Start date column:"
          value={editedStep.startDateColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, startDateColumn: val })}
          placeholder="Select a column"
          dataPath=".startDateColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.endDateColumnInput}>
        <ColumnPicker
          name="End date column:"
          value={editedStep.endDateColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, endDateColumn: val })}
          placeholder="Select a column"
          dataPath=".endDateColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.durationInInput}>
        <AutocompleteWidget
          name="Compute duration in:"
          value={editedStep.durationIn}
          options={durationUnits}
          onChange={(val) => setEditedStep({ ...editedStep, durationIn: val as DurationUnit })}
          dataPath=".durationIn"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ComputeDurationStepForm;
