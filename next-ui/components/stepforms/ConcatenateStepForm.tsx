import React, { useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import InputTextWidget from './widgets/InputText';
import ListWidget from './widgets/List';
import ColumnPicker from './ColumnPicker';
import styles from './ConcatenateStepForm.module.scss';
import { ConcatenateStep } from '@/lib/steps';

const ConcatenateStepForm: React.FC<BaseStepFormProps<ConcatenateStep>> = (props) => {
  const {
    initialStepValue = { name: 'concatenate', columns: [''], separator: '', newColumnName: '' },
    stepFormDefaults,
    onFormSaved,
    isStepCreation,
    selectedColumns,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  useEffect(() => {
    if (isStepCreation && selectedColumns && selectedColumns[0]) {
      setEditedStep({
        name: 'concatenate',
        columns: [selectedColumns[0]],
        separator: '',
        newColumnName: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const toConcatenate = editedStep.columns.length ? editedStep.columns : [''];

  return (
    <StepFormWrapper
      title="Concatenate columns"
      stepName="concatenate"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.toConcatenate}>
        <ListWidget
          name="Columns to concatenate:"
          addFieldName="Add columns"
          value={toConcatenate}
          onChange={(val) => setEditedStep({ ...editedStep, columns: val })}
          widget={ColumnPicker}
          componentProps={{ syncWithSelectedColumn: false }}
          automaticNewField={false}
          dataPath=".columns"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.separator}>
        <InputTextWidget
          name="Separator:"
          value={editedStep.separator}
          placeholder="Enter string of any length"
          onChange={(val) => setEditedStep({ ...editedStep, separator: val || '' })}
          // dataPath=".separator"
          // errors={errors}
        />
      </div>

      <div className={styles.newColumnName}>
        <InputTextWidget
          name="New column name:"
          value={editedStep.newColumnName}
          placeholder="Enter a columnn name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumnName: val || '' })}
          // dataPath=".newColumnName"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ConcatenateStepForm;
