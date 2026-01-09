import React from 'react';
import MultiselectWidget from './Multiselect';
import AutocompleteWidget from './Autocomplete';
import styles from './Aggregation.module.scss';
import { Aggregation } from '@/lib/steps';
import { VariableDelimiters, VariablesBucket } from '@/types';
import { ErrorObject } from 'ajv';

interface AggregationWidgetProps {
  value: Aggregation;
  dataPath?: string;
  errors?: ErrorObject[] | null;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  columnNames?: string[];
  onChange: (newValue: Aggregation) => void;
}

const AggregationWidget: React.FC<AggregationWidgetProps> = ({
  value,
  dataPath,
  errors,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  columnNames = [],
  onChange,
}) => {
  const aggregationFunctions: Aggregation['aggfunction'][] = [
    'sum',
    'avg',
    'count',
    'count distinct',
    'min',
    'max',
    'first',
    'last',
  ];

  const handleColumnsChange = (newColumns: any[]) => {
    // newColumns is (string | object)[], but we expect string[]
    const cols = newColumns as string[];
    onChange({ ...value, columns: cols });
  };

  const handleFunctionChange = (newFunction: any) => {
      // newFunction can be string or object, we expect string (aggfunction)
      const func = typeof newFunction === 'string' ? newFunction : newFunction?.value;
      onChange({ ...value, aggfunction: func });
  };

  // Extract errors if needed. Multiselect and Autocomplete accept messageError.
  // We need to pass dataPath.

  return (
    <fieldset className={styles.widgetAggregationContainer}>
      <legend>Aggregate columns</legend>
      <div className={styles.columnsInput}>
        <MultiselectWidget
            name="Columns:"
            options={columnNames}
            value={value.columns}
            onChange={handleColumnsChange}
            placeholder="Select columns"
            dataPath={`${dataPath}.columns`}
            // errors={errors} // We need to extract error for this specific field
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
            allowCustom={true}
        />
      </div>
      <div className={styles.aggregationFunctionInput}>
        <AutocompleteWidget
            name="Function:"
            value={value.aggfunction}
            options={aggregationFunctions}
            onChange={handleFunctionChange}
            placeholder="Aggregation function"
            // dataPath={`${dataPath}.aggfunction`}
            // errors={errors}
        />
      </div>
    </fieldset>
  );
};

export default AggregationWidget;
