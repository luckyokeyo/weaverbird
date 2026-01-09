import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import InputTextWidget from './widgets/InputText';
import MultiselectWidget from './widgets/Multiselect';
import styles from './FillnaStepForm.module.scss';
import { FillnaStep } from '@/lib/steps';
import { castFromString } from '@/lib/helpers';
import cloneDeep from 'lodash/cloneDeep';

const FillnaStepForm: React.FC<BaseStepFormProps<FillnaStep>> = (props) => {
  const {
    initialStepValue = { name: 'fillna', column: undefined, value: '', columns: [] },
    stepFormDefaults,
    onFormSaved,
    columnTypes,
  } = props;

  const getInitialStep = (): FillnaStep => {
      const initial = { ...initialStepValue, ...stepFormDefaults };
      const columns = initial.column ? [initial.column] : initial.columns;
      return {
          ...initial,
          columns,
          column: undefined,
      };
  };

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: getInitialStep(),
  });

  const handleSubmit = () => {
    const step = cloneDeep(editedStep);
    if (step.columns.length > 0 && columnTypes) {
        const type = columnTypes[step.columns[0]];
        if (type !== undefined) {
             step.value = castFromString(step.value as string, type);
        }
    }
    submit(step);
  };

  return (
    <StepFormWrapper
      title="Fill null values"
      stepName="fillna"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <div className={styles.columnInput}>
        <MultiselectWidget
          name="Replace null values in..."
          value={editedStep.columns}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, columns: val as string[] })}
          placeholder="Select columns"
          dataPath=".columns"
          // errors={errors}
          allowCustom={true}
        />
      </div>
      <div className={styles.valueInput}>
        <InputTextWidget
          name="With..."
          value={editedStep.value}
          placeholder="Enter a value"
          onChange={(val) => setEditedStep({ ...editedStep, value: val || '' })}
          // dataPath=".value"
          // errors={errors}
        />
      </div>
    </StepFormWrapper>
  );
};

export default FillnaStepForm;
