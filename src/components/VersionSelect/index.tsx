import React from 'react';
import { Radio } from 'antd';
import { useUserStore } from '../../stores/userStore';

interface Option {
  value: string;
  label: string;
}
const OPTIONS = [
  { value: 'Teacher', label: 'Teacher View' },
  { value: 'Student', label: 'Student View' }
];
interface VersionSelectProps {
  options?: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const VersionSelect: React.FC<VersionSelectProps> = (props) => {
  const { options = OPTIONS, defaultValue } = props;
  const initVer = useUserStore((state) => state.initVer);
  const handleVer = useUserStore((state) => state.handleVer);

  return (
    <Radio.Group
      defaultValue={defaultValue || initVer}
      buttonStyle="solid"
      size={'large'}
      onChange={(e) => e.target.value && handleVer(e.target.value)}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          disabled={initVer !== 'Teacher' && option.value === 'Teacher'}
        >
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default VersionSelect;
