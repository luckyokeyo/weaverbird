import React, { useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import RenameWidget from './widgets/Rename';
import ListWidget from './widgets/List';
import { RenameStep } from '@/lib/steps';

// Since RenameWidget is a complex widget used in ListWidget, we need to pass it correctly.
// In Vue: :widget="renameWidget" where renameWidget is the component constructor.

const RenameStepForm: React.FC<BaseStepFormProps<RenameStep>> = (props) => {
  const {
    initialStepValue = { name: 'rename', toRename: [['', '']] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  // Pre-process initial value to handle legacy format (oldname, newname)
  // This logic was in Vue component
  const getInitialStep = (): RenameStep => {
    const initial = { ...initialStepValue, ...stepFormDefaults };
    if (initial.oldname && initial.newname) {
      return {
        ...initial,
        toRename: [[initial.oldname, initial.newname]],
        oldname: undefined,
        newname: undefined,
      };
    }
    return initial;
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  // Handle selected column updates
  // In Vue: set stepSelectedColumn(colname) -> updates first empty toRename
  // We can replicate this logic if needed.
  useEffect(() => {
     if (props.selectedColumns && props.selectedColumns.length > 0) {
         const col = props.selectedColumns[0];
         // Check if we need to auto-fill
         // Logic from Vue: if(colname !== null && this.editedStep.toRename[0][0] === '')
         if (editedStep.toRename.length > 0 && editedStep.toRename[0][0] === '') {
             const newToRename = [...editedStep.toRename];
             newToRename[0] = [col, newToRename[0][1]];
             setEditedStep({ ...editedStep, toRename: newToRename });
         }
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedColumns]); // run when selectedColumns changes

  // Also when submitting, we might want to update selected columns
  // In Vue: submit() { super.submit(); if no errors setSelectedColumns(...) }
  // Here submit calls onFormSaved. We can wrap it.
  const handleSubmit = () => {
      // We can't easily intercept "no errors" from here unless `submit` returns result.
      // But `useStepForm`'s submit calls onFormSaved only if valid.
      // So we can do it in onFormSaved in the parent, OR we can modify useStepForm to return validity.
      // But for now, let's just submit. The parent (whoever renders RenameStepForm) handles onFormSaved.
      // If we need to update selected columns in the app state, it should be done there or we need a callback.
      submit();
  };

  return (
    <StepFormWrapper
      title="Rename Column"
      stepName="rename"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <ListWidget
        name="Columns to rename:"
        addFieldName="Add column"
        value={editedStep.toRename}
        onChange={(newValue) => setEditedStep({ ...editedStep, toRename: newValue })}
        widget={RenameWidget}
        automaticNewField={false}
        defaultItem={['', '']}
        dataPath=".toRename"
        errors={errors}
        availableVariables={props.availableVariables}
        variableDelimiters={props.variableDelimiters}
        trustedVariableDelimiters={props.trustedVariableDelimiters}
        unstyledItems={true}
        columnNames={props.columnNames ? Object.keys(props.columnTypes || {}) : []}
        // Note: props.columnTypes is passed, we derive columnNames.
        // Wait, BaseStepForm has `get columnNames() { return Object.keys(this.columnTypes); }`
        // So we should pass keys of columnTypes.
        selectedColumns={props.selectedColumns}
        // onSetSelectedColumns we might need to expose from props if parent handles it
      />
    </StepFormWrapper>
  );
};

export default RenameStepForm;
