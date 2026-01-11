import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import MultiselectWidget from './widgets/Multiselect';
import CheckboxWidget from './widgets/Checkbox';
import styles from './UnpivotStepForm.module.scss';
import { UnpivotStep } from '@/lib/steps';
import { generateNewColumnName } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

const UnpivotStepForm: React.FC<BaseStepFormProps<UnpivotStep>> = (props) => {
  const {
    initialStepValue = {
      name: 'unpivot',
      keep: [],
      unpivot: [],
      unpivotColumnName: '',
      valueColumnName: '',
      dropna: true,
    },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const translator = 'pandas'; // Assuming default or passed via props
  const translatorStr = translator as string;

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    step.unpivotColumnName = generateNewColumnName('variable', props.columnNames || []);
    step.valueColumnName = generateNewColumnName('value', props.columnNames || []);
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Unpivot columns"
      stepName="unpivot"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.keepColumnInput}>
        <MultiselectWidget
          name="Keep columns..."
          value={editedStep.keep}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, keep: val as string[] })}
          placeholder="Add columns to keep"
          dataPath=".keep"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      <div className={styles.unpivotColumnInput}>
        <MultiselectWidget
          name="Unpivot columns..."
          value={editedStep.unpivot}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, unpivot: val as string[] })}
          placeholder="Add columns to unpivot"
          dataPath=".unpivot"
          // errors={errors}
          allowCustom={true}
        />
      </div>

      {translatorStr !== 'snowflake' && (
        <div className={styles.dropnaCheckbox}>
            <CheckboxWidget
                label="Drop null values"
                value={editedStep.dropna}
                onChange={(val) => setEditedStep({ ...editedStep, dropna: val })}
            />
        </div>
      )}
    </StepFormWrapper>
  );
};

export default UnpivotStepForm;
