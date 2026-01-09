import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import AutocompleteWidget from './widgets/Autocomplete';
import styles from './DomainStepForm.module.scss';
import { DomainStep } from '@/lib/steps';

const DomainStepForm: React.FC<BaseStepFormProps<DomainStep>> = (props) => {
  const {
    initialStepValue = { name: 'domain', domain: '' },
    stepFormDefaults,
    onFormSaved,
    availableDomains = [],
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const availableDatasetNames = availableDomains.map((d) => d.name);

  return (
    <StepFormWrapper
      title="Select a dataset"
      stepName="domain"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.domainInput}>
        <AutocompleteWidget
          name="Select a dataset to start..."
          value={editedStep.domain}
          options={availableDatasetNames}
          onChange={(val) => setEditedStep({ ...editedStep, domain: val as string })}
          placeholder="Choose a dataset"
        />
      </div>
    </StepFormWrapper>
  );
};

export default DomainStepForm;
