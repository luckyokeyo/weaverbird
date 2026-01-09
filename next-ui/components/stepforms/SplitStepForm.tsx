import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import InputTextWidget from './widgets/InputText';
import styles from './SplitStepForm.module.scss';
import { SplitStep } from '@/lib/steps';

const SplitStepForm: React.FC<BaseStepFormProps<SplitStep>> = (props) => {
  const {
    initialStepValue = { name: 'split', column: '', delimiter: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Split column"
      stepName="split"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnToSplit}>
        <ColumnPicker
          name="Split column..."
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Enter a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.delimiter}>
        <InputTextWidget
          name="Delimiter:"
          value={editedStep.delimiter}
          placeholder="Enter a text delimiter"
          onChange={(val) => setEditedStep({ ...editedStep, delimiter: val || '' })}
          // dataPath=".delimiter"
          // errors={errors}
        />
      </div>

      <div className={styles.numberColsToKeep}>
         <InputTextWidget
          name="Number of columns to keep:"
          value={editedStep.numberColsToKeep}
          placeholder="Enter an integer"
          onChange={(val) => setEditedStep({ ...editedStep, numberColsToKeep: val ? Number(val) : undefined })}
          // dataPath=".numberColsToKeep"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default SplitStepForm;
