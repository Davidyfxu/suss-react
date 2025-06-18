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
  const version = useUserStore((state) => state.version);
  const [semester, setSemester] = useState<string | undefined>();
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
      setDateRange?.([]);
      return;
    }

    const range: string[] = [];
    if (start) {
      range[0] = start.format('YYYY-MM-DD');
    }
    if (end) {
      range[1] = end.format('YYYY-MM-DD');
    }

    setDateRange?.(range);
  };

  const { data, isLoading } = useSWR('courseOptions', async () => {
    const response = await get_course_options();
    const { teacher_courses = [], student_courses = [] } = response || {};

    // 根据当前版本选择对应的课程数据
    const currentEnrollmentData =
      version === 'Teacher' ? teacher_courses : student_courses;

    // 提取学期信息
    const semesterMap = new Map<string, string[]>();

    currentEnrollmentData.forEach((courseCode: string) => {
      // 假设格式为 XXX_JAN23_XX 或类似格式
      const parts = courseCode.split('_');
      if (parts.length >= 2) {
        const semesterPart = parts[1];
        // 验证学期格式（如 JAN23, JUL23 等）
        if (/^[a-zA-Z]{3}\d{2}$/.test(semesterPart)) {
          if (!semesterMap.has(semesterPart)) {
            semesterMap.set(semesterPart, []);
          }
          semesterMap.get(semesterPart)?.push(courseCode);
        }
      }
    });

    // 转换为选项格式
    return Array.from(semesterMap.entries())
      .map(([semester, courses]) => ({
        value: semester,
        label: semester,
        children: courses.map((course: string) => ({
          value: course,
          label: course
        }))
      }))
      .filter((r) => r?.children?.length > 0);
  });

  const semesterOptions =
    data?.map((d) => ({ value: d?.value, label: d?.label })) || [];

  const courseOptions =
    data?.find?.((v) => v?.value === semester)?.children || [];

  // 处理版本变化
  useEffect(() => {
    if (data && courseCode) {
      // 检查当前courseCode是否在新版本中存在
      const allCoursesInNewVersion = data.flatMap((d) =>
        d.children.map((c) => c.value)
      );
      const courseExistsInNewVersion =
        allCoursesInNewVersion.includes(courseCode);

      if (courseExistsInNewVersion) {
        // 如果课程存在，找到对应的学期
        const newSemester = data.find((d) =>
          d.children.some((c) => c.value === courseCode)
        )?.value;
        setSemester(newSemester);
      } else {
        // 如果课程不存在，则重置
        setCourseCode?.(undefined);
        setSemester(undefined);
      }
    } else {
      // 如果没有选中的课程，则重置
      setSemester(undefined);
    }
  }, [version, data, courseCode, setCourseCode]);

  // 处理学期变化
  useEffect(() => {
    setCourseCode?.(undefined);
  }, [semester, setCourseCode]);

  // 检查当前课程代码在选定学期下是否存在（仅当学期手动改变时）
  useEffect(() => {
    if (courseCode && data && semester) {
      const currentSemesterData = data.find((d) => d.value === semester);
      const courseExists = currentSemesterData?.children?.some(
        (child) => child.value === courseCode
      );

      if (!courseExists) {
        setCourseCode?.(undefined);
      }
    }
  }, [semester, courseCode, data, setCourseCode]);

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
          onChange={(value) => setCourseCode?.(value || '')}
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
