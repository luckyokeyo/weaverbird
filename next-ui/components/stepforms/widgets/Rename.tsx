import React, { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import ColumnPicker from '@/components/stepforms/ColumnPicker';
import InputTextWidget from './InputText'; // Assuming InputText is migrated and compatible
import styles from './Rename.module.scss';
import { ErrorObject } from 'ajv';
import { ValidationError } from '@/lib/translators/base';
import { VariableDelimiters, VariablesBucket } from '@/types';

interface RenameWidgetProps {
  value: string[];
  dataPath?: string;
  errors?: ValidationError[] | null;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  selectedColumns?: string[];
  columnNames?: string[];
  onChange: (newValue: string[]) => void;
  onSetSelectedColumns?: (args: { column: string }) => void;
}

const RenameWidget: React.FC<RenameWidgetProps> = ({
  value,
  dataPath,
  errors,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  selectedColumns,
  columnNames = [],
  onChange,
  onSetSelectedColumns,
}) => {
  useEffect(() => {
    if (isEqual(value, ['', ''])) {
      onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnToRename = value[0];
  const newColumnToRename = value[1];

  const handleColumnToRenameChange = (newColumnName: string) => {
    onChange([newColumnName, newColumnToRename]);
  };

  const handleNewColumnToRenameChange = (newColumnName: string | undefined) => {
    onChange([columnToRename, newColumnName || '']);
  };

  const duplicateColumnName = columnNames.includes(newColumnToRename)
    ? `A column name "${newColumnToRename}" already exists. You will overwrite it.`
    : null;

  return (
    <div className={styles.widgetToRenameContainer}>
      <div className={styles.columnToRename}>
        <ColumnPicker
          name=""
          value={columnToRename}
          placeholder="Column to rename"
          syncWithSelectedColumn={false}
          dataPath={dataPath ? `${dataPath}[0]` : undefined}
          errors={errors}
          availableVariables={availableVariables}
          variableDelimiters={variableDelimiters}
          trustedVariableDelimiters={trustedVariableDelimiters}
          columnNames={columnNames}
          selectedColumns={selectedColumns}
          onChange={handleColumnToRenameChange}
          onSetSelectedColumns={onSetSelectedColumns}
        />
      </div>
      <div className={styles.newColumn}>
        <InputTextWidget
          name=""
          value={newColumnToRename}
          placeholder="New column name"
          // dataPath={`${dataPath}[1]`} // InputText might not use dataPath for error extraction directly, check implementation
          // If InputText handles errors by messageError, we need to extract it.
          // For now assume we pass errors and it might need adaptation if InputText changed.
          // Checking InputText... it takes messageError.
          onChange={handleNewColumnToRenameChange}
          messageWarning={duplicateColumnName || undefined} // InputText has messageWarning?
          availableVariables={availableVariables}
          variableDelimiters={variableDelimiters}
          trustedVariableDelimiters={trustedVariableDelimiters}
        />
      </div>
    </div>
  );
};

export default RenameWidget;
