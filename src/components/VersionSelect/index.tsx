import React from 'react';
import { Button, Radio } from 'antd';
import { useUserStore } from '../../stores/userStore';

interface Option {
  value: string;
  label: string;
}
const OPTIONS = [
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Student', label: 'Student' }
];
interface VersionSelectProps {
  options?: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const VersionSelect: React.FC<VersionSelectProps> = (props) => {
  const { options = OPTIONS, defaultValue, onChange } = props;
  const version = useUserStore((state) => state.version);

  return version === 'Teacher' ? (
    <Radio.Group
      defaultValue={defaultValue || version}
      buttonStyle="solid"
      size={'large'}
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
  ) : (
    <Button type="primary" size={'large'}>
      Student
    </Button>
  );
};

export default VersionSelect;
