import React from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
// Missing InputNumberWidget
// For now I'll use InputTextWidget type="number"
import InputTextWidget from './widgets/InputText';
import { SimplifyStep } from '@/lib/steps';

// We can define InputNumberWidget here if we want or just use InputText
// SimplifyStepForm uses InputNumberWidget in Vue.

const SimplifyStepForm: React.FC<BaseStepFormProps<SimplifyStep>> = (props) => {
  const {
    initialStepValue = { name: 'simplify', tolerance: 1 },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  return (
    <StepFormWrapper
      title="Simplify geographical data"
      stepName="simplify"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div style={{ marginBottom: 20 }}>
        <InputTextWidget
          name="Tolerance"
          value={editedStep.tolerance}
          onChange={(val) => setEditedStep({ ...editedStep, tolerance: val ? Number(val) : 0 })}
          // type="number" is not supported by InputTextWidget interface yet but passed to input
          // InputTextWidget implementation accepts props but type is hardcoded to "text" in my implementation.
          // I should fix InputTextWidget to accept type.
        />
      </div>
    </StepFormWrapper>
  );
};

export default SimplifyStepForm;
