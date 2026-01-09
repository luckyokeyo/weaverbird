import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import ListWidget from './widgets/List';
import AggregationWidget from './widgets/Aggregation';
import CheckboxWidget from './widgets/Checkbox';
import { AggregateStep, Aggregation } from '@/lib/steps';
import { suffixAggregationsColumns } from './utils';
import styles from './AggregateStepForm.module.scss';
import { cloneDeep } from 'lodash';

const AggregateStepForm: React.FC<BaseStepFormProps<AggregateStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'aggregate',
      on: [],
      aggregations: [],
      keepOriginalGranularity: false,
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const defaultAggregation: Aggregation = {
    columns: [],
    newcolumns: [],
    aggfunction: 'sum',
  };

  const getInitialStep = (): AggregateStep => {
     // Migration logic from Vue
     const initial = { ...initialStepValue, ...stepFormDefaults };
     const aggregations = (initial.aggregations || []).map((x) => ({
        ...x,
        columns: x.column ? [x.column] : x.columns,
        newcolumns: x.newcolumn ? [x.newcolumn] : x.newcolumns,
        column: undefined,
        newcolumn: undefined,
     }));

     return {
         ...initial,
         aggregations,
         keepOriginalGranularity: initial.keepOriginalGranularity ?? false,
         countNulls: initial.countNulls ?? false,
     };
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const aggregations = editedStep.aggregations.length ? editedStep.aggregations : [defaultAggregation];

  const handleSubmit = () => {
    const stepToSave = cloneDeep(editedStep);
    // Ensure aggregations exist
    if (stepToSave.aggregations.length === 0) {
        stepToSave.aggregations = [defaultAggregation];
    }
    suffixAggregationsColumns(stepToSave);
    submit(stepToSave);
  };

  return (
    <StepFormWrapper
      title="Aggregate"
      stepName="aggregate"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
            name="Group rows by..."
            value={editedStep.on}
            options={props.columnNames || []}
            onChange={(val) => {
                const newOn = val as string[];
                setEditedStep({ ...editedStep, on: newOn });
            }}
            placeholder="Add columns"
            dataPath=".on"
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
            value={aggregations}
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
        />
      </div>

      <div className={styles.keepOriginalGranularityCheckbox}>
        <CheckboxWidget
            label="Keep original granularity and add aggregation(s) in new column(s)"
            value={editedStep.keepOriginalGranularity || false}
            onChange={(val) => setEditedStep({ ...editedStep, keepOriginalGranularity: val })}
        />
      </div>

      <div className={styles.countNullsCheckbox}>
        <CheckboxWidget
            label="Count null values like regular values"
            value={editedStep.countNulls || false}
            onChange={(val) => setEditedStep({ ...editedStep, countNulls: val })}
        />
      </div>

    </StepFormWrapper>
  );
};

export default AggregateStepForm;
