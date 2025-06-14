import React from 'react';
import { Radio } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useResponsive } from 'ahooks';
// @ts-ignore
import StudentIcon from '../../assets/student-views.svg?react';
// @ts-ignore
import StudentWhiteIcon from '../../assets/student-views-white.svg?react';
// @ts-ignore
import TeacherIcon from '../../assets/teacher-views.svg?react';
// @ts-ignore
import TeacherWhiteIcon from '../../assets/teacher-views-white.svg?react';
// import Icon from '@ant-design/icons';
interface Option {
  value: string;
  label: string;
}

interface VersionSelectProps {
  options?: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const OPTIONS = [
  {
    value: 'Teacher',
    label: 'Teacher View'
  },
  {
    value: 'Student',
    label: 'Student View'
  }
];
const VersionSelect: React.FC<VersionSelectProps> = (props) => {
  const { options = OPTIONS, defaultValue } = props;
  const responsive = useResponsive();
  const initVer = useUserStore((state) => state.initVer);
  const handleVer = useUserStore((state) => state.handleVer);
  const version = useUserStore((state) => state.version);

  const renderIcon = (value: string) => {
    const className = 'w-6 h-6 mt-2';
    if (value === 'Teacher') {
      return version === value ? (
        <TeacherWhiteIcon className={className} />
      ) : (
        <TeacherIcon className={className} />
      );
    } else {
      return version === value ? (
        <StudentWhiteIcon className={className} />
      ) : (
        <StudentIcon className={className} />
      );
    }
  };

  return (
    <Radio.Group
      defaultValue={defaultValue || initVer}
      buttonStyle="solid"
      className={'min-w-28'}
      size={'large'}
      onChange={(e) => e.target.value && handleVer(e.target.value)}
    >
      {(initVer === 'Teacher'
        ? options
        : options.filter((o) => o.value !== 'Teacher')
      ).map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          disabled={initVer !== 'Teacher' && option.value === 'Teacher'}
        >
          {responsive?.xl ? option.label : renderIcon(option?.value)}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default VersionSelect;
