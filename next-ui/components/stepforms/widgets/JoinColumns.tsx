import React, { useEffect } from 'react';
import ColumnPicker from '@/components/stepforms/ColumnPicker';
import AutocompleteWidget from '@/components/stepforms/widgets/Autocomplete';
import styles from './JoinStepForm.module.scss';

// We need to implement JoinColumns logic.
// In Vue: JoinColumns.vue
// It contains two ColumnPickers (left and right).

interface JoinColumnsProps {
  value: string[];
  leftColumnNames: string[];
  rightColumnNames: string[];
  onChange: (value: string[]) => void;
  // ... other props
}

const JoinColumns: React.FC<JoinColumnsProps> = ({
  value,
  leftColumnNames,
  rightColumnNames,
  onChange,
}) => {
  const leftCol = value[0];
  const rightCol = value[1];

  const handleLeftChange = (val: string) => {
    onChange([val, rightCol]);
  };

  const handleRightChange = (val: string | object | undefined | null) => {
      // Autocomplete returns string or object.
      // ColumnPicker wraps Autocomplete but expects string.
      // But here we might use Autocomplete for right column directly if it's external?
      // Vue implementation uses AutocompleteWidget for right column.
      const v = typeof val === 'string' ? val : (val as any)?.value || val;
      onChange([leftCol, v]);
  };

  return (
    <div className={styles.joinColumnsContainer}>
      <div className={styles.leftColumn}>
        <ColumnPicker
            name=""
            value={leftCol}
            placeholder="Left column"
            columnNames={leftColumnNames}
            onChange={handleLeftChange}
            syncWithSelectedColumn={false}
        />
      </div>
      <div className={styles.rightColumn}>
         <AutocompleteWidget
            name=""
            value={rightCol}
            options={rightColumnNames}
            placeholder="Right column"
            onChange={handleRightChange}
            allowCustom={true}
         />
      </div>
    </div>
  );
};

export default JoinColumns;
