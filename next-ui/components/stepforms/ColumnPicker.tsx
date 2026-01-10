import React, { useEffect } from 'react';
import AutocompleteWidget from './widgets/Autocomplete';
import { VariableDelimiters, VariablesBucket } from '@/types';
import { ValidationError } from '@/lib/translators/base';

// We need to map ajv errors to a format that AutocompleteWidget expects, if needed.
// But AutocompleteWidget takes messageError (string).
// ColumnPicker in Vue takes `errors: ErrorObject[]`.
// We need to find the error relevant to this field.

interface ColumnPickerProps {
  name?: string;
  placeholder?: string;
  errors?: ValidationError[] | null;
  dataPath?: string;
  value?: string;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  syncWithSelectedColumn?: boolean;
  selectedColumns?: string[];
  columnNames?: string[];
  options?: string[];
  onChange: (value: string) => void;
  onSetSelectedColumns?: (args: { column: string }) => void;
}

const ColumnPicker: React.FC<ColumnPickerProps> = ({
  name = 'column',
  placeholder = 'Enter a column',
  errors = [],
  dataPath = null,
  value,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  syncWithSelectedColumn = true,
  selectedColumns = [],
  columnNames = [],
  options = [],
  onChange,
  onSetSelectedColumns,
}) => {
  useEffect(() => {
    if (syncWithSelectedColumn && selectedColumns[0] && !value) {
      onChange(selectedColumns[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Equivalent to created()

  useEffect(() => {
    if (
      syncWithSelectedColumn &&
      selectedColumns[0] &&
      selectedColumns[0] !== value
    ) {
      onChange(selectedColumns[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumns]); // Equivalent to watch selectedColumns

  const handleValueChanged = (newColumn: any) => {
    const val = typeof newColumn === 'string' ? newColumn : newColumn?.value;
    onChange(val);
    if (syncWithSelectedColumn && onSetSelectedColumns) {
      onSetSelectedColumns({ column: val });
    }
  };

  // Extract error message for this field
  const errorMessage = errors
    ?.filter((err) => (err as any).instancePath === dataPath || err.dataPath === dataPath)
    .map((err) => err.message)
    .join(', ');

  return (
    <AutocompleteWidget
      name={name}
      value={value || ''}
      options={columnNames.length > 0 ? columnNames : options}
      onChange={handleValueChanged}
      placeholder={placeholder}
      // dataPath={dataPath} // Not passed to AutocompleteWidget in Next implementation
      messageError={errorMessage}
      availableVariables={availableVariables}
      variableDelimiters={variableDelimiters}
      trustedVariableDelimiters={trustedVariableDelimiters}
      allowCustom={true}
    />
  );
};

export default ColumnPicker;
