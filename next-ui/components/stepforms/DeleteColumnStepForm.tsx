import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import styles from './DeleteColumnStepForm.module.scss';
import { DeleteStep } from '@/lib/steps';

const DeleteColumnStepForm: React.FC<BaseStepFormProps<DeleteStep>> = (props) => {
  const {
    initialStepValue = { name: 'delete', columns: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Delete Columns"
      stepName="delete"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnsInput}>
        <MultiselectWidget
          name="Delete columns..."
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

export default DeleteColumnStepForm;
