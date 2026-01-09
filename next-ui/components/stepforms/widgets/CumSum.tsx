import React from 'react';
import ColumnPicker from '@/components/stepforms/ColumnPicker';
import InputTextWidget from '@/components/stepforms/widgets/InputText';
import styles from '../CumSumStepForm.module.scss';
import { ErrorObject } from 'ajv';

interface CumSumWidgetProps {
  value: string[]; // [valueColumn, newColumnName]
  dataPath?: string;
  errors?: ErrorObject[] | null;
  columnNames?: string[];
  onChange: (newValue: string[]) => void;
}

const CumSumWidget: React.FC<CumSumWidgetProps> = ({
  value,
  dataPath,
  errors,
  columnNames,
  onChange,
}) => {
  const valueColumn = value[0];
  const newColumnName = value[1];

  const handleValueColumnChange = (val: string) => {
    onChange([val, newColumnName]);
  };

  const handleNewColumnNameChange = (val: string | undefined) => {
    onChange([valueColumn, val || '']);
  };

  return (
    <div className={styles.widgetCumSumContainer}>
      <div className={styles.valueColumn}>
        <ColumnPicker
            name=""
            value={valueColumn}
            placeholder="Value column"
            columnNames={columnNames}
            onChange={handleValueColumnChange}
            syncWithSelectedColumn={false}
        />
      </div>
      <div className={styles.newColumn}>
         <InputTextWidget
            name=""
            value={newColumnName}
            placeholder="New column name"
            onChange={handleNewColumnNameChange}
         />
      </div>
    </div>
  );
};

export default CumSumWidget;
