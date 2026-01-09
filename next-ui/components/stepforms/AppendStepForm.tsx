import React, { useMemo } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import styles from './AppendStepForm.module.scss';
import { AppendStep, ReferenceToExternalQuery, isReferenceToExternalQuery } from '@/lib/steps';

interface DropdownOption {
  label: string;
  trackBy: string | ReferenceToExternalQuery;
  disabled?: boolean;
  tooltip?: string;
}

const AppendStepForm: React.FC<BaseStepFormProps<AppendStep>> = (props) => {
  const {
    initialStepValue = { name: 'append', pipelines: [] },
    stepFormDefaults,
    onFormSaved,
    availableDomains = [],
    unjoinableDomains = [],
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const pipelines = useMemo(() => {
    return editedStep.pipelines.map((pipeline) => {
      if (isReferenceToExternalQuery(pipeline)) {
        return {
          label: availableDomains.find((d) => d.uid === pipeline.uid)?.name ?? pipeline.uid,
          trackBy: pipeline,
        };
      } else {
        return {
          label: pipeline as string,
          trackBy: pipeline as string,
        };
      }
    });
  }, [editedStep.pipelines, availableDomains]);

  const handlePipelinesChange = (newValues: any[]) => {
      // newValues are options (DropdownOption objects) because we used trackBy/label in MultiselectWidget?
      // Wait, MultiselectWidget implementation:
      // If we pass `options` as objects and use trackBy, onChange receives the objects (if we map them).
      // But MultiselectWidget implementation I wrote:
      // onChange(newValue.map((v) => v.original));
      // So it returns the option objects.

      const opts = newValues as DropdownOption[];
      setEditedStep({ ...editedStep, pipelines: opts.map((v) => v.trackBy) });
  };

  const options: DropdownOption[] = useMemo(() => {
    return availableDomains.map((d) => {
      const isDisabled = !!unjoinableDomains.find((domain) => domain.uid === d.uid);
      return {
        label: d.name,
        trackBy: { type: 'ref', uid: d.uid } as ReferenceToExternalQuery,
        disabled: isDisabled,
        tooltip: isDisabled ? 'This dataset cannot be combined with the actual one' : undefined,
      };
    });
  }, [availableDomains, unjoinableDomains]);

  return (
    <StepFormWrapper
      title="Append datasets"
      stepName="append"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.pipelinesInput}>
        <MultiselectWidget
          name="Select datasets to append:"
          value={pipelines}
          options={options}
          onChange={handlePipelinesChange}
          placeholder="Select datasets"
          dataPath=".pipelines"
          // errors={errors}
          trackBy="trackBy"
          label="label"
          withExample={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default AppendStepForm;
