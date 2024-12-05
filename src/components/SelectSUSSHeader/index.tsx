import { Cascader, DatePicker } from 'antd';
import { useEffect } from 'react';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';
import { useQuery } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

const SelectSUSSHeader = () => {
  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);

  const { data, isLoading } = useQuery({
    queryKey: ['courseOptions'],
    queryFn: async () => {
      const { course_codes = [] } = await get_course_options();
      return [
        {
          value: 'JAN 2023',
          label: 'JAN 2023',
          children: course_codes.map((value: string) => ({
            value: value,
            label: value
          }))
        }
      ];
    }
  });

  useEffect(() => {
    if (data?.[0]?.children?.[0]?.value) {
      setCourseCode?.(data[0].children[0].value);
    }
  }, [data, setCourseCode]);

  return (
    <div className={'flex gap-4'}>
      <Cascader
        className={'w-60'}
        allowClear={false}
        value={courseCode ? ['JAN 2023', courseCode] : undefined}
        loading={isLoading}
        placeholder="Select a Course"
        options={data}
        onChange={(v) => {
          setCourseCode?.(v[1]);
        }}
      />
      <RangePicker />
    </div>
  );
};

export default SelectSUSSHeader;
