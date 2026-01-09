import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import ListWidget from './widgets/List';
import InputTextWidget from './widgets/InputText';
import CheckboxWidget from './widgets/Checkbox';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './HierarchyStepForm.module.scss';
import { HierarchyStep } from '@/lib/steps';

const HierarchyStepForm: React.FC<BaseStepFormProps<HierarchyStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'hierarchy',
      hierarchyLevelColumn: 'hierarchy_level',
      hierarchy: [],
      includeNulls: false,
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Aggregate geographical data by hierarchy"
      stepName="hierarchy"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div style={{ marginBottom: 20 }}>
        <InputTextWidget
          name="Hierarchy level column"
          value={editedStep.hierarchyLevelColumn}
          placeholder="Hierarchy level column"
          onChange={(val) => setEditedStep({ ...editedStep, hierarchyLevelColumn: val || '' })}
          // dataPath=".hierarchyLevelColumn"
          // errors={errors}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <ListWidget
          name="Add hierarchy"
          addFieldName="Add hierarchy level"
          value={editedStep.hierarchy}
          onChange={(val) => setEditedStep({ ...editedStep, hierarchy: val })}
          widget={AutocompleteWidget}
          options={props.columnNames}
          defaultItem=""
          automaticNewField={false}
          dataPath=".hierarchy"
          errors={errors}
          componentProps={{ allowCustom: true }}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div>
        <CheckboxWidget
          label="Include null values in results"
          value={editedStep.includeNulls}
          onChange={(val) => setEditedStep({ ...editedStep, includeNulls: val })}
        />
      </div>
    </StepFormWrapper>
  );
};

export default HierarchyStepForm;
