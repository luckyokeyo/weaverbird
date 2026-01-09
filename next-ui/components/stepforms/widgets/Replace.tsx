import React from 'react';
import InputTextWidget from './InputText'; // Reusing InputText
import styles from '../ReplaceStepForm.module.scss'; // Importing from parent module for now or we create separate
import { VariableDelimiters, VariablesBucket } from '@/types';
import { ErrorObject } from 'ajv';

interface ReplaceWidgetProps {
  value: any[];
  dataPath?: string;
  errors?: ErrorObject[] | null;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  onChange: (newValue: any[]) => void;
}

const ReplaceWidget: React.FC<ReplaceWidgetProps> = ({
  value,
  dataPath,
  errors,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  onChange,
}) => {
  const valueToReplace = value[0];
  const newValue = value[1];

  const handleValueToReplaceChange = (val: string | undefined) => {
    onChange([val, newValue]);
  };

  const handleNewValueChange = (val: string | undefined) => {
    onChange([valueToReplace, val]);
  };

  return (
    <div className={styles.widgetReplaceContainer}>
       <div className={styles.valueToReplace}>
         <InputTextWidget
            value={valueToReplace}
            onChange={handleValueToReplaceChange}
            placeholder="Value to replace"
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
         />
       </div>
       <div className={styles.newValue}>
         <InputTextWidget
            value={newValue}
            onChange={handleNewValueChange}
            placeholder="New value"
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
         />
       </div>
    </div>
  );
};

export default ReplaceWidget;
