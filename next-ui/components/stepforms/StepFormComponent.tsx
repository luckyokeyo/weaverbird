import React, { useState, useEffect } from 'react';
import StepFormsComponents from './index'; // Correctly import the default export
import { PipelineStep, PipelineStepName, ReferenceToExternalQuery } from '@/lib/steps';
import { VariableDelimiters, VariablesBucket, ColumnTypeMapping } from '@/types';
import { InterpolateFunction, ScopeContext } from '@/lib/templating';

interface StepFormComponentProps {
  name: PipelineStepName;
  initialStepValue?: any;
  stepFormDefaults?: any;
  backendError?: string;
  columnTypes?: ColumnTypeMapping;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  variables?: ScopeContext;
  availableDomains?: { name: string; uid: string }[];
  unjoinableDomains?: { name: string; uid: string }[];
  interpolateFunc: InterpolateFunction;
  getColumnNamesFromPipeline: (
    pipelineNameOrDomain: string | ReferenceToExternalQuery,
  ) => Promise<string[] | undefined>;
  selectedColumn?: string;
  onBack: () => void;
  onFormSaved: (step: PipelineStep) => void;
}

const StepFormComponent: React.FC<StepFormComponentProps> = (props) => {
  const { name, selectedColumn, initialStepValue } = props;

  const [selectedColumns, setSelectedColumns] = useState<string[]>(selectedColumn ? [selectedColumn] : []);

  useEffect(() => {
    if (selectedColumn && selectedColumn !== selectedColumns[0]) {
        setSelectedColumns([selectedColumn]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumn]);

  const FormComponent = StepFormsComponents[name];

  if (!FormComponent) {
      return <div>Unknown step form: {name}</div>;
  }

  const isStepCreation = initialStepValue === undefined;

  return (
    <FormComponent
      {...props}
      key={`${name}__${selectedColumns[0] || ''}`}
      isStepCreation={isStepCreation}
      selectedColumns={selectedColumns}
      onSetSelectedColumns={({ column }: { column: string }) => setSelectedColumns([column])}
    />
  );
};

export default StepFormComponent;
