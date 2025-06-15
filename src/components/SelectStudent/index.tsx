import React, { useCallback, useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { get_student_options } from '../../pages/Dashboard/api.ts';
import { debounce } from 'lodash-es';
interface CustomAutoCompleteProps extends Omit<AutoCompleteProps, 'onChange'> {
  handleSelect: (value: number) => void;
}

interface IOptions {
  label: string;
  value: number;
}

const SelectStudent: React.FC<CustomAutoCompleteProps> = ({
  handleSelect,
  ...props
}) => {
  const [students, setStudents] = useState<IOptions[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IOptions[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const courseCode = useUserStore((state) => state.courseCode);

  const fetchActiveStudents = async (courseCode: string) => {
    try {
      const { student_options = [] } = await get_student_options({
        option_course: courseCode
      });
      const studentOptions = student_options
        .map((t: any) => ({
          label: t?.user_name,
          value: t?.user_id
        }))
        .filter((r: any) => r?.label);
      setStudents(studentOptions);
      setFilteredStudents(studentOptions);
    } catch (err) {
      console.error('Failed to fetch active topics', err);
    }
  };
  useEffect(() => {
    if (courseCode) {
      handleSelect(null as any);
      setInputValue('');
      void fetchActiveStudents(courseCode);
    }
  }, [courseCode]);

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      setInputValue(searchText);
      if (!searchText) {
        setFilteredStudents(students);
        handleSelect(null as any);
      } else {
        const filtered = students.filter((student) => {
          return (student?.label || '')
            .toLowerCase()
            .includes(searchText.toLowerCase());
        });
        setFilteredStudents(filtered);
      }
    }, 200),
    [courseCode, students]
  );

  useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue, students]);

  const handleSelectOption = (value: string, option: any) => {
    setInputValue(option.label);
    handleSelect(option.value);
  };

  const handleChange = (value: string) => {
    setInputValue(value);
  };
  return (
    <AutoComplete
      value={inputValue}
      options={filteredStudents}
      onSelect={handleSelectOption}
      onChange={handleChange}
      showSearch
      filterOption={false}
      {...props}
    />
  );
};

export default SelectStudent;
