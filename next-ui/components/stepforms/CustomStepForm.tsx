import React, { Suspense } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import styles from './CustomStepForm.module.scss';
import { CustomStep } from '@/lib/steps';
// import { getTranslator } from '@/lib/translators'; // Assuming available

const CodeEditorWidget = React.lazy(() => import('./widgets/CodeEditorWidget'));

const CustomStepForm: React.FC<BaseStepFormProps<CustomStep>> = (props) => {
  const {
    initialStepValue = { name: 'custom', query: '[{"$match": {"domain": "test"}}]' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const translatorName = 'pandas'; // Default or from props if we add it
  // const translator = getTranslator(translatorName);
  const label = `Write a custom ${translatorName} query`; // translator.label

  return (
    <StepFormWrapper
      title="Custom step"
      stepName="custom"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <label>{label}</label>
      <Suspense fallback={<div>Loading...</div>}>
        <CodeEditorWidget
            value={editedStep.query}
            placeholder="Write your custom mongo here"
            onChange={(val: string) => setEditedStep({ ...editedStep, query: val })}
            dataPath=".query"
            // errors={errors}
        />
      </Suspense>
    </StepFormWrapper>
  );
};

export default CustomStepForm;
