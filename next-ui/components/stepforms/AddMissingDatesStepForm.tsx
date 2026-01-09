import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import AutocompleteWidget from './widgets/Autocomplete';
import MultiselectWidget from './widgets/Multiselect';
import styles from './AddMissingDatesStepForm.module.scss';
import { AddMissingDatesStep } from '@/lib/steps';

type DateGranularity = 'day' | 'month' | 'year';

const AddMissingDatesStepForm: React.FC<BaseStepFormProps<AddMissingDatesStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'addmissingdates',
      datesColumn: '',
      datesGranularity: 'day',
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const datesGranularities: DateGranularity[] = ['day', 'month', 'year'];

  return (
    <StepFormWrapper
      title="Add Missing Dates"
      stepName="addmissingdates"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.datesColumnInput}>
        <ColumnPicker
          name="Dates column:"
          value={editedStep.datesColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, datesColumn: val })}
          placeholder="Select a column"
          dataPath=".datesColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.datesGranularityInput}>
        <AutocompleteWidget
          name="Dates granularity:"
          value={editedStep.datesGranularity}
          options={datesGranularities}
          onChange={(val) => setEditedStep({ ...editedStep, datesGranularity: val as DateGranularity })}
          dataPath=".datesGranularity"
          // errors={errors}
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
    </StepFormWrapper>
  );
};

export default AddMissingDatesStepForm;
