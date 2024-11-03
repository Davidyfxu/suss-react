import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { get_course_options } from './api.ts';
import { useUserStore } from '../../stores/userStore';

const SelectSUSSHeader = () => {
  const [courseCodes, setCourseCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCourseCode = useUserStore((state) => state.setCourseCode);
  const courseCode = useUserStore((state) => state.courseCode);

  const getCourseOptions = async () => {
    try {
      setLoading(true);
      const { course_codes = [] } = await get_course_options();
      setCourseCodes(
        course_codes.map((value: string) => ({ value: value, label: value }))
      );
      course_codes[0] && setCourseCode && setCourseCode(course_codes?.[0]);
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
    <div>
      <Select
        className={'w-48'}
        allowClear
        value={courseCode}
        loading={loading}
        placeholder="Select a Course"
        options={courseCodes}
        onChange={(v) => setCourseCode && setCourseCode(v)}
      />
    </div>
  );
};

export default SelectSUSSHeader;
