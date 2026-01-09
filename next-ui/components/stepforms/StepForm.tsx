import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import StepFormHeader from './StepFormHeader';
import StepFormButtonbar from './StepFormButtonbar';
import schemaFactory from './schemas';
import { addAjvKeywords, ajvErrorsToValidationError } from './schemas/utils';
import { PipelineInterpolator, InterpolateFunction, ScopeContext } from '@/lib/templating';
import { PipelineStep, PipelineStepName, ReferenceToExternalQuery } from '@/lib/steps';
import { VariableDelimiters, VariablesBucket, ColumnTypeMapping } from '@/types';
import { ValidationError } from '@/lib/translators/base';

// We need to import package.json to get the version
import pkg from '../../../package.json';
const version = pkg.version;

// Define props for StepForm
export interface BaseStepFormProps<StepType extends PipelineStep> {
  stepName: PipelineStepName;
  initialStepValue: StepType;
  stepFormDefaults?: Partial<StepType>;
  isStepCreation?: boolean;
  backendError?: string;
  columnTypes?: ColumnTypeMapping;
  // Computed prop often used:
  columnNames?: string[];

  selectedColumns?: string[];
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  variables?: ScopeContext;
  availableDomains?: { name: string; uid: string }[];
  unjoinableDomains?: { name: string; uid: string }[];
  interpolateFunc?: InterpolateFunction;
  getColumnNamesFromPipeline?: (
    pipelineNameOrDomain: string | ReferenceToExternalQuery,
  ) => Promise<string[] | undefined>;
  onFormSaved: (step: StepType) => void;
  onBack: () => void;
  title?: string;
  onSetSelectedColumns?: (args: { column: string }) => void;
}

export function useStepForm<StepType extends PipelineStep>({
  stepName,
  initialStepValue,
  stepFormDefaults,
  isStepCreation = true,
  selectedColumns = [],
  variables,
  interpolateFunc = (e: any) => e,
  onFormSaved,
}: BaseStepFormProps<StepType>) {
  const [editedStep, setEditedStep] = useState<StepType>({
    ...initialStepValue,
    ...stepFormDefaults,
  });
  const [errors, setErrors] = useState<ValidationError[] | null>(null);

  const validate = useCallback((stepToValidate: StepType = editedStep) => {
    const model = schemaFactory(stepName, {
      ...stepToValidate, // context for schema factory
    });

    const ajv = new Ajv({ allErrors: true, strictSchema: false });
    addAjvKeywords(ajv);
    const ajvValidator: ValidateFunction = ajv.compile(model);

    const interpolator = new PipelineInterpolator(interpolateFunc, variables);

    // Interpolate and validate
    const interpolatedStep = interpolator.interpolateStep(stepToValidate);
    const valid = ajvValidator(interpolatedStep);

    if (!valid) {
      const formErrors = ajvValidator.errors?.map(ajvErrorsToValidationError) || [];
      setErrors(formErrors);
      return false;
    }

    setErrors(null);
    return true;
  }, [editedStep, stepName, interpolateFunc, variables]);

  const submit = useCallback((stepToSubmit: StepType = editedStep) => {
    if (validate(stepToSubmit)) {
      onFormSaved(stepToSubmit);
    }
  }, [editedStep, validate, onFormSaved]);

  return {
    editedStep,
    setEditedStep,
    errors,
    setErrors,
    submit,
    validate,
  };
}

// A wrapper component that provides the common layout
export const StepFormWrapper: React.FC<React.PropsWithChildren<{
  title: string;
  stepName: string;
  onBack: () => void;
  onSubmit: () => void;
  backendError?: string;
}>> = ({ title, stepName, onBack, onSubmit, backendError, children }) => {
  return (
    <div>
      <StepFormHeader
        title={title}
        stepName={stepName}
        version={version}
        backendError={backendError}
        onBack={onBack}
      />
      {children}
      <StepFormButtonbar onSubmit={onSubmit} />
    </div>
  );
};
