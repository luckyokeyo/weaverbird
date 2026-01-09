import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import AutocompleteWidget from './widgets/Autocomplete';
import MultiselectWidget from './widgets/Multiselect';
import styles from './RankStepForm.module.scss';
import { RankStep } from '@/lib/steps';

const RankStepForm: React.FC<BaseStepFormProps<RankStep>> = (props) => {
  const {
    initialStepValue = { name: 'rank', valueCol: '', order: 'desc', method: 'standard' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Compute rank"
      stepName="rank"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.valueColInput}>
        <ColumnPicker
          name="Value column to rank:"
          value={editedStep.valueCol}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, valueCol: val })}
          placeholder="Select a column"
          dataPath=".valueCol"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.orderInput}>
        <AutocompleteWidget
          name="Sort order:"
          value={editedStep.order}
          options={['asc', 'desc']}
          onChange={(val) => setEditedStep({ ...editedStep, order: val as 'asc' | 'desc' })}
          dataPath=".order"
        />
      </div>

      <div className={styles.methodInput}>
        <AutocompleteWidget
          name="Ranking method:"
          value={editedStep.method}
          options={['standard', 'dense']}
          onChange={(val) => setEditedStep({ ...editedStep, method: val as 'standard' | 'dense' })}
          dataPath=".method"
        />
      </div>

      <div className={styles.groupbyInput}>
         <MultiselectWidget
          name="(Optional) Group ranking by:"
          value={editedStep.groupby}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groupby: val as string[] })}
          placeholder="Add columns"
          dataPath=".groupby"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="(Optional) New column name:"
          value={editedStep.newColumnName}
          placeholder={`${editedStep.valueCol}_RANK`}
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default RankStepForm;
