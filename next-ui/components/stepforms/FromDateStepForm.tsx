import React, { useState, useEffect } from 'react';
import { useStepForm, StepFormWrapper, BaseStepFormProps } from './StepForm';
import ColumnPicker from './ColumnPicker';
import AutocompleteWidget from './widgets/Autocomplete';
import InputTextWidget from './widgets/InputText';
import styles from './FromDateStepForm.module.scss';
import { FromDateStep } from '@/lib/steps';

interface Translator {
  id: string;
  label: string;
  doc: string;
}

interface FormatOption {
  format: string;
  label: string;
  example: string;
}

const FromDateStepForm: React.FC<BaseStepFormProps<FromDateStep>> = (props) => {
  const {
    initialStepValue = { name: 'fromdate', column: '', format: '%Y-%m-%d' },
    stepFormDefaults,
  } = props;

  const translatorName = 'pandas'; // Default

  const formatOptions: FormatOption[] = [
    { format: 'custom', label: 'Custom', example: '' },
    { format: '%Y-%m-%d', label: '%Y-%m-%d', example: '1970-12-31' },
    { format: '%Y/%m/%d', label: '%Y/%m/%d', example: '1970/12/31' },
    { format: '%d-%m-%Y', label: '%d-%m-%Y', example: '31-12-1970' },
    { format: '%d/%m/%Y', label: '%d/%m/%Y', example: '31/12/1970' },
    { format: '%d %b %Y', label: '%d %b %Y', example: '31 Dec 1970' },
    { format: '%d-%b-%Y', label: '%d-%b-%Y', example: '31-Dec-1970' },
    { format: '%d %B %Y', label: '%d %B %Y', example: '31 December 1970' },
    { format: '%b %Y', label: '%b %Y', example: 'Dec 1970' },
    { format: '%b-%Y', label: '%b-%Y', example: 'Dec-1970' },
    { format: '%B %Y', label: '%B %Y', example: 'December 1970' },
    { format: '%Y-%m', label: '%Y-%m', example: '1970-12' },
    { format: '%Y/%m', label: '%Y/%m', example: '1970/12' },
    { format: '%m-%Y', label: '%m-%Y', example: '12-1970' },
    { format: '%m/%Y', label: '%m/%Y', example: '12/1970' },
  ];

  const datePresets = formatOptions
    .filter((d) => d.format !== 'custom')
    .map((d) => d.format);

  const translators: Translator[] = [
    {
      id: 'mongo36',
      label: 'Mongo 3.6',
      doc: 'https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/#format-specifiers',
    },
    {
      id: 'mongo40',
      label: 'Mongo 4.0',
      doc: 'https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/#format-specifiers',
    },
    {
      id: 'mongo42',
      label: 'Mongo 4.2',
      doc: 'https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/#format-specifiers',
    },
    {
      id: 'mongo50',
      label: 'Mongo 5.0',
      doc: 'https://docs.mongodb.com/manual/reference/operator/aggregation/dateToString/#format-specifiers',
    },
    {
      id: 'pandas',
      label: 'Pandas',
      doc: 'https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes',
    },
    {
      id: 'pandas-no_joins',
      label: 'Pandas',
      doc: 'https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes',
    },
  ];

  const { editedStep, setEditedStep, errors, submit } = useStepForm({
    ...props,
    initialStepValue: { ...initialStepValue, ...stepFormDefaults },
  });

  const getSelectedFormat = (): FormatOption => {
    if (datePresets.includes(editedStep.format)) {
      return formatOptions.filter((d) => d.format === editedStep.format)[0] || formatOptions[0];
    }
    return formatOptions.filter((d) => d.format === 'custom')[0];
  };

  const [selectedFormat, setSelectedFormat] = useState<FormatOption>(getSelectedFormat());

  useEffect(() => {
    setSelectedFormat(getSelectedFormat());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedStep.format]);

  const updateStepFormat = (newFormat: FormatOption | string) => {
    const formatOpt = typeof newFormat === 'string'
        ? formatOptions.find(f => f.format === newFormat)
        : newFormat as FormatOption;

    if (!formatOpt) return;

    if (formatOpt.format === 'custom') {
      setEditedStep({ ...editedStep, format: '' });
    } else {
      setEditedStep({ ...editedStep, format: formatOpt.format });
    }
    setSelectedFormat(formatOpt);
  };

  const updateCustomFormat = (format: string | undefined) => {
    setEditedStep({ ...editedStep, format: format ?? '' });
  };

  const currentTranslator = translators.find((t) => t.id === translatorName) || translators[4];
  const useCustomFormat = selectedFormat.format === 'custom';

  return (
    <StepFormWrapper
      title="Convert Column From Date to Text"
      stepName="fromdate"
      onBack={props.onBack}
      onSubmit={submit}
      backendError={props.backendError}
    >
      <div className={styles.column}>
        <ColumnPicker
          name="Column to convert:"
          value={editedStep.column}
          options={props.columnNames || []}
          onChange={(val) => setEditedStep({ ...editedStep, column: val })}
          placeholder="Add columns"
          dataPath=".column"
          errors={errors}
          columnNames={props.columnNames}
          selectedColumns={props.selectedColumns}
        />
      </div>

      <div className={styles.format}>
        <AutocompleteWidget
          name="Date format:"
          value={selectedFormat}
          options={formatOptions}
          onChange={updateStepFormat}
          placeholder="Date format"
          trackBy="format"
          label="label"
          withExample={true}
        />
      </div>

      {useCustomFormat && (
        <div className={styles.customFormat}>
          <InputTextWidget
            name="Custom date format:"
            value={editedStep.format}
            onChange={updateCustomFormat}
            placeholder={`Enter a ${currentTranslator.label} date format`}
            // dataPath=".format"
            // errors={errors}
            docUrl={currentTranslator.doc}
          />
        </div>
      )}
    </StepFormWrapper>
  );
};

export default FromDateStepForm;
