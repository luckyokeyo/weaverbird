import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import styles from './SelectColumnStepForm.module.scss';
import { SelectStep } from '@/lib/steps';

const SelectColumnStepForm: React.FC<BaseStepFormProps<SelectStep>> = (props) => {
  const {
    initialStepValue = { name: 'select', columns: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Keep columns"
      stepName="select"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnsInput}>
        <MultiselectWidget
          name="Keep columns..."
          value={editedStep.columns}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, columns: val as string[] })}
          placeholder="Add columns"
          dataPath=".columns"
          // errors={errors}
          allowCustom={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default SelectColumnStepForm;
