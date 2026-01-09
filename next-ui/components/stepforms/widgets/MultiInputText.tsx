import React from 'react';
import CreatableSelect from 'react-select/creatable';

// Stub for MultiInputTextWidget
export default function MultiInputTextWidget(props: any) {
  // Uses react-select creatable for multiple values
  return <CreatableSelect isMulti {...props} />;
}
