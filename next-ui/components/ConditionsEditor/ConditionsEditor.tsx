import React from 'react';
import ConditionsGroup from './ConditionsGroup';
import type { AbstractFilterTree, AbstractCondition } from './tree-types';
import styles from './ConditionsEditor.module.scss';

interface ConditionsEditorProps {
  conditionsTree: AbstractFilterTree;
  defaultValue: any;
  onConditionsTreeUpdated: (tree: AbstractFilterTree) => void;
  children?: (props: {
    condition: AbstractCondition;
    dataPath: string;
    updateCondition: (c: AbstractCondition) => void;
  }) => React.ReactNode;
}

export default function ConditionsEditor({
  conditionsTree,
  defaultValue,
  onConditionsTreeUpdated,
  children,
}: ConditionsEditorProps) {
  return (
    <div className={styles.conditionsEditor}>
      <ConditionsGroup
        conditionsTree={conditionsTree}
        defaultValue={defaultValue}
        isRootGroup={true}
        onConditionsTreeUpdated={onConditionsTreeUpdated}
      >
        {children
          ? children
          : (props) => (
              <input
                value={props.condition}
                onInput={(e) => props.updateCondition((e.target as HTMLInputElement).value)}
              />
            )}
      </ConditionsGroup>
    </div>
  );
}
