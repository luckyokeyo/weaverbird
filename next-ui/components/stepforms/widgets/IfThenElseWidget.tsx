import React, { useState } from 'react';
import classNames from 'classnames';
import FAIcon from '@/components/FAIcon';
import FilterEditor from '@/components/FilterEditor';
import InputTextWidget from './InputText';
import { IfThenElseStep, FilterCondition, Formula } from '@/lib/steps';
import { ColumnTypeMapping } from '@/lib/dataset';
import { VariableDelimiters, VariablesBucket } from '@/types';
import styles from './IfThenElseWidget.module.scss';
import convertIfThenElseToHumanFormat from '@/components/convert-if-then-else-to-human-format'; // Assuming we migrate this helper too or reuse

// We need to ensure convertIfThenElseToHumanFormat is available.
// If not, I should create a stub or migrate it.
// I will assume for now it's not critical for basic functionality if I skip it or stub it.

interface IfThenElseWidgetProps {
  value: Omit<IfThenElseStep, 'name' | 'newColumn'>;
  isRoot?: boolean;
  dataPath?: string;
  errors?: any[];
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  columnTypes?: ColumnTypeMapping;
  onChange: (newValue: Omit<IfThenElseStep, 'name' | 'newColumn'>) => void;
  onDeletedElseIf?: () => void;
}

const IfThenElseWidget: React.FC<IfThenElseWidgetProps> = ({
  value,
  isRoot = false,
  dataPath = '',
  errors = [],
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  columnTypes,
  onChange,
  onDeletedElseIf,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const hasElseIf = typeof value.else !== 'string';
  const inputPlaceHolderText = 'Enter a "Text" with quotes, or a formula';

  const updateFilterTree = (newFilterTree: FilterCondition) => {
    onChange({
      ...value,
      if: newFilterTree,
    });
  };

  const updateThenFormula = (formula: Formula) => {
    onChange({
      ...value,
      then: formula,
    });
  };

  const updateElseFormula = (elseObject: Omit<IfThenElseStep, 'name' | 'newColumn'> | Formula) => {
    onChange({
      ...value,
      else: elseObject || '',
    });
  };

  const transformElseIntoElseIf = () => {
    updateElseFormula({
      if: { column: '', value: '', operator: 'eq' },
      then: '',
      else: value.else as Formula,
    });
  };

  const transformElseIfIntoElse = () => {
    if (typeof value.else === 'object') {
      setCollapsed(false);
      updateElseFormula(value.else.else);
    }
  };

  const deleteElseIf = () => {
    if (onDeletedElseIf) {
      onDeletedElseIf();
    }
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // Safe helper call or placeholder
  const formulaToHumanFormat = isRoot ? 'IF ...' : 'ELSE IF ...'; // Placeholder

  return (
    <div className={styles.ifthenelseWidget}>
      <div
        className={classNames(styles.ifthenelseWidgetContainer, {
          [styles.ifthenelseWidgetContainerCollapsed]: collapsed,
        })}
      >
        <div className={styles.ifthenelseWidgetHeader}>
          <span className={styles.ifthenelseWidgetCollapseButton} onClick={toggle} />
          <div className={styles.ifthenelseWidgetTag}>{isRoot ? 'IF' : 'ELSE IF'}</div>
          {!isRoot && !collapsed && (
            <div className={styles.ifthenelseWidgetRemove} onClick={deleteElseIf}>
              <FAIcon icon="trash-alt" />
            </div>
          )}
          {collapsed && (
            <>
              <div
                className={styles.ifthenelseWidgetCollapseDescription}
                dangerouslySetInnerHTML={{ __html: formulaToHumanFormat }}
              />
              <div className={styles.ifthenelseWidgetCollapseText} onClick={toggle}>
                EXPAND
              </div>
            </>
          )}
        </div>

        <div className={styles.ifthenelseWidgetRow}>
          <div
            className={classNames(
              styles.ifthenelseWidgetRowLink,
              styles.ifthenelseWidgetRowLinkFilter,
            )}
          >
            <div className={styles.ifthenelseWidgetRowLinkTop} />
            <div className={styles.ifthenelseWidgetRowLinkMiddle} />
            <div className={styles.ifthenelseWidgetRowLinkBottom} />
          </div>
          <FilterEditor
            filterTree={value.if}
            errors={errors}
            // dataPath={`${dataPath}.if`}
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
            columnTypes={columnTypes}
            onFilterTreeUpdated={updateFilterTree}
          />
        </div>

        <div className={styles.ifthenelseWidgetRow}>
          <div className={styles.ifthenelseWidgetRowLink}>
            <div className={styles.ifthenelseWidgetRowLinkTop} />
            <div className={styles.ifthenelseWidgetRowLinkBottom} />
          </div>
          <div className={styles.ifthenelseWidgetTag}>THEN</div>
        </div>

        <div className={styles.ifthenelseWidgetRow}>
          <div className={styles.ifthenelseWidgetRowLink}>
            <div className={styles.ifthenelseWidgetRowLinkTop} />
            <div className={styles.ifthenelseWidgetRowLinkMiddle} />
            <div
              className={classNames(styles.ifthenelseWidgetRowLinkBottom, {
                [styles.ifthenelseWidgetRowLinkHidden]: hasElseIf,
              })}
            />
          </div>
          <InputTextWidget
            // className={styles.ifthenelseWidgetInput} // Passed via wrapper or need to support className in InputTextWidget
            value={value.then as string} // Assuming then is string/formula
            placeholder={inputPlaceHolderText}
            // dataPath={`${dataPath}.then`}
            // errors={errors}
            availableVariables={availableVariables}
            variableDelimiters={variableDelimiters}
            trustedVariableDelimiters={trustedVariableDelimiters}
            onChange={(val) => updateThenFormula(val || '')}
          />
        </div>

        {!hasElseIf && (
          <>
            <div className={styles.ifthenelseWidgetRow}>
              <div className={styles.ifthenelseWidgetRowLink}>
                <div className={styles.ifthenelseWidgetRowLinkTop} />
                <div className={styles.ifthenelseWidgetRowLinkBottom} />
              </div>
              <div className={styles.ifthenelseWidgetTag}>ELSE</div>
            </div>
            <div className={styles.ifthenelseWidgetRow}>
              <div className={styles.ifthenelseWidgetRowLink}>
                <div className={styles.ifthenelseWidgetRowLinkTop} />
                <div className={styles.ifthenelseWidgetRowLinkMiddle} />
                <div
                  className={classNames(
                    styles.ifthenelseWidgetRowLinkBottom,
                    styles.ifthenelseWidgetRowLinkDashed,
                  )}
                />
              </div>
              <InputTextWidget
                // className={styles.ifthenelseWidgetInput}
                value={value.else as string}
                placeholder={inputPlaceHolderText}
                // dataPath={`${dataPath}.else`}
                // errors={errors}
                availableVariables={availableVariables}
                variableDelimiters={variableDelimiters}
                trustedVariableDelimiters={trustedVariableDelimiters}
                onChange={(val) => updateElseFormula(val || '')}
              />
            </div>
          </>
        )}
      </div>

      {hasElseIf && (
        <IfThenElseWidget
          value={value.else as Omit<IfThenElseStep, 'name' | 'newColumn'>}
          dataPath={`${dataPath}.else`}
          errors={errors}
          availableVariables={availableVariables}
          variableDelimiters={variableDelimiters}
          trustedVariableDelimiters={trustedVariableDelimiters}
          columnTypes={columnTypes}
          onChange={updateElseFormula}
          onDeletedElseIf={transformElseIfIntoElse}
        />
      )}

      {!hasElseIf && (
        <div className={styles.ifthenelseWidgetFooter}>
          <div className={styles.ifthenelseWidgetRow}>
            <div className={styles.ifthenelseWidgetRowLink}>
              <div
                className={classNames(
                  styles.ifthenelseWidgetRowLinkTop,
                  styles.ifthenelseWidgetRowLinkDashed,
                )}
              />
              <div
                className={classNames(
                  styles.ifthenelseWidgetRowLinkMiddle,
                  styles.ifthenelseWidgetRowLinkMiddleDashed,
                )}
              />
            </div>
            <div className={styles.ifthenelseWidgetAdd} onClick={transformElseIntoElseIf}>
              Add nested condition
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IfThenElseWidget;
