import React from 'react';
import InputTextWidget from './InputText';
import { VariableDelimiters, VariablesBucket } from '@/types';
import { ErrorObject } from 'ajv';

interface InputNumberWidgetProps {
  name?: string;
  placeholder?: string;
  value?: number | string | null;
  min?: number;
  max?: number;
  step?: number;
  docUrl?: string;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  onChange: (newValue: number | undefined) => void;
  dataPath?: string;
  errors?: ErrorObject[] | null;
}

const InputNumberWidget: React.FC<InputNumberWidgetProps> = ({
  name,
  placeholder,
  value,
  min,
  max,
  step,
  docUrl,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  onChange,
  dataPath,
  errors,
}) => {
  // Extract error
  const messageError = errors
    ?.filter((err) => (err as any).instancePath === dataPath || (err as any).dataPath === dataPath)
    .map((err) => err.message)
    .join(', ');

  const handleChange = (newValue: string | undefined) => {
      if (newValue === undefined || newValue === '') {
          onChange(undefined);
      } else {
          onChange(Number(newValue));
      }
  };

  return (
    <InputTextWidget
      name={name}
      placeholder={placeholder}
      value={value ?? ''}
      type="number"
      docUrl={docUrl}
      availableVariables={availableVariables}
      variableDelimiters={variableDelimiters}
      trustedVariableDelimiters={trustedVariableDelimiters}
      onChange={handleChange}
      messageError={messageError}
    />
  );
};

export default InputNumberWidget;
