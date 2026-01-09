import React from 'react';
import styles from './StepFormButtonbar.module.scss';

interface StepFormButtonbarProps {
  onSubmit: () => void;
}

const StepFormButtonbar: React.FC<StepFormButtonbarProps> = ({ onSubmit }) => {
  return (
    <div>
      <div className={styles.widgetFormAction}>
        <button
          className={`${styles.widgetFormActionButton} ${styles.widgetFormActionButtonValidate}`}
          data-cy="weaverbird-step-form-validate"
          onClick={onSubmit}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default StepFormButtonbar;
