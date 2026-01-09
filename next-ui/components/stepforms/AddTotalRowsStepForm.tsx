import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ListWidget from './widgets/List';
import MultiselectWidget from './widgets/Multiselect';
import TotalDimensionsWidget from './widgets/TotalDimensions';
import AggregationWidget from './widgets/Aggregation';
import styles from './AddTotalRowsStepForm.module.scss';
import { AddTotalRowsStep, Aggregation, TotalDimension } from '@/lib/steps';
import { setAggregationsNewColumnsInStep } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

const AddTotalRowsStepForm: React.FC<BaseStepFormProps<AddTotalRowsStep>> = (props) => {
  const {
    initialStepValue = { name: 'totals', totalDimensions: [], aggregations: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const defaultTotalDimensions: TotalDimension = { totalColumn: '', totalRowsLabel: '' };
  const defaultAggregation: Aggregation = {
    columns: [],
    newcolumns: [],
    aggfunction: 'sum',
  };

  const totalDimensions = editedStep.totalDimensions.length
    ? editedStep.totalDimensions
    : [defaultTotalDimensions];

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    setAggregationsNewColumnsInStep(step);
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Add Total Rows"
      stepName="totals"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.totals}>
        <ListWidget
          name="Columns to compute total rows in:"
          addFieldName="Add new column"
          value={totalDimensions}
          onChange={(val) => setEditedStep({ ...editedStep, totalDimensions: val })}
          widget={TotalDimensionsWidget}
          defaultItem={defaultTotalDimensions}
          automaticNewField={false}
          dataPath=".totalDimensions"
          errors={errors}
          unstyledItems={true}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.aggregationsInput}>
        <ListWidget
          name="Columns to aggregate:"
          addFieldName="Add aggregation"
          value={editedStep.aggregations}
          onChange={(val) => setEditedStep({ ...editedStep, aggregations: val })}
          widget={AggregationWidget}
          defaultItem={defaultAggregation}
          automaticNewField={false}
          dataPath=".aggregations"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.groupsInput}>
        <MultiselectWidget
          name="(Optional) Group by:"
          value={editedStep.groups}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groups: val as string[] })}
          placeholder="Add columns"
          dataPath=".groups"
          // errors={errors}
          allowCustom={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default AddTotalRowsStepForm;
