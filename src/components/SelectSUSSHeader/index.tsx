import { Cascader, CascaderProps, DatePicker, GetProp } from 'antd';
import { useEffect } from 'react';
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
    <div className={'flex gap-4'}>
      <Cascader
        showSearch={{ filter }}
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
      <RangePicker allowClear onChange={handleDateChange} />
    </div>
  );
};

export default SelectSUSSHeader;
