import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './ConvertStepForm.module.scss';
import { ConvertStep } from '@/lib/steps';

const ConvertStepForm: React.FC<BaseStepFormProps<ConvertStep>> = (props) => {
  const {
    initialStepValue = { name: 'convert', columns: [], dataType: 'text' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  // We need to ensure dataType is valid, if it comes as empty string it might fail validation but we can default it.
  const safeInitialValue = { ...initialStepValue, ...stepFormDefaults };
  if (!safeInitialValue.dataType) {
     (safeInitialValue as any).dataType = 'text'; // Default to text to satisfy type, user will change it.
  }

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: safeInitialValue as ConvertStep,
  });

  const dataTypes = ['integer', 'float', 'text', 'date', 'boolean'];

  return (
    <StepFormWrapper
      title="Convert Columns Data Types"
      stepName="convert"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnsInput}>
        <MultiselectWidget
          name="Convert columns:"
          value={editedStep.columns}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, columns: val as string[] })}
          placeholder="Select column(s)"
          dataPath=".columns"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.typeInput}>
        <AutocompleteWidget
          name="To data type:"
          value={editedStep.dataType}
          options={dataTypes}
          onChange={(val) => setEditedStep({ ...editedStep, dataType: val as any })}
          placeholder="Select a data type"
          dataPath=".dataType"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ConvertStepForm;
