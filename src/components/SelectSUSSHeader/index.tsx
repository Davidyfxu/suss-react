import { DatePicker, Select } from 'antd';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';
import { Dayjs } from 'dayjs';

const SelectSUSSHeader = () => {
  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);
  const setDateRange = useUserStore((state) => state.setDateRange);
  const [semester, setSemester] = useState();
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
      setDateRange?.(null);
      return;
    }

    const range: [string?, string?] = [];
    if (start) {
      range[0] = start.format('YYYY-MM-DD');
    }
    if (end) {
      range[1] = end.format('YYYY-MM-DD');
    }

    setDateRange?.(range as [string, string]);
  };

  const { data, isLoading } = useSWR('courseOptions', async () => {
    const {
      JAN23 = [],
      JUL23 = [],
      OTHER = [] as string[]
    } = await get_course_options();

    const otherSemesters: string[] = Array.from(
      new Set(
        OTHER.map((o: string) => o.split('_')[1]).filter(
          (o: string) => o && /^[a-zA-Z]{3}\d{2}$/.test(o)
        )
      )
    );
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
      },
      ...otherSemesters.map((s: string) => ({
        value: s,
        label: s,
        children: OTHER.filter((o: string) => o.includes(s)).map(
          (v: string) => ({
            value: v,
            label: v
          })
        )
      }))
    ];
  });

  const semesterOptions =
    data?.map((d) => ({ value: d?.value, label: d?.label })) || [];

  const courseOptions =
    data?.find?.((v) => v?.value === semester)?.children || [];

  useEffect(() => {
    setCourseCode?.(null);
  }, [semester]);

  return (
    <div className={'py-2 flex flex-col gap-2'}>
      <Select
        className={'flex-1'}
        value={semester}
        loading={isLoading}
        allowClear
        placeholder="Select a Semester"
        options={semesterOptions}
        onChange={(value) => setSemester(value)}
      />
      {semester && (
        <Select
          showSearch
          className={'flex-1'}
          value={courseCode}
          loading={isLoading}
          placeholder="Select a Course"
          options={courseOptions}
          onChange={(value) => setCourseCode?.(value)}
        />
      )}

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
  );
};

export default SelectSUSSHeader;
