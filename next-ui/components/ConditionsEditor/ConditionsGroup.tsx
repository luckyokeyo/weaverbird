import React, { useEffect } from 'react';
import classNames from 'classnames';
import FAIcon from '@/components/FAIcon';
import styles from './ConditionsGroup.module.scss';
import type { AbstractCondition, AbstractFilterTree, ConditionOperator } from './tree-types';

interface ConditionsGroupProps {
  conditionsTree: AbstractFilterTree;
  defaultValue: any;
  isRootGroup?: boolean;
  dataPath?: string;
  onConditionsTreeUpdated: (tree: AbstractFilterTree) => void;
  children: (props: {
    condition: AbstractCondition;
    dataPath: string;
    updateCondition: (c: AbstractCondition) => void;
  }) => React.ReactNode;
}

export default function ConditionsGroup({
  conditionsTree,
  defaultValue,
  isRootGroup = false,
  dataPath = '',
  onConditionsTreeUpdated,
  children,
}: ConditionsGroupProps) {
  const operator = conditionsTree.operator;
  const conditions = conditionsTree.conditions;
  const groups = conditionsTree.groups;
  const hasMultipleRows = conditions.length > 1 || (groups && groups.length > 0);

  const addGroup = () => {
    const newGroups = groups || [];
    newGroups.push({
      operator: 'and',
      conditions: [defaultValue],
      groups: [],
    });

    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      groups: newGroups,
    };

    setOperatorIfNecessaryAndUpdateConditionTree(newConditionsTree);
  };

  const addRow = () => {
    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      conditions: [...conditions, defaultValue],
    };

    setOperatorIfNecessaryAndUpdateConditionTree(newConditionsTree);
  };

  const deleteGroup = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups.splice(groupIndex, 1);

    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      groups: newGroups,
    };

    emitUpdatedConditionTree(newConditionsTree);
    // Logic to reset operator if necessary is handled by effect in this functional component
    // or we can call it directly, but state update is from parent prop.
    // In Vue: async resetOperatorIfNecessary().
    // Here, we can do it optimistically or wait for update.
    // However, the props pattern means we emit up, and props come down.
    // So we should check logic in the emit function or use a useEffect?
    // The Vue code says: await this.$nextTick(); resetOperatorIfNecessary().
    // This implies it checks *after* the deletion.
  };

  const deleteRow = (rowIndex: number) => {
    const newConditions = [...conditions];
    newConditions.splice(rowIndex, 1);

    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      conditions: newConditions,
    };

    emitUpdatedConditionTree(newConditionsTree);
  };

  // We need to simulate the resetOperatorIfNecessary logic.
  // In React, this should probably be an effect that runs when conditions/groups change.
  useEffect(() => {
    if (conditions.length === 1 && groups.length === 0 && operator !== '') {
       const newConditionsTree: AbstractFilterTree = {
        ...conditionsTree,
        operator: '',
      };
      // We need to avoid infinite loops. Only emit if operator is not empty.
       onConditionsTreeUpdated(newConditionsTree);
    }
  }, [conditions.length, groups.length, operator]); // dependencies

  const isLastRow = (rowIndex: number) => {
    const hasGroups = groups && groups.length;
    const isLastCondition = rowIndex === conditions.length - 1;
    return !hasGroups && isLastCondition;
  };

  const isLastGroup = (groupIndex: number) => {
    return groupIndex === groups.length - 1;
  };

  const setOperatorIfNecessaryAndUpdateConditionTree = (newConditionsTree: AbstractFilterTree) => {
    if (operator === '') {
      newConditionsTree = {
        ...newConditionsTree,
        operator: 'and',
      };
    }
    emitUpdatedConditionTree(newConditionsTree);
  };

  const updateCondition = (rowIndex: number) => {
    return (c: AbstractCondition) => {
      const newConditions = [...conditions];
      newConditions[rowIndex] = c;

      const newConditionsTree: AbstractFilterTree = {
        ...conditionsTree,
        conditions: newConditions,
      };

      emitUpdatedConditionTree(newConditionsTree);
    };
  };

  const updateGroup = (groupIndex: number, g: AbstractFilterTree) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = g;

    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      groups: newGroups,
    };

    emitUpdatedConditionTree(newConditionsTree);
  };

  const switchOperator = (newOperator: ConditionOperator) => {
    const newConditionsTree: AbstractFilterTree = {
      ...conditionsTree,
      operator: newOperator,
    };
    emitUpdatedConditionTree(newConditionsTree);
  };

  const emitUpdatedConditionTree = (newConditionsTree: AbstractFilterTree) => {
    onConditionsTreeUpdated(newConditionsTree);
  };

  return (
    <div
      className={classNames(styles.conditionsGroup, {
        [styles.withSwitch]: hasMultipleRows || !isRootGroup,
      })}
    >
      {(hasMultipleRows || !isRootGroup) && (
        <div className={styles.switch}>
          <div className={styles.switchLink} />
          <div className={styles.switchButtons}>
            <div
              className={classNames(styles.switchButton, {
                [styles.active]: operator === 'and',
              })}
              onClick={() => switchOperator('and')}
            >
              and
            </div>
            <div
              className={classNames(styles.switchButton, {
                [styles.active]: operator === 'or',
              })}
              onClick={() => switchOperator('or')}
            >
              or
            </div>
          </div>
        </div>
      )}

      {conditions.map((condition, rowIndex) => (
        <div key={'row' + rowIndex} className={styles.conditionRow}>
          {(hasMultipleRows || !isRootGroup) && (
            <div
              className={classNames(styles.conditionRowLink, {
                [styles.conditionRowLinkLast]: isLastRow(rowIndex),
              })}
            >
              <div className={styles.top} />
              <div className={styles.middle} />
              <div className={styles.bottom} />
            </div>
          )}
          <div className={styles.conditionRowContent}>
            {children({
              dataPath: operator !== '' ? `${dataPath}.${operator}[${rowIndex}]` : dataPath,
              condition: condition,
              updateCondition: updateCondition(rowIndex),
            })}
          </div>
          {hasMultipleRows && (
            <div
              className={styles.conditionRowDelete}
              role="button"
              aria-label="Delete this group"
              onClick={() => deleteRow(rowIndex)}
            >
              <FAIcon icon="far trash-alt" />
            </div>
          )}
        </div>
      ))}

      {groups &&
        groups.map((groupConditionTree, groupIndex) => (
          <div className={styles.childGroup} key={'group' + groupIndex}>
            <div
              className={classNames(styles.conditionsGroupLink, {
                [styles.conditionsGroupLinkLast]: isLastGroup(groupIndex),
              })}
            >
              <div className={styles.top} />
              <div className={styles.middle} />
              <div className={styles.bottom} />
            </div>
            <ConditionsGroup
              conditionsTree={groupConditionTree}
              dataPath={`${dataPath}.${operator}[${groupIndex + conditions.length}]`}
              defaultValue={defaultValue}
              onConditionsTreeUpdated={(tree) => updateGroup(groupIndex, tree)}
            >
              {children}
            </ConditionsGroup>
            <div
              className={styles.delete}
              role="button"
              aria-label="Delete this group"
              onClick={() => deleteGroup(groupIndex)}
            >
              <FAIcon icon="far trash-alt" />
            </div>
          </div>
        ))}

      <div className={styles.actionButtons}>
        {(hasMultipleRows || !isRootGroup) && (
          <div className={styles.actionButtonsLink}>
            <div className={styles.top} />
            <div className={styles.middle} />
          </div>
        )}
        <div
          className={classNames(styles.addButton, styles.addButtonCondition)}
          onClick={addRow}
        >
          Add condition
        </div>
        {isRootGroup && (
          <div
            className={classNames(styles.addButton, styles.addButtonGroup)}
            onClick={addGroup}
          >
            Add group
          </div>
        )}
      </div>
    </div>
  );
}
