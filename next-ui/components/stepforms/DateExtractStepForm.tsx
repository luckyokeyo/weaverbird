import React, { useState, useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import MultiselectWidget from './widgets/Multiselect';
import styles from './DateExtractStepForm.module.scss';
import { DateExtractStep, DateInfo } from '@/lib/steps';
import { generateNewColumnName } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

interface DateInfoOption {
  info: DateInfo;
  label: string;
}

const DateExtractStepForm: React.FC<BaseStepFormProps<DateExtractStep>> = (props) => {
  const {
    initialStepValue = { name: 'dateextract', column: '', dateInfo: [], newColumns: [] },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const dateInfoOptions: DateInfoOption[] = [
    { info: 'year', label: 'year' },
    { info: 'month', label: 'month' },
    { info: 'day', label: 'day of month' },
    { info: 'week', label: 'week number (sunday to sunday)' },
    { info: 'quarter', label: 'quarter number' },
    { info: 'dayOfWeek', label: 'day of week (sunday to sunday)' },
    { info: 'dayOfYear', label: 'day of year' },
    { info: 'isoYear', label: 'ISO year' },
    { info: 'isoWeek', label: 'ISO week number (monday to monday)' },
    { info: 'isoDayOfWeek', label: 'ISO day of week (monday to monday)' },
    { info: 'firstDayOfYear', label: 'first day of year' },
    { info: 'firstDayOfMonth', label: 'first day of month' },
    { info: 'firstDayOfWeek', label: 'first day of week (sunday)' },
    { info: 'firstDayOfQuarter', label: 'first day of quarter' },
    { info: 'firstDayOfIsoWeek', label: 'first day of ISO week (monday)' },
    { info: 'currentDay', label: 'current day' },
    { info: 'previousDay', label: 'previous day' },
    { info: 'firstDayOfPreviousYear', label: 'first day of previous year' },
    { info: 'firstDayOfPreviousMonth', label: 'first day of previous month' },
    { info: 'firstDayOfPreviousWeek', label: 'first day of previous week (sunday)' },
    { info: 'firstDayOfPreviousQuarter', label: 'first day of previous quarter' },
    { info: 'firstDayOfPreviousIsoWeek', label: 'first day of previous ISO week (monday)' },
    { info: 'previousYear', label: 'previous year number' },
    { info: 'previousMonth', label: 'previous month number' },
    { info: 'previousWeek', label: 'previous week number (sunday to sunday)' },
    { info: 'previousQuarter', label: 'previous quarter number' },
    { info: 'previousIsoWeek', label: 'previous ISO week number (monday to monday)' },
    { info: 'hour', label: 'hour' },
    { info: 'minutes', label: 'minutes' },
    { info: 'seconds', label: 'seconds' },
    { info: 'milliseconds', label: 'milliseconds' },
  ];

  const getInitialStep = (): DateExtractStep => {
      const initial = { ...initialStepValue, ...stepFormDefaults };
      // Compatibility logic
      const dateInfo = initial.operation ? [initial.operation] : initial.dateInfo;
      const newColumns = initial.newColumnName ? [initial.newColumnName] : initial.newColumns;

      return {
          ...initial,
          dateInfo,
          newColumns,
          operation: undefined,
          newColumnName: undefined,
      };
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const currentDateInfo = dateInfoOptions.filter((d) => editedStep.dateInfo.includes(d.info));

  const updateCurrentDateInfo = (options: any[]) => {
    // options is (string | object)[]
    const opts = options as DateInfoOption[];
    setEditedStep({ ...editedStep, dateInfo: opts.map((o) => o.info) });
  };

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    step.newColumns = step.dateInfo.map((d) =>
      generateNewColumnName(`${step.column}_${d}`, props.columnNames || []),
    );
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Extract Date Information"
      stepName="dateextract"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.column}>
        <ColumnPicker
          name="Date column:"
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Pick a column"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>

      <div className={styles.dateInfoInput}>
        <MultiselectWidget
          name="Date information to extract:"
          value={currentDateInfo}
          options={dateInfoOptions}
          onChange={updateCurrentDateInfo}
          trackBy="info"
          label="label"
          placeholder="Select one or several"
          dataPath=".dateInfo"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default DateExtractStepForm;
