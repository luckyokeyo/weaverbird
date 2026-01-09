import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import styles from './UniqueGroupsStepForm.module.scss';
import { UniqueGroupsStep } from '@/lib/steps';

const UniqueGroupsStepForm: React.FC<BaseStepFormProps<UniqueGroupsStep>> = (props) => {
  const {
    initialStepValue = { name: 'uniquegroups', on: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Get unique groups/values"
      stepName="uniquegroups"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="Get unique groups/values in columns:"
          value={editedStep.on}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, on: val as string[] })}
          placeholder="Add columns"
          dataPath=".on"
          // errors={errors}
          allowCustom={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default UniqueGroupsStepForm;
