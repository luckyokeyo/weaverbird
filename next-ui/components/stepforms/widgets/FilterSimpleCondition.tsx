import React, { useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import AutocompleteWidget from './Autocomplete';
import InputTextWidget from './InputText';
import MultiInputTextWidget from './MultiInputText';
import InputDateWidget from './InputDate';
import NewDateInput from './DateComponents/NewDateInput';
import {
  keepCurrentValueIfArrayType,
  keepCurrentValueIfCompatibleRelativeDate,
  keepCurrentValueIfCompatibleType,
} from '@/lib/helpers';
import type { ColumnTypeMapping } from '@/lib/dataset';
import type { FilterSimpleCondition } from '@/lib/steps';
import type { VariableDelimiters, VariablesBucket } from '@/lib/variables';
import styles from './FilterSimpleCondition.module.scss';

export const DEFAULT_FILTER: FilterSimpleCondition = { column: '', value: '', operator: 'eq' };

type LiteralOperator =
  | 'equals'
  | "doesn't equal"
  | 'is greater than'
  | 'is greater than or equal to'
  | 'is less than'
  | 'is less than or equal to'
  | 'is one of'
  | 'is not one of'
  | 'matches pattern'
  | "doesn't match pattern"
  | 'is null'
  | 'is not null'
  | 'starting in/on'
  | 'ending in/on';

type ShortOperator = FilterSimpleCondition['operator'];

type OperatorOption = {
  operator: ShortOperator;
  label: LiteralOperator;
  InputWidget?: React.ComponentType<any>;
};

const nullOperators: Readonly<OperatorOption[]> = [
  { operator: 'isnull', label: 'is null' },
  { operator: 'notnull', label: 'is not null' },
];

const baseOperators: Readonly<OperatorOption[]> = [
  { operator: 'eq', label: 'equals', InputWidget: InputTextWidget },
  { operator: 'ne', label: "doesn't equal", InputWidget: InputTextWidget },
  { operator: 'gt', label: 'is greater than', InputWidget: InputTextWidget },
  { operator: 'ge', label: 'is greater than or equal to', InputWidget: InputTextWidget },
  { operator: 'lt', label: 'is less than', InputWidget: InputTextWidget },
  { operator: 'le', label: 'is less than or equal to', InputWidget: InputTextWidget },
  { operator: 'in', label: 'is one of', InputWidget: MultiInputTextWidget },
  { operator: 'nin', label: 'is not one of', InputWidget: MultiInputTextWidget },
  { operator: 'matches', label: 'matches pattern', InputWidget: InputTextWidget },
  { operator: 'notmatches', label: "doesn't match pattern", InputWidget: InputTextWidget },
  ...nullOperators,
];

const dateOperators: Readonly<OperatorOption[]> = [
  { operator: 'from', label: 'starting in/on', InputWidget: NewDateInput },
  { operator: 'until', label: 'ending in/on', InputWidget: NewDateInput },
  ...nullOperators,
];

interface FilterSimpleConditionWidgetProps {
  value?: FilterSimpleCondition;
  columnNamesProp?: string[];
  dataPath?: string;
  errors?: any[]; // ErrorObject[]
  multiVariable?: boolean;
  columnTypes?: ColumnTypeMapping;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  hideColumnVariables?: boolean;
  onChange: (value: FilterSimpleCondition) => void;
  onSetSelectedColumns?: (cols: { column: string }) => void;
}

export default function FilterSimpleConditionWidget({
  value = { ...DEFAULT_FILTER },
  columnNamesProp = [],
  dataPath = '',
  errors = [],
  multiVariable = true,
  columnTypes = {},
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  hideColumnVariables,
  onChange,
  onSetSelectedColumns,
}: FilterSimpleConditionWidgetProps) {
  const columnNames = columnNamesProp;
  const hasDateSelectedColumn = columnTypes[value.column] === 'date';

  const availableOperators = useMemo(() => {
    return hasDateSelectedColumn ? dateOperators : baseOperators;
  }, [hasDateSelectedColumn]);

  const placeholder = useMemo(() => {
    if (value.operator === 'matches' || value.operator === 'notmatches') {
      return 'Enter a regex, e.g. "[Ss]ales"';
    }
    return 'Enter a value';
  }, [value.operator]);

  const currentOperator =
    availableOperators.find((d) => d.operator === value.operator) ?? availableOperators[0];
  const InputWidget = currentOperator.InputWidget;

  const updateStepColumn = (newValue: string | object | undefined | null) => {
    const updatedValue = { ...value };
    // Assuming newValue is string from Autocomplete
    updatedValue.column = typeof newValue === 'string' ? newValue : '';
    onSetSelectedColumns?.({ column: updatedValue.column });
    onChange(updatedValue);
  };

  const updateStepOperator = (newOperator: OperatorOption | string | undefined | null | object) => {
    const op = newOperator as OperatorOption; // simplified
    if (!op) return;

    const updatedValue = { ...value };
    updatedValue.operator = op.operator;
    if (updatedValue.operator === 'in' || updatedValue.operator === 'nin') {
      updatedValue.value = keepCurrentValueIfArrayType(updatedValue.value, []);
    } else if (updatedValue.operator === 'isnull' || updatedValue.operator === 'notnull') {
      updatedValue.value = null;
    } else if (hasDateSelectedColumn) {
      updatedValue.value = keepCurrentValueIfCompatibleRelativeDate(updatedValue.value, '');
    } else {
      updatedValue.value = keepCurrentValueIfCompatibleType(updatedValue.value, '');
    }
    onChange(updatedValue);
  };

  const updateStepValue = (newValue: any) => {
    const updatedValue = { ...value };
    updatedValue.value = newValue;
    onChange(updatedValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.columnInput}>
        <AutocompleteWidget
          value={value.column}
          availableVariables={hideColumnVariables ? undefined : availableVariables}
          variableDelimiters={hideColumnVariables ? undefined : variableDelimiters}
          trustedVariableDelimiters={
            hideColumnVariables ? undefined : trustedVariableDelimiters
          }
          options={columnNames}
          onChange={updateStepColumn}
          placeholder="Column"
          allowCustom={true}
        />
      </div>
      <div className={styles.operatorInput}>
        <AutocompleteWidget
          value={value.operator}
          onChange={updateStepOperator}
          options={availableOperators as any}
          placeholder="Filter operator"
          trackBy="operator"
          label="label"
        />
      </div>
      {InputWidget && (
        <div className={styles.valueInput}>
          <InputWidget
            // multiVariable={multiVariable} // Not passing to all yet
            value={value.value}
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
            placeholder={placeholder}
            // errors={errors}
            onChange={updateStepValue}
          />
        </div>
      )}
    </div>
  );
}
