import React from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import FAIcon from '@/components/FAIcon';
import styles from './Multiselect.module.scss';
import { VariableDelimiters, VariablesBucket } from '@/types';

// NOTE: MultiVariableInput is not migrated yet.
// For now, we will just use ReactSelect/CreatableSelect directly.

interface MultiselectWidgetProps {
  name?: string;
  placeholder?: string;
  value?: (string | object)[];
  options?: (string | object)[];
  trackBy?: string;
  label?: string;
  withExample?: boolean;
  allowCustom?: boolean;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  onChange: (newValue: (string | object)[]) => void;
  messageError?: string;
  dataPath?: string;
}

const MultiselectWidget: React.FC<MultiselectWidgetProps> = ({
  name,
  placeholder,
  value = [],
  options = [],
  trackBy,
  label,
  withExample = false,
  allowCustom = false,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  onChange,
  messageError,
  dataPath,
}) => {
  const isObjectValue = label != null && trackBy != null;

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') return option;
    if (label && option[label]) return option[label];
    return String(option);
  };

  const getOptionValue = (option: any) => {
    if (typeof option === 'string') return option;
    if (trackBy && option[trackBy]) return option[trackBy];
    return JSON.stringify(option);
  };

  const formattedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt, original: opt };
    }
    return {
      label: getOptionLabel(opt),
      value: getOptionValue(opt),
      original: opt,
    };
  });

  const formattedValue = value.map((val) => {
    if (typeof val === 'string') {
       return { label: val, value: val, original: val };
    }
    return {
      label: getOptionLabel(val),
      value: getOptionValue(val),
      original: val,
    };
  });

  const handleChange = (newValue: MultiValue<any>) => {
    onChange(newValue.map((v) => v.original));
  };

  const SelectComponent = allowCustom ? CreatableSelect : ReactSelect;

  return (
    <div className={styles.widgetMultiselectContainer}>
      {name && <label className={styles.label}>{name}</label>}
      {/* Missing MultiVariableInput functionality for now */}
      <SelectComponent
        isMulti
        value={formattedValue}
        options={formattedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="react-select"
        isClearable={false}
      />
      {messageError && (
        <div className={styles.msgError}>
          <FAIcon icon="exclamation-circle" />
          {messageError}
        </div>
      )}
    </div>
  );
};

export default MultiselectWidget;
