import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import AutocompleteWidget from './widgets/Autocomplete';
import InputTextWidget from './widgets/InputText';
import CheckboxWidget from './widgets/Checkbox';
import MultiselectWidget from './widgets/Multiselect';
import styles from './WaterfallStepForm.module.scss';
import { WaterfallStep } from '@/lib/steps';

const WaterfallStepForm: React.FC<BaseStepFormProps<WaterfallStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'waterfall',
      valueColumn: '',
      milestonesColumn: '',
      start: '',
      end: '',
      labelsColumn: '',
      sortBy: 'value',
      order: 'desc',
      backfill: true,
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Compute waterfall"
      stepName="waterfall"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.valueColumnInput}>
        <ColumnPicker
          name="Value column name:"
          value={editedStep.valueColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, valueColumn: val })}
          placeholder="Select a column"
          dataPath=".valueColumn"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.milestonesColumnInput}>
        <ColumnPicker
          name="Column incl. start and end labels (usually dates):"
          value={editedStep.milestonesColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, milestonesColumn: val })}
          placeholder="Select a column"
          dataPath=".milestonesColumn"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.startInput}>
        <InputTextWidget
          name="Starting block label:"
          value={editedStep.start}
          placeholder="To be found in the column above"
          onChange={(val) => setEditedStep({ ...editedStep, start: val || '' })}
          // dataPath=".start"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>

      <div className={styles.endInput}>
        <InputTextWidget
          name="Ending block label:"
          value={editedStep.end}
          placeholder="To be found in the column above"
          onChange={(val) => setEditedStep({ ...editedStep, end: val || '' })}
          // dataPath=".end"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
        />
      </div>

      <div className={styles.childrenColumnInput}>
        <ColumnPicker
          name="Labels columns (for intermediate blocks):"
          value={editedStep.labelsColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, labelsColumn: val })}
          placeholder="Select a column"
          dataPath=".labelsColumn"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.parentsColumnInput}>
        <ColumnPicker
          name="(Optional) Parents labels column (for drill-down):"
          value={editedStep.parentsColumn}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, parentsColumn: val })}
          placeholder="Select a column"
          dataPath=".parentsColumn"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.groupbyInput}>
        <MultiselectWidget
          name="(Optional) Group waterfall by:"
          value={editedStep.groupby}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groupby: val as string[] })}
          placeholder="Add columns"
          dataPath=".groupby"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          allowCustom={true}
        />
      </div>

      <div className={styles.sortByInput}>
        <AutocompleteWidget
          name="Sort by:"
          value={editedStep.sortBy}
          options={['label', 'value']}
          onChange={(val) => setEditedStep({ ...editedStep, sortBy: val as 'label' | 'value' })}
          dataPath=".sortBy"
        />
      </div>

      <div className={styles.orderInput}>
        <AutocompleteWidget
          name="Sort order:"
          value={editedStep.order}
          options={['asc', 'desc']}
          onChange={(val) => setEditedStep({ ...editedStep, order: val as 'asc' | 'desc' })}
          dataPath=".order"
        />
      </div>

      <div className={styles.backfillCheckbox}>
        <CheckboxWidget
          label="Backfill missing values"
          value={editedStep.backfill}
          onChange={(val) => setEditedStep({ ...editedStep, backfill: val })}
        />
      </div>
    </StepFormWrapper>
  );
};

export default WaterfallStepForm;
