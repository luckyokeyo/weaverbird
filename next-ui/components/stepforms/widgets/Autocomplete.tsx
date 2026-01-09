import React, { useState } from 'react';
import ReactSelect, { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import classNames from 'classnames';
import FAIcon from '@/components/FAIcon';
import styles from './Autocomplete.module.scss';
import type { VariableDelimiters, VariablesBucket } from '@/lib/variables';

interface AutocompleteWidgetProps {
  name?: string;
  placeholder?: string;
  value?: string | object;
  options?: (string | object)[];
  trackBy?: string;
  label?: string;
  withExample?: boolean;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  maxHeight?: number;
  allowCustom?: boolean;
  onChange: (newValue: string | object | undefined | null) => void;
  messageError?: string;
}

export default function AutocompleteWidget({
  name,
  placeholder,
  value,
  options = [],
  trackBy,
  label,
  withExample,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  maxHeight,
  allowCustom,
  onChange,
  messageError,
}: AutocompleteWidgetProps) {
  // Transform options to ReactSelect format { label, value }
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

  const selectedOption = formattedOptions.find((opt) => {
    if (typeof value === 'object' && value !== null && trackBy) {
       return opt.value === (value as any)[trackBy];
    }
    return opt.value === value;
  });

  const handleChange = (
    newValue: SingleValue<{ label: string; value: string; original: any }>,
  ) => {
    onChange(newValue ? newValue.original : undefined);
  };

  const SelectComponent = allowCustom ? CreatableSelect : ReactSelect;

  return (
    <div className={styles.widgetAutocompleteContainer}>
      {name && <label className={styles.widgetAutocompleteLabel}>{name}</label>}
      {/* VariableInput placeholder */}
      <SelectComponent
        classNamePrefix="react-select"
        value={selectedOption}
        options={formattedOptions}
        placeholder={placeholder}
        onChange={handleChange}
        getOptionLabel={(option: any) => option.label}
        getOptionValue={(option: any) => option.value}
        isClearable={false}
        // Custom formatting if needed
      />
      {messageError && (
        <div className={styles.msgError}>
          <FAIcon icon="exclamation-circle" /> {messageError}
        </div>
      )}
    </div>
  );
}
