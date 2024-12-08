import React from 'react';
import { Select, SelectProps } from 'antd';
import useSWR from 'swr';
import { get_active_topics } from '../../pages/Dashboard/api.ts';
import { useUserStore } from '../../stores/userStore';

interface CustomSelectProps extends SelectProps {
  handleSelect: (value: string) => void;
}

const SelectSUSS: React.FC<CustomSelectProps> = ({
  handleSelect,
  ...props
}) => {
  const courseCode = useUserStore((state) => state.courseCode);

  // 使用 useSWR 获取数据
  const { data: activeTopics, error } = useSWR(
    courseCode ? ['activeTopics', courseCode] : null,
    async (req) => {
      const [_, option_course] = req;
      const { active_topics = [] } = await get_active_topics({
        option_course
      });
      return active_topics.map((t: any) => ({ label: t, value: t }));
    }
  );

  if (error) {
    console.error('Failed to fetch active topics', error);
    return <Select {...props} disabled placeholder="Failed to load topics" />;
  }

  return (
    <Select
      options={activeTopics || []}
      onChange={handleSelect}
      {...props}
      loading={!activeTopics}
    />
  );
};

export default SelectSUSS;
