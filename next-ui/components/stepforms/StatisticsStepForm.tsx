import React, { useState } from 'react';
import Ajv, { ErrorObject } from 'ajv';
import intersection from 'lodash/intersection';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import Checkbox from './widgets/Checkbox';
import MultiselectWidget from './widgets/Multiselect';
import InputTextWidget from './widgets/InputText'; // Using InputText for numbers for now
import styles from './StatisticsStepForm.module.scss';
import { StatisticsStep, Quantile, Statistics } from '@/lib/steps';
import FAIcon from '@/components/FAIcon';
import { ValidationError } from '@/lib/translators/base';

const StatisticsStepForm: React.FC<BaseStepFormProps<StatisticsStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'statistics',
      column: '',
      groupbyColumns: [],
      statistics: [],
      quantiles: [],
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const [customQuantilesForm, setCustomQuantilesForm] = useState<{ nth: string; order: string }>({
    nth: '',
    order: '',
  });

  const [isBasicStatisticsOpen, setIsBasicStatisticsOpen] = useState(true);
  const [isAdvancedStatisticsOpen, setIsAdvancedStatisticsOpen] = useState(false);
  const [isCustomQuantileOpen, setIsCustomQuantileOpen] = useState(false);

  const STATISTICS: Statistics[] = ['count', 'average', 'min', 'max'];
  const QUANTILES: Quantile[] = [
    { label: 'median', nth: 1, order: 2 },
  ];
  const ADVANCED_STATISTICS: Statistics[] = ['standard deviation', 'variance'];
  const ADVANCED_QUANTILES: Quantile[] = [
    { label: 'first quartile', nth: 1, order: 4 },
    { label: 'last quartile', nth: 3, order: 4 },
    { label: 'first decile', nth: 1, order: 10 },
    { label: 'last decile', nth: 9, order: 10 },
    { label: 'first centile', nth: 1, order: 100 },
    { label: 'last centile', nth: 99, order: 100 },
  ];

  const customQuantiles = editedStep.quantiles.filter(({ label }) => label === undefined);

  const basicStatisticsCheckedCount =
    intersection(editedStep.statistics, STATISTICS).length +
    intersection(
      editedStep.quantiles.map(({ label }) => label),
      QUANTILES.map(({ label }) => label),
    ).length;

  const advancedStatisticsCheckedCount =
    intersection(editedStep.statistics, ADVANCED_STATISTICS).length +
    intersection(
      editedStep.quantiles.map(({ label }) => label),
      ADVANCED_QUANTILES.map(({ label }) => label),
    ).length;

  const customQuantilesCheckedCount = customQuantiles.length;

  const isStatisticChecked = (statistic: Statistics): boolean => {
    return editedStep.statistics.includes(statistic);
  };

  const isQuantileChecked = (quantile: Quantile): boolean => {
    return (
      editedStep.quantiles.filter(
        ({ label, nth, order }) =>
          label === quantile.label && nth === quantile.nth && order === quantile.order,
      ).length > 0
    );
  };

  const toggleStatistic = (statistic: Statistics) => {
    if (isStatisticChecked(statistic)) {
      setEditedStep({
        ...editedStep,
        statistics: editedStep.statistics.filter((s) => s !== statistic),
      });
    } else {
      setEditedStep({
        ...editedStep,
        statistics: [...editedStep.statistics, statistic],
      });
    }
  };

  const toggleQuantile = (quantile: Quantile | { nth: string; order: string; label?: string }) => {
    // If it comes from form, it might have strings.
    const q: Quantile = {
        nth: Number(quantile.nth),
        order: Number(quantile.order),
        label: quantile.label,
    };

    if (isQuantileChecked(q)) {
      setEditedStep({
        ...editedStep,
        quantiles: editedStep.quantiles.filter(
          ({ label, nth, order }) =>
            label !== q.label || nth !== q.nth || order !== q.order,
        ),
      });
    } else {
       // Validate custom quantile
       const ajv = new Ajv({ allErrors: true, strictSchema: false });
       const validate = ajv.compile({
        type: 'object',
        required: ['nth', 'order'],
        properties: {
          label: { type: 'string' },
          nth: { type: 'number', minimum: 1 },
          order: { type: 'number', minimum: (q.nth || 0) + 1 },
        },
      });

      if (validate(q)) {
        setEditedStep({
            ...editedStep,
            quantiles: [...editedStep.quantiles, q],
        });
        setCustomQuantilesForm({ nth: '', order: '' });
      } else {
          // TODO: handle validation errors for custom quantile form locally?
          // The errors prop in BaseStepFormProps is for the whole form submission usually.
      }
    }
  };

  return (
    <StepFormWrapper
      title="Compute statistics"
      stepName="statistics"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.columnInput}>
        <ColumnPicker
          name="Column:"
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Select a column containing numbers"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
          // onSetSelectedColumns
        />
      </div>

      <div className={styles.groupbyColumnsInput}>
        <MultiselectWidget
          name="Group result by..."
          value={editedStep.groupbyColumns}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, groupbyColumns: val as string[] })}
          placeholder="Add columns"
          dataPath=".groupByColumn"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      {/* Basic Statistics */}
      <div className={styles.statisticSectionHeader} onClick={() => setIsBasicStatisticsOpen(!isBasicStatisticsOpen)}>
        Basic Statistics ({basicStatisticsCheckedCount})
        <FAIcon icon={isBasicStatisticsOpen ? 'angle-down' : 'angle-right'} />
      </div>
      {isBasicStatisticsOpen && (
        <div className={styles.statisticSection}>
          {STATISTICS.map((statistic) => (
            <div key={statistic}>
              <Checkbox
                label={statistic}
                value={isStatisticChecked(statistic)}
                onChange={() => toggleStatistic(statistic)}
              />
            </div>
          ))}
          {QUANTILES.map((quantile) => (
            <div key={quantile.label}>
              <Checkbox
                label={quantile.label || ''}
                value={isQuantileChecked(quantile)}
                onChange={() => toggleQuantile(quantile)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Advanced Statistics */}
      <div className={styles.statisticSectionHeader} onClick={() => setIsAdvancedStatisticsOpen(!isAdvancedStatisticsOpen)}>
        Advanced Statistics ({advancedStatisticsCheckedCount})
        <FAIcon icon={isAdvancedStatisticsOpen ? 'angle-down' : 'angle-right'} />
      </div>
      {isAdvancedStatisticsOpen && (
        <div className={styles.statisticSection}>
          {ADVANCED_STATISTICS.map((statistic) => (
            <div key={statistic}>
              <Checkbox
                label={statistic}
                value={isStatisticChecked(statistic)}
                onChange={() => toggleStatistic(statistic)}
              />
            </div>
          ))}
          {ADVANCED_QUANTILES.map((quantile) => (
            <div key={quantile.label}>
              <Checkbox
                label={quantile.label || ''}
                value={isQuantileChecked(quantile)}
                onChange={() => toggleQuantile(quantile)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Custom Quantiles */}
      <div className={styles.statisticSectionHeader} onClick={() => setIsCustomQuantileOpen(!isCustomQuantileOpen)}>
        Custom quantiles ({customQuantilesCheckedCount})
        <FAIcon icon={isCustomQuantileOpen ? 'angle-down' : 'angle-right'} />
      </div>
      {isCustomQuantileOpen && (
        <div className={styles.statisticSection}>
          {customQuantiles.map((quantile) => (
            <div key={`${quantile.nth}-th ${quantile.order}-quantile`}>
              <Checkbox
                label={`${quantile.nth}-th ${quantile.order}-quantile`}
                value={true}
                onChange={() => toggleQuantile(quantile)}
              />
            </div>
          ))}
          <div className={styles.customQuantile}>
            <div className={styles.customQuantileWidgetCheckbox} onClick={() => toggleQuantile(customQuantilesForm)} />
             <div style={{ width: 80, marginLeft: 20 }}>
                <InputTextWidget
                    value={customQuantilesForm.nth}
                    onChange={(val) => setCustomQuantilesForm({ ...customQuantilesForm, nth: val || '' })}
                    // type="number"
                />
             </div>
             -th
             <div style={{ width: 80, marginLeft: 10 }}>
                <InputTextWidget
                    value={customQuantilesForm.order}
                    onChange={(val) => setCustomQuantilesForm({ ...customQuantilesForm, order: val || '' })}
                    // type="number"
                />
             </div>
             -quantile
          </div>
        </div>
      )}
    </StepFormWrapper>
  );
};

export default StatisticsStepForm;
