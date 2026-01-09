import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './SubstringStepForm.module.scss';
import { SubstringStep } from '@/lib/steps';

const SubstringStepForm: React.FC<BaseStepFormProps<SubstringStep>> = (props) => {
  const {
    initialStepValue = { name: 'substring', column: '', startIndex: 1, endIndex: -1 },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Extract substring"
      stepName="substring"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.column}>
        <ColumnPicker
          name="Extract a substring from..."
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Enter a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>

      <div className={styles.startIndex}>
        <InputTextWidget
          name="Substring starts at character position:"
          value={editedStep.startIndex}
          placeholder="Enter an integer"
          onChange={(val) => setEditedStep({ ...editedStep, startIndex: val ? Number(val) : 0 })}
          // dataPath=".startIndex"
          // errors={errors}
        />
      </div>

      <div className={styles.endIndex}>
        <InputTextWidget
          name="And ends at character position:"
          value={editedStep.endIndex}
          placeholder="Enter an integer"
          onChange={(val) => setEditedStep({ ...editedStep, endIndex: val ? Number(val) : -1 })}
          // dataPath=".endIndex"
          // errors={errors}
        />
      </div>

      <div className={styles.newColumnNameInput}>
        <InputTextWidget
          name="(Optional) New column name:"
          value={editedStep.newColumnName}
          placeholder={`${editedStep.column}_SUBSTR`}
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default SubstringStepForm;
