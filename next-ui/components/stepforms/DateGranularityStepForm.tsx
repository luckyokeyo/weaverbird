import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './DateGranularityStepForm.module.scss';
import { DateGranularityStep, DateGranularity } from '@/lib/steps';

interface GranularityOption {
  info: DateGranularity;
  label: string;
}

const DateGranularityStepForm: React.FC<BaseStepFormProps<DateGranularityStep>> = (props) => {
  const {
    initialStepValue = { name: 'dategranularity', column: '', granularity: 'year' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const granularities: GranularityOption[] = [
    { info: 'year', label: 'year' },
    { info: 'quarter', label: 'quarter' },
    { info: 'month', label: 'month' },
    { info: 'isoWeek', label: 'ISO week (monday to monday)' },
    { info: 'week', label: 'week (sunday to sunday)' },
    { info: 'day', label: 'day' },
  ];

  // Ensure granularity is valid
  const safeInitialValue = { ...initialStepValue, ...stepFormDefaults };
  if (!safeInitialValue.granularity) {
      (safeInitialValue as any).granularity = 'year';
  }

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: safeInitialValue as DateGranularityStep,
  });

  const duplicateColumnName =
    editedStep.newColumn && props.columnNames?.includes(editedStep.newColumn)
      ? `A column with name "${editedStep.newColumn}" already exists. You will overwrite it.`
      : undefined;

  const granularity = granularities.find((d) => d.info === editedStep.granularity) || { info: editedStep.granularity as DateGranularity, label: editedStep.granularity };

  const handleGranularityChange = (val: GranularityOption | string) => {
      // Autocomplete returns string or option object
      const info = typeof val === 'string' ? val : val.info;
      setEditedStep({ ...editedStep, granularity: info as DateGranularity });
  };

  return (
    <StepFormWrapper
      title="Normalize Date Granularity"
      stepName="dategranularity"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.column}>
        <ColumnPicker
          name="Date column:"
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Pick a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.dateInfoInput}>
        <AutocompleteWidget
            name="Date granularity to apply:"
            value={granularity}
            options={granularities}
            onChange={(val) => handleGranularityChange(val as GranularityOption | string)}
            trackBy="info"
            label="label"
            placeholder="Select one or several"
            dataPath=".granularity"
            availableVariables={props.availableVariables}
            variableDelimiters={props.variableDelimiters}
            trustedVariableDelimiters={props.trustedVariableDelimiters}
            // errors={errors}
        />
      </div>

      <div className={styles.newColumnInput}>
        <InputTextWidget
          name="New column:"
          value={editedStep.newColumn}
          placeholder="Enter a new column name or leave empty to overwrite the original one"
          onChange={(val) => setEditedStep({ ...editedStep, newColumn: val || '' })}
          // dataPath=".newColumn"
          // errors={errors}
          messageWarning={duplicateColumnName}
        />
      </div>
    </StepFormWrapper>
  );
};

export default DateGranularityStepForm;
