import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { get_student_options } from '../../pages/Dashboard/api.ts';

interface CustomSelectProps extends SelectProps {
  handleSelect: (value: number) => void;
}

const SelectStudent: React.FC<CustomSelectProps> = ({
  handleSelect,
  ...props
}) => {
  const [students, setStudents] = useState([]);
  const courseCode = useUserStore((state) => state.courseCode);
  const fetchActiveStudents = async (courseCode: string) => {
    try {
      const { student_options = [] } = await get_student_options({
        option_course: courseCode
      });
      setStudents(
        student_options.map((t: any) => ({
          label: t?.user_name,
          value: t?.user_id
        }))
      );
    } catch (err) {
      console.error('Failed to fetch active topics', err);
    }
  };

  useEffect(() => {
    if (courseCode) {
      void fetchActiveStudents(courseCode);
    }
  }, [courseCode]);

  return <Select options={students} onChange={handleSelect} {...props} />;
};

export default SelectStudent;
