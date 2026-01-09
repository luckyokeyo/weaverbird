import React from 'react';
import styles from './CodeEditorWidget.module.scss';
import { ErrorObject } from 'ajv';

// We can use a simple textarea for now or a real code editor like monaco-editor or react-simple-code-editor
// For migration speed, I'll use textarea.

interface CodeEditorWidgetProps {
  value: string;
  placeholder?: string;
  dataPath?: string;
  errors?: ErrorObject[] | null;
  onChange: (value: string) => void;
}

const CodeEditorWidget: React.FC<CodeEditorWidgetProps> = ({
  value,
  placeholder,
  dataPath,
  errors,
  onChange,
}) => {
  return (
    <div className={styles.widgetCodeEditor}>
      <textarea
        style={{ width: '100%', height: '200px', fontFamily: 'monospace' }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CodeEditorWidget;
