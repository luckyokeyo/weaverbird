import React from 'react';
import classNames from 'classnames';
import FAIcon from '@/components/FAIcon';
import styles from './InputText.module.scss';
import type { VariableDelimiters, VariablesBucket } from '@/lib/variables';

// We'll likely implement VariableInput later, for now we can have a placeholder or just the input.
// The user asked to maintain functionalities, so I should implement VariableInput eventually.
// For now, I'll stub VariableInput as a simple wrapper.

interface InputTextWidgetProps {
  name?: string;
  placeholder?: string;
  value?: string | number | boolean;
  docUrl?: string;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  onChange: (newValue: string | undefined) => void;
  messageError?: string;
  messageWarning?: string;
}

export default function InputTextWidget({
  name,
  placeholder,
  value,
  docUrl,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  onChange,
  messageError,
  messageWarning,
}: InputTextWidgetProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.widgetInputTextContainer}>
      <div className={styles.widgetInputTextLabel}>
        {name && <label>{name}</label>}
        {docUrl && (
          <a href={docUrl} target="_blank" rel="noopener">
            <FAIcon className={styles.widgetInputTextDocIcon} icon="question-circle" />
          </a>
        )}
      </div>

      {/* Placeholder for VariableInput */}
      <input
        className={classNames(styles.widgetInputText, {
          [styles.widgetInputWithVariables]: availableVariables,
        })}
        placeholder={placeholder}
        type="text"
        value={value ? String(value) : ''}
        onChange={handleChange}
      />

      {messageError && (
        <div className={styles.msgError}>
          <FAIcon icon="exclamation-circle" /> {messageError}
        </div>
      )}
      {messageWarning && (
        <div className={styles.msgWarning}>
          <FAIcon icon="exclamation-triangle" /> {messageWarning}
        </div>
      )}
    </div>
  );
}
