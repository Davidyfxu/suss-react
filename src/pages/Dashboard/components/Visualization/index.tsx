import { Bar, Column } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { draw_participants_posts } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';

const Visualization = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [rawData, setData] = useState({});

  const getParticipants = async () => {
    try {
      setLoading(true);
      const res = await draw_participants_posts({ option_course: courseCode });
      setData(res);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getParticipants();
  }, [courseCode]);

  const config_part = {
    data: rawData['serializer_data_participant'] || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of participants by topic',
    loading
  };
  const config_reply = {
    data: rawData['serializer_data_reply'] || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of posts by topic',
    loading
  };
  const config_post_by_week = {
    data: rawData['reply_by_week'] || [],
    xField: 'week_range',
    yField: 'entry_count',
    title: 'Number of posts by week',
    loading
  };
  return (
    <div className={'overflow-auto'}>
      <div className={'flex'}>
        <Bar {...config_part} />
        <Bar {...config_reply} />
      </div>
      <Column {...config_post_by_week} />
    </div>
  );
};

export default Visualization;
