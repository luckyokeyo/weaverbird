import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import ListWidget from './widgets/List';
import AggregationWidget from './widgets/Aggregation';
import CheckboxWidget from './widgets/Checkbox';
import styles from './DissolveStepForm.module.scss';
import { DissolveStep, Aggregation } from '@/lib/steps';
import { suffixAggregationsColumns } from './utils';
import cloneDeep from 'lodash/cloneDeep';

const DissolveStepForm: React.FC<BaseStepFormProps<DissolveStep>> = (props) => {
  const {
    initialStepValue = { name: 'dissolve', groups: [], includeNulls: false, aggregations: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const defaultAggregation: Aggregation = {
    columns: [],
    newcolumns: [],
    aggfunction: 'sum',
  };

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    suffixAggregationsColumns(step);
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Dissolve"
      stepName="dissolve"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="Group rows by..."
          value={editedStep.groups}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groups: val as string[] })}
          placeholder="Add columns"
          dataPath=".groups"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          allowCustom={true}
        />
      </div>

      <div className={styles.toremove}>
        <ListWidget
          name="And aggregate..."
          addFieldName="Add aggregation"
          value={editedStep.aggregations}
          onChange={(val) => setEditedStep({ ...editedStep, aggregations: val })}
          widget={AggregationWidget}
          defaultItem={defaultAggregation}
          automaticNewField={false}
          dataPath=".aggregations"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.keepNullsCheckbox}>
        <CheckboxWidget
          label="Include null values in results"
          value={editedStep.includeNulls}
          onChange={(val) => setEditedStep({ ...editedStep, includeNulls: val })}
        />
      </div>
    </StepFormWrapper>
  );
};

export default DissolveStepForm;
