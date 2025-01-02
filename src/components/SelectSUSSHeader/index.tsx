import { Cascader, CascaderProps, DatePicker, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';
import { Dayjs } from 'dayjs';

type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];

const SelectSUSSHeader = () => {
  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);
  const setDateRange = useUserStore((state) => state.setDateRange);
  const [semester, setSemester] = useState('JAN23');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    updateDateRange(date, endDate);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
    updateDateRange(startDate, date);
  };

  // 统一处理日期范围更新
  const updateDateRange = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start && !end) {
      setDateRange(null);
      return;
    }

    const range: [string?, string?] = [];
    if (start) {
      range[0] = start.format('YYYY-MM-DD');
    }
    if (end) {
      range[1] = end.format('YYYY-MM-DD');
    }

    setDateRange(range as [string?, string?]);
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
        className={'w-full'}
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
      <div className="flex flex-col gap-2">
        <DatePicker
          className="flex-1 w-full"
          placeholder="Start Date"
          onChange={handleStartDateChange}
          value={startDate}
          allowClear
          disabledDate={(current) => (endDate ? current > endDate : false)}
        />

        <DatePicker
          className="flex-1 w-full"
          placeholder="End Date"
          onChange={handleEndDateChange}
          value={endDate}
          allowClear
          disabledDate={(current) => (startDate ? current < startDate : false)}
        />
      </div>
    </div>
  );
};

export default SelectSUSSHeader;
