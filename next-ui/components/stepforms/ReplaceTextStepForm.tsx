import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './ReplaceTextStepForm.module.scss';
import { ReplaceTextStep } from '@/lib/steps';

const ReplaceTextStepForm: React.FC<BaseStepFormProps<ReplaceTextStep>> = (props) => {
  const {
    initialStepValue = { name: 'replacetext', searchColumn: '', oldStr: '', newStr: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Replace text"
      stepName="replacetext"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.column}>
        <ColumnPicker
          name="Extract a substring from..."
          value={editedStep.searchColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, searchColumn: val })}
          placeholder="Enter a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <InputTextWidget
          value={editedStep.oldStr}
          name="Old string"
          placeholder="Text to replace"
          onChange={(val) => setEditedStep({ ...editedStep, oldStr: val || '' })}
          // errors={errors}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <InputTextWidget
          value={editedStep.newStr}
          name="New string"
          placeholder="Replacement text"
          onChange={(val) => setEditedStep({ ...editedStep, newStr: val || '' })}
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ReplaceTextStepForm;
