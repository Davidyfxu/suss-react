import { Cascader, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';
const { RangePicker } = DatePicker;

const SelectSUSSHeader = () => {
  const [courseCodes, setCourseCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);

  const getCourseOptions = async () => {
    try {
      setLoading(true);
      const { course_codes = [] } = await get_course_options();

      // 将所有课程代码包装在 "JAN23 Semester" 下
      const cascaderOptions = [
        {
          value: 'JAN 2023',
          label: 'JAN 2023',
          children: course_codes.map((value: string) => ({
            value: value,
            label: value
          }))
        }
      ];

      setCourseCodes(cascaderOptions);

      // 设置默认的课程代码
      if (course_codes.length > 0) {
        setCourseCode && setCourseCode(course_codes[0]);
      }
    } catch (e) {
      console.error('get_course_options', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getCourseOptions();
  }, []);

  return (
    <div className={'flex gap-4'}>
      <Cascader
        className={'w-80'}
        allowClear={false}
        value={courseCode ? ['JAN 2023', courseCode] : undefined}
        loading={loading}
        placeholder="Select a Course"
        options={courseCodes}
        onChange={(v) => {
          setCourseCode && setCourseCode(v[1]);
        }}
      />
      <RangePicker />
    </div>
  );
};

export default SelectSUSSHeader;
