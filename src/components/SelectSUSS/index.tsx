import React, { useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';
import { get_active_topics } from '../../pages/Dashboard/api.ts';
import { useUserStore } from '../../stores/userStore';

interface CustomSelectProps extends SelectProps {
  handleSelect: (value: string) => void;
}

const SelectSUSS: React.FC<CustomSelectProps> = ({
  handleSelect,
  ...props
}) => {
  const [topics, setTopics] = useState([]);
  const courseCode = useUserStore((state) => state.courseCode);
  const fetchActiveTopics = async (courseCode: string) => {
    try {
      const { active_topics = [] } = await get_active_topics({
        option_course: courseCode
      });
      setTopics(active_topics.map((t: any) => ({ label: t, value: t })));
    } catch (err) {
      console.error('Failed to fetch active topics', err);
    }
  };

  useEffect(() => {
    if (courseCode) {
      void fetchActiveTopics(courseCode);
    }
  }, [courseCode]);

  return <Select options={topics} onChange={handleSelect} {...props} />;
};

export default SelectSUSS;
