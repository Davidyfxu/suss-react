import React from 'react';
import { Radio } from 'antd';

interface Option {
  value: string;
  label: string;
}
const OPTIONS = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'student', label: 'Student' }
];
interface VersionSelectProps {
  options?: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const VersionSelect: React.FC<VersionSelectProps> = (props) => {
  const { options = OPTIONS, defaultValue, onChange } = props;
  return (
    <Radio.Group
      defaultValue={defaultValue}
      buttonStyle="solid"
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          disabled={option?.disabled}
        >
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default VersionSelect;
