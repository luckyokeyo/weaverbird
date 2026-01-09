import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import ColumnPicker from './ColumnPicker';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './PivotStepForm.module.scss';
import { PivotStep } from '@/lib/steps';

const PivotStepForm: React.FC<BaseStepFormProps<PivotStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'pivot',
      index: [],
      columnToPivot: '',
      valueColumn: '',
      aggFunction: 'sum',
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit, validate: baseValidate, setErrors } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const aggregationFunctions: PivotStep['aggFunction'][] = ['sum', 'avg', 'count', 'min', 'max'];

  const validate = () => {
    let isValid = baseValidate();
    const { columnToPivot, valueColumn, index } = editedStep;

    const extraErrors = [];
    if (columnToPivot === valueColumn || index.includes(columnToPivot)) {
      extraErrors.push({
        params: {},
        schemaPath: '.columnToPivot',
        keyword: 'columnNameConflict',
        dataPath: '.columnToPivot',
        message: `Column name ${columnToPivot} is used at least twice but should be unique`,
      });
      isValid = false;
    } else if (index.includes(valueColumn)) {
        extraErrors.push({
        params: {},
        schemaPath: '.valueColumn',
        keyword: 'columnNameConflict',
        dataPath: '.valueColumn',
        message: `Column name ${valueColumn} is used at least twice but should be unique`,
      });
      isValid = false;
    }

    if (!isValid && extraErrors.length > 0) {
        setErrors((prev) => [...(prev || []), ...extraErrors]);
        return false;
    }

    return isValid;
  };

  const handleSubmit = () => {
      if (validate()) {
          onFormSaved(editedStep);
      }
  };

  return (
    <StepFormWrapper
      title="Pivot column"
      stepName="pivot"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.indexInput}>
        <MultiselectWidget
          name="Keep columns..."
          value={editedStep.index}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, index: val as string[] })}
          placeholder="Add columns"
          dataPath=".index"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.columnToPivotInput}>
        <ColumnPicker
          name="Pivot column..."
          value={editedStep.columnToPivot}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, columnToPivot: val })}
          placeholder="Enter a column"
          dataPath=".columnToPivot"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>

      <div className={styles.valueColumnInput}>
         <AutocompleteWidget
            name="Use values in..."
            value={editedStep.valueColumn}
            options={props.columnNames || []}
            onChange={(val) => setEditedStep({ ...editedStep, valueColumn: val as string })}
            placeholder="Select a column"
            dataPath=".valueColumn"
            // errors={errors}
            allowCustom={true}
         />
      </div>

      <div className={styles.aggregationFunctionInput}>
        <AutocompleteWidget
            name="Aggregate values using..."
            value={editedStep.aggFunction}
            options={aggregationFunctions}
            onChange={(val) => setEditedStep({ ...editedStep, aggFunction: val as PivotStep['aggFunction'] })}
            placeholder="Aggregation function"
            dataPath=".aggFunction"
            // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default PivotStepForm;
