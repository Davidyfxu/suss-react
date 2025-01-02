import { Cascader, CascaderProps, DatePicker, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';
import { Dayjs } from 'dayjs';
type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];

const { RangePicker } = DatePicker;

const SelectSUSSHeader = () => {
  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);
  const setDateRange = useUserStore((state) => state.setDateRange);
  const [semester, setSemester] = useState('JAN23');
  const handleDateChange = (dates: Dayjs[] | null) => {
    if (dates) {
      // 将时间范围转换为当日的最早时间和最晚时间
      const startOfDay = dates[0].format('YYYY-MM-DD');
      const endOfDay = dates[1].format('YYYY-MM-DD');
      setDateRange([startOfDay, endOfDay]);
    } else {
      setDateRange(null);
    }
  };
  const { data, isLoading } = useSWR('courseOptions', async () => {
    const { JAN23 = [], JUL23 = [] } = await get_course_options();
    return [
      {
        value: 'JAN23',
        label: 'JAN23',
        children: JAN23.map((value: string) => ({
          value: value,
          label: value
        }))
      },
      {
        value: 'JUL23',
        label: 'JUL23',
        children: JUL23.map((value: string) => ({
          value: value,
          label: value
        }))
      }
    ];
  });

  useEffect(() => {
    if (data?.[0]?.children?.[0]?.value) {
      setCourseCode?.(data[0].children[0].value);
    }
  }, [data, setCourseCode]);
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) =>
        (option.label as string)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1
    );
  return (
    <div className={'py-4 flex flex-col gap-4'}>
      <Cascader
        showSearch={{ filter }}
        allowClear={false}
        value={courseCode ? [semester, courseCode] : undefined}
        loading={isLoading}
        placeholder="Select a Course"
        options={data}
        onChange={(v) => {
          setSemester(v[0]);
          setCourseCode?.(v[1]);
        }}
      />
      <RangePicker allowClear onChange={handleDateChange} />
    </div>
  );
};

export default SelectSUSSHeader;
