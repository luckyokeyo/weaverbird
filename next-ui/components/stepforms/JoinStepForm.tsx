import React, { useMemo, useState, useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import AutocompleteWidget from './widgets/Autocomplete';
import ListWidget from './widgets/List';
import JoinColumns from './widgets/JoinColumns'; // We created this
import styles from './JoinStepForm.module.scss';
import { JoinStep, ReferenceToExternalQuery, isReferenceToExternalQuery } from '@/lib/steps';
import JoinStepFormSchema from './schemas/join';

interface DropdownOption {
  label: string;
  trackBy: string | ReferenceToExternalQuery;
  disabled?: boolean;
  tooltip?: string;
}

const JoinStepForm: React.FC<BaseStepFormProps<JoinStep>> = (props) => {
  const joinTypes = JoinStepFormSchema.properties.type.enum as JoinStep['type'][];

  const {
    initialStepValue = { name: 'join', rightPipeline: '', type: joinTypes[0], on: [['', '']] },
    stepFormDefaults,
    onFormSaved,
    availableDomains = [],
    unjoinableDomains = [],
    getColumnNamesFromPipeline,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const [rightColumnNames, setRightColumnNames] = useState<string[]>([]);

  const rightPipeline: DropdownOption = useMemo(() => {
    const domain = editedStep.rightPipeline;
    if (isReferenceToExternalQuery(domain)) {
      return {
        label: availableDomains.find((d) => d.uid === domain.uid)?.name ?? domain.uid,
        trackBy: domain,
      };
    } else {
      return {
        label: (editedStep.rightPipeline as string) || '',
        trackBy: (editedStep.rightPipeline as string) || '',
      };
    }
  }, [editedStep.rightPipeline, availableDomains]);

  const updateRightColumnNames = async (pipelineNameOrDomain: string | ReferenceToExternalQuery) => {
    if (getColumnNamesFromPipeline) {
      const cols = await getColumnNamesFromPipeline(pipelineNameOrDomain);
      setRightColumnNames(cols || []);
    }
  };

  useEffect(() => {
    if (rightPipeline.trackBy) {
      updateRightColumnNames(rightPipeline.trackBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRightPipelineChange = (newVal: any) => {
      const opt = newVal as DropdownOption;
      setEditedStep({ ...editedStep, rightPipeline: opt.trackBy });
      updateRightColumnNames(opt.trackBy);
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

  const on = editedStep.on.length ? editedStep.on : [['', '']];

  return (
    <StepFormWrapper
      title="Join datasets"
      stepName="join"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.rightPipelineInput}>
        <AutocompleteWidget
            name="Select a dataset to join (as right dataset):"
            value={rightPipeline}
            options={options}
            onChange={handleRightPipelineChange}
            placeholder="Select a dataset"
            dataPath=".rightPipeline"
            // errors={errors}
            trackBy="trackBy"
            label="label"
            withExample={true}
        />
      </div>

      <div className={styles.typeInput}>
        <AutocompleteWidget
            name="Select a join type:"
            value={editedStep.type}
            options={joinTypes}
            onChange={(val) => setEditedStep({ ...editedStep, type: val as JoinStep['type'] })}
            placeholder="Select a join type"
            dataPath=".type"
            // errors={errors}
        />
      </div>

      <div className={styles.joinColumns}>
        <ListWidget
            name="Join based on column(s):"
            addFieldName="Add columns"
            value={on}
            onChange={(val) => setEditedStep({ ...editedStep, on: val })}
            widget={JoinColumns}
            componentProps={{
                leftColumnNames: props.columnNames || [],
                rightColumnNames: rightColumnNames,
            }}
            defaultItem={['', '']}
            automaticNewField={false}
            dataPath=".on"
            errors={errors}
            unstyledItems={true}
        />
      </div>
    </StepFormWrapper>
  );
};

export default JoinStepForm;
