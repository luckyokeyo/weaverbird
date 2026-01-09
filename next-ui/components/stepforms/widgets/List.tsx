import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './List.module.scss';
import { VariableDelimiters, VariablesBucket } from '@/types';
import { ErrorObject } from 'ajv';
import cloneDeep from 'lodash/cloneDeep';

// NOTE: We need to import the FontAwesome icons if they are not globally available.
// next-ui uses FAIcon component which uses string keys.

import FAIcon from '@/components/FAIcon';

interface ListWidgetProps {
  name?: string;
  addFieldName?: string;
  componentProps?: object;
  separatorLabel?: string;
  value?: any[];
  options?: string[];
  widget?: React.FC<any>; // Component to render for each item
  automaticNewField?: boolean;
  defaultItem?: any;
  errors?: ErrorObject[] | null;
  dataPath?: string;
  availableVariables?: VariablesBucket;
  variableDelimiters?: VariableDelimiters;
  trustedVariableDelimiters?: VariableDelimiters;
  unstyledItems?: boolean;
  columnNames?: string[];
  selectedColumns?: string[];
  onChange: (newValue: any[]) => void;
  onSetSelectedColumns?: (args: { column: string }) => void;
}

const ListWidget: React.FC<ListWidgetProps> = ({
  name,
  addFieldName = '',
  componentProps = {},
  separatorLabel,
  value = [],
  options = [],
  widget: WidgetComponent,
  automaticNewField = true,
  defaultItem = null,
  errors,
  dataPath,
  availableVariables,
  variableDelimiters,
  trustedVariableDelimiters,
  unstyledItems = false,
  columnNames = [],
  selectedColumns = [],
  onChange,
  onSetSelectedColumns,
}) => {
  // If WidgetComponent is not provided, we should probably default to InputTextWidget,
  // but we can't easily import it if it causes circular dependency or if we want to keep it generic.
  // In Vue it defaulted to InputTextWidget.

  const defaultChildValue = (() => {
    if (defaultItem !== null) {
      return defaultItem;
    }
    // If widget is InputTextWidget (we can't easily check React component equality like Vue), default to ''
    // For now assume generic object or string based on value
    if (value && value.length > 0 && typeof value[0] === 'string') {
      return '';
    }
    return []; // Default to array if not string? Or object?
  })();

  const children = (() => {
    const valueCopy = [...value];
    if (automaticNewField) {
      valueCopy.push(defaultChildValue);
    }
    return valueCopy.map((val, idx) => ({
      isRemovable: !automaticNewField || valueCopy.length !== 1,
      value: val,
    }));
  })();

  const addFieldSet = () => {
    onChange([...value, cloneDeep(defaultChildValue)]);
  };

  const removeChild = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateChildValue = (childValue: any, index: number) => {
    const newValue = [...value];
    if (value.length < index) {
      newValue.push(childValue);
    } else {
      newValue[index] = childValue;
    }
    onChange(newValue);
  };

  // Find error for the list itself
  const messageError = errors
    ?.filter((err) => err.instancePath === dataPath || err.dataPath === dataPath)
    .map((err) => err.message)
    .join(', ');

  return (
    <div className={classNames(styles.widgetListContainer, { [styles.hasError]: messageError })}>
      {name && <label className={styles.label}>{name}</label>}
      <div className={styles.widgetListBody}>
        {children.map((child, index) => (
          <div key={index} className={styles.widgetListChild}>
            {index > 0 && separatorLabel && (
              <span className={styles.widgetListComponentSep}>{separatorLabel}</span>
            )}
            <div
              className={classNames(styles.widgetListComponent, {
                [styles.colored]: !unstyledItems,
              })}
            >
              {WidgetComponent && (
                <WidgetComponent
                  {...componentProps}
                  value={child.value}
                  options={options}
                  availableVariables={availableVariables}
                  variableDelimiters={variableDelimiters}
                  trustedVariableDelimiters={trustedVariableDelimiters}
                  onChange={(val: any) => updateChildValue(val, index)}
                  dataPath={dataPath ? `${dataPath}.${index}` : undefined} // Adjust dataPath for child
                  errors={errors}
                  columnNames={columnNames}
                  selectedColumns={selectedColumns}
                  onSetSelectedColumns={onSetSelectedColumns}
                />
              )}
            </div>
            {child.isRemovable && (
              <div className={styles.widgetListIcon} onClick={() => removeChild(index)}>
                <FAIcon icon="trash-alt" />
              </div>
            )}
          </div>
        ))}
        {messageError && (
          <div className={styles.fieldMsgError}>
            <FAIcon icon="exclamation-circle" />
            {messageError}
          </div>
        )}
        {!automaticNewField && (
          <button className={styles.widgetListAddFieldset} onClick={addFieldSet}>
            <FAIcon className={styles.widgetListAddFieldsetIcon} icon="plus-circle" />
            {addFieldName}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListWidget;
