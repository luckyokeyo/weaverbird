import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import styles from './TrimStepForm.module.scss';
import { TrimStep } from '@/lib/steps';

const TrimStepForm: React.FC<BaseStepFormProps<TrimStep>> = (props) => {
  const {
    initialStepValue = { name: 'trim', columns: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Trim Columns"
      stepName="trim"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnsInput}>
        <MultiselectWidget
          name="Trim columns..."
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

export default TrimStepForm;
