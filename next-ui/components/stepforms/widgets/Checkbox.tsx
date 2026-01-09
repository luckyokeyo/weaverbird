import React from 'react';
import classNames from 'classnames';
import styles from './Checkbox.module.scss';

interface CheckboxWidgetProps {
  label: string;
  info?: string;
  croppedLabel?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}

const CheckboxWidget: React.FC<CheckboxWidgetProps> = ({
  label,
  info,
  croppedLabel = false,
  value,
  onChange,
}) => {
  const toggleValue = () => {
    onChange(!value);
  };

  const title = (() => {
    if (!croppedLabel) return undefined;
    if (info) return `${label}${info}`;
    return label;
  })();

  return (
    <div
      className={classNames(styles.widgetCheckbox, {
        [styles.widgetCheckboxChecked]: value,
        [styles.widgetCheckboxCropped]: croppedLabel,
      })}
      onClick={toggleValue}
    >
      <label title={title} className={styles.widgetCheckboxLabel}>
        {info ? (
          <>
            <span className={styles.widgetCheckboxLabelContent}>{label}</span>
            <span className={styles.widgetCheckboxLabelInfo}>{info}</span>
          </>
        ) : (
          label
        )}
      </label>
    </div>
  );
};

export default CheckboxWidget;
