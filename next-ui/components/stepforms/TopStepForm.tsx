import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import AutocompleteWidget from './widgets/Autocomplete';
import MultiselectWidget from './widgets/Multiselect';
import styles from './TopStepForm.module.scss';
import { TopStep } from '@/lib/steps';

const TopStepForm: React.FC<BaseStepFormProps<TopStep>> = (props) => {
  const {
    initialStepValue = { name: 'top', rankOn: '', sort: 'desc', limit: 10 },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Top N rows"
      stepName="top"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.limitInput}>
         <InputTextWidget
          name="Get top..."
          value={editedStep.limit}
          placeholder="Enter a number of rows"
          onChange={(val) => setEditedStep({ ...editedStep, limit: val ? Number(val) : 10 })}
          // dataPath=".limit"
          // errors={errors}
        />
      </div>

      <div className={styles.rankOnInput}>
        <ColumnPicker
          name="Sort column..."
          value={editedStep.rankOn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, rankOn: val })}
          placeholder="Enter a column"
          dataPath=".rankOn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.sortOrderInput}>
        <AutocompleteWidget
            name="Sort order:"
            value={editedStep.sort}
            options={['asc', 'desc']}
            onChange={(val) => setEditedStep({ ...editedStep, sort: val as 'asc' | 'desc' })}
            placeholder="Select an order"
            dataPath=".sort"
            // errors={errors}
        />
      </div>

      <div className={styles.groupbyColumnsInput}>
         <MultiselectWidget
          name="(Optional) Group by..."
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

export default TopStepForm;
