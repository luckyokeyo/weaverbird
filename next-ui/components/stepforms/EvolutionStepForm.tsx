import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import AutocompleteWidget from './widgets/Autocomplete';
import InputTextWidget from './widgets/InputText';
import MultiselectWidget from './widgets/Multiselect';
import styles from './EvolutionStepForm.module.scss';
import { EvolutionStep } from '@/lib/steps';

type EvolutionFormat = {
  evolutionFormat: 'abs' | 'pct';
  label: string;
};

type EvolutionType = {
  evolutionType: 'vsLastYear' | 'vsLastMonth' | 'vsLastWeek' | 'vsLastDay';
  label: string;
};

const EvolutionStepForm: React.FC<BaseStepFormProps<EvolutionStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'evolution',
      dateCol: '',
      valueCol: '',
      evolutionType: 'vsLastYear',
      evolutionFormat: 'abs',
      indexColumns: [],
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const evolutionFormats: EvolutionFormat[] = [
    { evolutionFormat: 'abs', label: 'absolute value' },
    { evolutionFormat: 'pct', label: 'percentage' },
  ];
  const evolutionTypes: EvolutionType[] = [
    { evolutionType: 'vsLastYear', label: 'last year' },
    { evolutionType: 'vsLastMonth', label: 'last month' },
    { evolutionType: 'vsLastWeek', label: 'last week' },
    { evolutionType: 'vsLastDay', label: 'last day' },
  ];

  const evolutionFormat = evolutionFormats.find(d => d.evolutionFormat === editedStep.evolutionFormat);
  const evolutionType = evolutionTypes.find(d => d.evolutionType === editedStep.evolutionType);

  return (
    <StepFormWrapper
      title="Compute evolution"
      stepName="evolution"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.dateColumnInput}>
        <ColumnPicker
          name="Date column:"
          value={editedStep.dateCol}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, dateCol: val })}
          placeholder="Enter a column"
          dataPath=".dateCol"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.valueColumnInput}>
        <ColumnPicker
          name="Value column:"
          value={editedStep.valueCol}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, valueCol: val })}
          placeholder="Enter a column"
          dataPath=".valueCol"
          errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          syncWithSelectedColumn={false}
        />
      </div>

      <div className={styles.evolutionType}>
        <AutocompleteWidget
          name="Compute evolution versus:"
          value={evolutionType}
          options={evolutionTypes}
          onChange={(val) => setEditedStep({ ...editedStep, evolutionType: (val as EvolutionType).evolutionType })}
          trackBy="evolutionType"
          label="label"
        />
      </div>

      <div className={styles.evolutionFormat}>
        <AutocompleteWidget
          name="Compute evolution in:"
          value={evolutionFormat}
          options={evolutionFormats}
          onChange={(val) => setEditedStep({ ...editedStep, evolutionFormat: (val as EvolutionFormat).evolutionFormat })}
          trackBy="evolutionFormat"
          label="label"
        />
      </div>

      <div className={styles.indexColumnsInput}>
        <MultiselectWidget
          name="(Optional) Group by:"
          value={editedStep.indexColumns}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, indexColumns: val as string[] })}
          placeholder="Add columns"
          dataPath=".indexColumns"
          // errors={errors}
          availableVariables={props.availableVariables}
          variableDelimiters={props.variableDelimiters}
          trustedVariableDelimiters={props.trustedVariableDelimiters}
          allowCustom={true}
        />
      </div>

      <div className={styles.newColumnInput}>
        <InputTextWidget
          name="(Optional) New column name"
          value={editedStep.newColumn}
          placeholder="Enter a name"
          onChange={(val) => setEditedStep({ ...editedStep, newColumn: val || '' })}
          // dataPath=".newColumn"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default EvolutionStepForm;
