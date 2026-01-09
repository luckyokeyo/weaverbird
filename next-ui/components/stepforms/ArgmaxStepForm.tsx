import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import MultiselectWidget from './widgets/Multiselect';
import styles from './ArgmaxStepForm.module.scss';
import { ArgmaxStep } from '@/lib/steps';

const ArgmaxStepForm: React.FC<BaseStepFormProps<ArgmaxStep>> = (props) => {
  const {
    initialStepValue = { name: 'argmax', column: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Argmax"
      stepName="argmax"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.valueColumnInput}>
        <ColumnPicker
          name="Search max value in..."
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Enter a column name"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="(Optional) Group by..."
          value={editedStep.groups}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groups: val as string[] })}
          placeholder="Add columns"
          dataPath=".groups"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          allowCustom={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ArgmaxStepForm;
