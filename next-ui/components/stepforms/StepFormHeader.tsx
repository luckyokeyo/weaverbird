import React from 'react';
import FAIcon from '@/components/FAIcon';
import styles from './StepFormHeader.module.scss';

interface StepFormHeaderProps {
  title: string;
  stepName: string;
  version?: string;
  backendError?: string;
  onBack: () => void;
}

const StepFormHeader: React.FC<StepFormHeaderProps> = ({
  title,
  stepName,
  version = '',
  backendError,
  onBack,
}) => {
  return (
    <div className={styles.stepEditForm}>
      <div className={styles.stepEditFormContainer}>
        <button className={styles.stepEditFormBackButton} onClick={onBack}>
          <FAIcon className={styles.stepEditFormBackIcon} icon="angle-left" />
          BACK
        </button>
        <div className={styles.stepEditFormTitleContainer} data-cy="weaverbird-step-form-title">
          <h1>{title}</h1>
          <a
            className={styles.stepEditFormLink}
            href={`https://weaverbird.toucantoco.dev/docs/${stepName}`}
            target="_blank"
            rel="noopener noreferrer"
            data-version={version}
          >
            <FAIcon className={styles.stepEditFormLinkIcon} icon="question-circle" />
          </a>
        </div>
        <div className={styles.stepEditFormEmpty} />
      </div>
      {backendError && (
        <div className={styles.stepEditFormError}>
          <strong>{backendError}</strong>
        </div>
      )}
    </div>
  );
};

export default StepFormHeader;
