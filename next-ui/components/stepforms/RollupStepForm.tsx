import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import ListWidget from './widgets/List';
import InputTextWidget from './widgets/InputText';
import AggregationWidget from './widgets/Aggregation';
import styles from './RollupStepForm.module.scss';
import { RollupStep, Aggregation } from '@/lib/steps';
import { setAggregationsNewColumnsInStep } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

const RollupStepForm: React.FC<BaseStepFormProps<RollupStep>> = (props) => {
  const {
    initialStepValue = { name: 'rollup', hierarchy: [], aggregations: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const getInitialStep = (): RollupStep => {
      const initial = { ...initialStepValue, ...stepFormDefaults };
      const aggregations = (initial.aggregations || []).map((x) => ({
        ...x,
        columns: x.column ? [x.column] : x.columns,
        newcolumns: x.newcolumn ? [x.newcolumn] : x.newcolumns,
        column: undefined,
        newcolumn: undefined,
      }));
      return { ...initial, aggregations };
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const defaultAggregation: Aggregation = {
    columns: [],
    newcolumns: [],
    aggfunction: 'sum',
  };

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    setAggregationsNewColumnsInStep(step);
    submit(step);
  };

  const groupby = editedStep.groupby || [];

  return (
    <StepFormWrapper
      title="Hierarchical rollup"
      stepName="rollup"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.hierarchyColumnsInput}>
        <MultiselectWidget
          name="Hierarchical columns (from top to bottom level):"
          value={editedStep.hierarchy}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, hierarchy: val as string[] })}
          placeholder="Add columns"
          dataPath=".hierarchy"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.aggregationsInput}>
        <ListWidget
          name="(Optional) Columns to aggregate:"
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

      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="(Optional) Group rollup by:"
          value={groupby}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groupby: (val && val.length > 0) ? (val as string[]) : undefined })}
          placeholder="Add columns"
          dataPath=".groupby"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.labelColumnInput}>
        <InputTextWidget
          name="(Optional) Label column name to be created:"
          value={editedStep.labelCol}
          placeholder="label"
          onChange={(val) => setEditedStep({ ...editedStep, labelCol: val })}
          // dataPath=".labelCol"
          // errors={errors}
        />
      </div>

      <div className={styles.levelColumnInput}>
        <InputTextWidget
          name="(Optional) Level column name to be created:"
          value={editedStep.levelCol}
          placeholder="level"
          onChange={(val) => setEditedStep({ ...editedStep, levelCol: val })}
          // dataPath=".levelCol"
          // errors={errors}
        />
      </div>

      <div className={styles.childLevelColumnInput}>
        <InputTextWidget
          name="(Optional) Child level column name to be created:"
          value={editedStep.childLevelCol}
          placeholder="child_level"
          onChange={(val) => setEditedStep({ ...editedStep, childLevelCol: val })}
          // dataPath=".childLevelCol"
          // errors={errors}
        />
      </div>

      <div className={styles.parentColumnInput}>
        <InputTextWidget
          name="(Optional) Parent column name to be created:"
          value={editedStep.parentLabelCol}
          placeholder="parent"
          onChange={(val) => setEditedStep({ ...editedStep, parentLabelCol: val })}
          // dataPath=".parentLabelCol"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default RollupStepForm;
