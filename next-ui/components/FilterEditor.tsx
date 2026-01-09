import React, { useMemo } from 'react';
import ConditionsEditor from './ConditionsEditor/ConditionsEditor';
import type { AbstractFilterTree } from './ConditionsEditor/tree-types';
import {
  buildConditionsEditorTree,
  buildFilterStepTree,
  castFilterStepTreeValue,
} from './stepforms/convert-filter-step-tree';
import FilterSimpleConditionWidget, {
  DEFAULT_FILTER,
} from './stepforms/widgets/FilterSimpleCondition';
import type { ColumnTypeMapping } from '@/lib/dataset';
import type { FilterCondition } from '@/lib/steps';
import type { VariableDelimiters, VariablesBucket } from '@/lib/variables';
import styles from './FilterEditor.module.scss';

interface FilterEditorProps {
  filterTree?: FilterCondition;
  columnTypes?: ColumnTypeMapping;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  hideColumnVariables?: boolean;
  multiVariable?: boolean;
  errors?: any[];
  onFilterTreeUpdated: (tree: FilterCondition) => void;
  onSetSelectColumns?: (cols: { column: string }) => void;
}

export default function FilterEditor({
  filterTree = { column: '', value: '', operator: 'eq' },
  columnTypes = {},
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  hideColumnVariables,
  multiVariable = true,
  errors = [],
  onFilterTreeUpdated,
  onSetSelectColumns,
}: FilterEditorProps) {
  const defaultValue = DEFAULT_FILTER;

  const conditionsTree = useMemo(() => {
    return buildConditionsEditorTree(castFilterStepTreeValue(filterTree, columnTypes));
  }, [filterTree, columnTypes]);

  const updateFilterTree = (newConditionsTree: AbstractFilterTree) => {
    const newFilterTree = buildFilterStepTree(newConditionsTree);
    onFilterTreeUpdated(newFilterTree);
  };

  return (
    <div className={styles.filterEditor}>
      <ConditionsEditor
        conditionsTree={conditionsTree}
        onConditionsTreeUpdated={updateFilterTree}
        defaultValue={defaultValue}
      >
        {(props) => (
          <FilterSimpleConditionWidget
            value={props.condition || undefined}
            onChange={props.updateCondition}
            columnNamesProp={Object.keys(columnTypes)}
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
            hideColumnVariables={hideColumnVariables}
            dataPath={props.dataPath}
            errors={errors}
            multiVariable={multiVariable}
            columnTypes={columnTypes}
            onSetSelectedColumns={onSetSelectColumns}
          />
        )}
      </ConditionsEditor>
    </div>
  );
}
