import React, { useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ListWidget from './widgets/List';
import SortColumnWidget from './widgets/SortColumn';
import styles from './SortStepForm.module.scss';
import { SortStep } from '@/lib/steps';

const SortStepForm: React.FC<BaseStepFormProps<SortStep>> = (props) => {
  const {
    initialStepValue = { name: 'sort', columns: [{ column: '', order: 'asc' }] },
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
    if (
      editedStep.columns.length > 0 &&
      editedStep.columns[0].column === '' &&
      selectedColumns &&
      selectedColumns.length > 0
    ) {
      setEditedStep({
        ...editedStep,
        columns: [
          {
            column: selectedColumns[0],
            order: 'asc',
          },
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // On mount

  return (
    <StepFormWrapper
      title="Sort"
      stepName="sort"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.sortColumn}>
        <ListWidget
          name=""
          addFieldName="Add Column"
          value={editedStep.columns}
          onChange={(val) => setEditedStep({ ...editedStep, columns: val })}
          widget={SortColumnWidget}
          defaultItem={{ column: '', order: 'asc' }}
          automaticNewField={false}
          dataPath=".columns"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>
    </StepFormWrapper>
  );
};

export default SortStepForm;
