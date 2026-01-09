import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import ListWidget from './widgets/List';
import ReplaceWidget from './widgets/Replace';
import styles from './ReplaceStepForm.module.scss';
import { ReplaceStep } from '@/lib/steps';
import { castFromString } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

const ReplaceStepForm: React.FC<BaseStepFormProps<ReplaceStep>> = (props) => {
  const {
    initialStepValue = { name: 'replace', searchColumn: '', toReplace: [[]] },
    stepFormDefaults,
    onFormSaved,
    columnTypes,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const toReplace = editedStep.toReplace.length ? editedStep.toReplace : [[]];

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    const type = columnTypes ? columnTypes[step.searchColumn] : undefined;
    if (type !== undefined) {
      for (const tuple of step.toReplace) {
        tuple[0] = castFromString(tuple[0], type);
        tuple[1] = castFromString(tuple[1], type);
      }
    }
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Replace values"
      stepName="replace"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.searchColumnInput}>
        <ColumnPicker
          name="Search in column..."
          value={editedStep.searchColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, searchColumn: val })}
          placeholder="Enter a column"
          dataPath=".searchColumn"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>
      <div className={styles.toReplace}>
        <ListWidget
            name="Values to replace:"
            addFieldName="Add a value to replace"
            value={toReplace}
            onChange={(val) => setEditedStep({ ...editedStep, toReplace: val })}
            widget={ReplaceWidget}
            defaultItem={[]}
            automaticNewField={false}
            dataPath=".toReplace"
            errors={errors}
            availableVariables={props.availableVariables}
            variableDelimiters={props.variableDelimiters}
            trustedVariableDelimiters={props.trustedVariableDelimiters}
            columnNames={props.columnNames}
            unstyledItems={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default ReplaceStepForm;
