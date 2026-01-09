import React from 'react';
import ColumnPicker from '@/components/stepforms/ColumnPicker';
import InputTextWidget from '@/components/stepforms/widgets/InputText';
import styles from '../AddTotalRowsStepForm.module.scss';
import { TotalDimension } from '@/lib/steps';
import { ErrorObject } from 'ajv';

interface TotalDimensionsWidgetProps {
  value: TotalDimension;
  dataPath?: string;
  errors?: ErrorObject[] | null;
  columnNames?: string[];
  onChange: (newValue: TotalDimension) => void;
}

const TotalDimensionsWidget: React.FC<TotalDimensionsWidgetProps> = ({
  value,
  dataPath,
  errors,
  columnNames,
  onChange,
}) => {
  const handleColumnChange = (val: string) => {
    onChange({ ...value, totalColumn: val });
  };

  const handleLabelChange = (val: string | undefined) => {
    onChange({ ...value, totalRowsLabel: val || '' });
  };

  return (
    <div className={styles.totalDimensionsWidget}>
      <div className={styles.totalColumnInput}>
        <ColumnPicker
            name="Column to compute total:"
            value={value.totalColumn}
            placeholder="Select a column"
            columnNames={columnNames}
            onChange={handleColumnChange}
            syncWithSelectedColumn={false}
        />
      </div>
      <div className={styles.totalRowsLabelInput}>
         <InputTextWidget
            name="Total label:"
            value={value.totalRowsLabel}
            placeholder="Label for the total row"
            onChange={handleLabelChange}
         />
      </div>
    </div>
  );
};

export default TotalDimensionsWidget;
