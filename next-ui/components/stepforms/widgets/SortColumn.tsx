import React from 'react';
import ColumnPicker from '@/components/stepforms/ColumnPicker';
import AutocompleteWidget from '@/components/stepforms/widgets/Autocomplete';
import styles from '../SortStepForm.module.scss';
import { SortStep } from '@/lib/steps';
import { ErrorObject } from 'ajv';

interface SortColumnWidgetProps {
  value: any; // { column: string, order: 'asc' | 'desc' }
  dataPath?: string;
  errors?: ErrorObject[] | null;
  columnNames?: string[];
  onChange: (newValue: any) => void;
  // ... other props
}

const SortColumnWidget: React.FC<SortColumnWidgetProps> = ({
  value,
  dataPath,
  errors,
  columnNames,
  onChange,
}) => {
  const column = value.column;
  const order = value.order;

  const handleColumnChange = (val: string) => {
    onChange({ ...value, column: val });
  };

  const handleOrderChange = (val: any) => {
      // Autocomplete returns original object or string.
      // We assume it's string 'asc' or 'desc'.
      const v = typeof val === 'string' ? val : val?.value;
      onChange({ ...value, order: v });
  };

  const orderOptions = [
      { label: 'ASC', value: 'asc' },
      { label: 'DESC', value: 'desc' },
  ];

  return (
    <div className={styles.widgetSortColumnContainer}>
      <div className={styles.columnInput}>
        <ColumnPicker
            name=""
            value={column}
            placeholder="Column"
            columnNames={columnNames}
            onChange={handleColumnChange}
            syncWithSelectedColumn={false}
        />
      </div>
      <div className={styles.orderInput}>
         <AutocompleteWidget
            name=""
            value={order}
            options={orderOptions}
            placeholder="Order"
            onChange={handleOrderChange}
            trackBy="value"
            label="label"
         />
      </div>
    </div>
  );
};

export default SortColumnWidget;
