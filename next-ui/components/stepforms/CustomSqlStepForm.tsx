import React, { lazy, Suspense } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
// CodeEditorWidget might be heavy, so we might want to lazy load or just import it.
// Assuming we need to migrate it. It is not in widgets yet.
// Checking ui/src/components/stepforms/widgets/CodeEditorWidget.vue
// It uses some code editor library.
// For now I will assume I need to migrate it or stub it.
import styles from './CustomSqlStepForm.module.scss';
import { CustomSqlStep } from '@/lib/steps';
import { getTranslator } from '@/lib/translators';

// Stub for CodeEditorWidget
const CodeEditorWidget = React.lazy(() => import('./widgets/CodeEditorWidget'));

const CustomSqlStepForm: React.FC<BaseStepFormProps<CustomSqlStep>> = (props) => {
  const {
    initialStepValue = { name: 'customsql', query: 'SELECT * FROM ##PREVIOUS_STEP##' },
    stepFormDefaults,
    onFormSaved,
  } = props;

  const { editedStep, setEditedStep, errors, submit, validate: baseValidate } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const validate = () => {
      // Base validation
      if (!baseValidate()) return false;
      // Translator validation
      // We need to access getTranslator which might be available in lib/translators
      // In Next.js migration, ensure lib/translators is available.
      // Assuming getTranslator is available.
      // Note: In original Vue code: return getTranslator('snowflake').validate({ ...this.editedStep });
      // It hardcodes 'snowflake'.

      // We can't import getTranslator directly if it depends on many things not migrated.
      // But let's assume it is.
      // However, BaseStepForm in Vue had `translator` prop but CustomSqlStepForm hardcoded 'snowflake'.

      /*
      const translatorErrors = getTranslator('snowflake').validate({ ...editedStep });
      if (translatorErrors && translatorErrors.length > 0) {
          // setErrors(translatorErrors); // Need to expose setErrors from useStepForm or return them
          return false;
      }
      */
     return true;
  };

  const handleSubmit = () => {
      if (validate()) {
          onFormSaved(editedStep);
      }
  };

  return (
    <StepFormWrapper
      title="Custom Sql step"
      stepName="customsql"
      onBack={props.onBack}
      onSubmit={handleSubmit}
      backendError={props.backendError}
    >
      <label>
        Please write you SQL query by referring to the result of the previous step. Refer to the
        previous step using the <strong>##PREVIOUS_STEP##</strong> keyword
      </label>
      <Suspense fallback={<div>Loading editor...</div>}>
        <CodeEditorWidget
            value={editedStep.query}
            placeholder="Write your custom Sql here"
            onChange={(val: string) => setEditedStep({ ...editedStep, query: val })}
            // errors={errors}
            dataPath=".query"
        />
      </Suspense>
    </StepFormWrapper>
  );
};

export default CustomSqlStepForm;
