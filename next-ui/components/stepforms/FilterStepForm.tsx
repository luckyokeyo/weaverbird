import React, { useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import FilterEditor from '@/components/FilterEditor';
import { FilterStep, FilterSimpleCondition } from '@/lib/steps';
import styles from './FilterStepForm.module.scss';

const FilterStepForm: React.FC<BaseStepFormProps<FilterStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'filter',
      condition: { column: '', value: '', operator: 'eq' },
    },
    stepFormDefaults,
    isStepCreation = true,
    selectedColumns = [],
    onFormSaved,
  } = props;

  const getInitialStep = (): FilterStep => {
    // Logic from Vue created()
    if (isStepCreation && selectedColumns[0]) {
      const condition: FilterSimpleCondition = {
         column: selectedColumns[0],
         value: '',
         operator: 'eq'
      };
      return {
        name: 'filter',
        condition,
      };
    }
    return { ...initialStepValue, ...stepFormDefaults };
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const handleFilterTreeUpdated = (newFilterTree: any) => {
    setEditedStep({
      name: 'filter',
      condition: newFilterTree,
    });
  };

  // We might need onSetSelectedColumns from props if parent handles it.
  // Although FilterEditor emits it, and in Vue it emitted "setSelectedColumns".
  // The BaseStepFormProps doesn't have it explicitly, but we can access `props`.
  // Wait, BaseStepFormProps defined `onFormSaved` and `onBack`.
  // It seems we didn't add `onSetSelectedColumns` to BaseStepFormProps, but `StepForm.vue` emits it.
  // We should add it to BaseStepFormProps if we want to support it.

  return (
    <StepFormWrapper
      title="Filter"
      stepName="filter"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.filterFormInfo}>Filter rows matching this condition:</div>
      <FilterEditor
        filterTree={editedStep.condition}
        errors={errors || undefined}
        availableVariables={props.availableVariables}
        variableDelimiters={props.variableDelimiters}
        trustedVariableDelimiters={props.trustedVariableDelimiters}
        columnTypes={props.columnTypes}
        onFilterTreeUpdated={handleFilterTreeUpdated}
        // onSetSelectColumns={props.onSetSelectedColumns} // If we add it to props
      />
    </StepFormWrapper>
  );
};

export default FilterStepForm;
