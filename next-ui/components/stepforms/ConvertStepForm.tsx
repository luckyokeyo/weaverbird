import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './ConvertStepForm.module.scss';
import { ConvertStep } from '@/lib/steps';

const ConvertStepForm: React.FC<BaseStepFormProps<ConvertStep>> = (props) => {
  const {
    initialStepValue = { name: 'convert', columns: [], dataType: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
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
          onChange={(val) => setEditedStep({ ...editedStep, dataType: val as string })}
          placeholder="Select a data type"
          dataPath=".dataType"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ConvertStepForm;
