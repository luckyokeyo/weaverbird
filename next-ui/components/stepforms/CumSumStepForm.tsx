import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import ListWidget from './widgets/List';
import MultiselectWidget from './widgets/Multiselect';
import CumSumWidget from './widgets/CumSum';
import styles from './CumSumStepForm.module.scss';
import { CumSumStep } from '@/lib/steps';

const CumSumStepForm: React.FC<BaseStepFormProps<CumSumStep>> = (props) => {
  const {
    initialStepValue = { name: 'cumsum', toCumSum: [['', '']], referenceColumn: '' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const getInitialStep = (): CumSumStep => {
      const initial = { ...initialStepValue, ...stepFormDefaults };
      // Compatibility logic
      if ('valueColumn' in initial && (initial as any).valueColumn) {
          const valueColumn = (initial as any).valueColumn;
          delete (initial as any).valueColumn;
          initial.toCumSum = [[valueColumn, '']];

          if ('newColumn' in initial && (initial as any).newColumn) {
              const newColumn = (initial as any).newColumn;
              delete (initial as any).newColumn;
              initial.toCumSum[0][1] = newColumn;
          }
      }
      return initial;
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const toCumSum = editedStep.toCumSum.length ? editedStep.toCumSum : [['', '']];

  return (
    <StepFormWrapper
      title="Compute cumulated sum"
      stepName="cumsum"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.toReplace}>
        <ListWidget
          name="Columns to cumulate :"
          addFieldName="Add column"
          value={toCumSum}
          onChange={(val) => setEditedStep({ ...editedStep, toCumSum: val })}
          widget={CumSumWidget}
          defaultItem={['', '']}
          automaticNewField={false}
          dataPath=".toCumSum"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          unstyledItems={true}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.referenceColumnInput}>
        <ColumnPicker
          name="Reference column to sort (usually dates)"
          value={editedStep.referenceColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, referenceColumn: val })}
          placeholder="Enter a column"
          dataPath=".referenceColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.groupbyInput}>
        <MultiselectWidget
          name="(Optional) Group cumulated sum by:"
          value={editedStep.groupby}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groupby: val as string[] })}
          placeholder="Add columns"
          dataPath=".groupby"
          // errors={errors}
          allowCustom={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default CumSumStepForm;
