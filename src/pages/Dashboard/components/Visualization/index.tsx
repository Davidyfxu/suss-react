import { Bar, Column, BarConfig, ColumnConfig } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { draw_participants_posts } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { Typography } from 'antd';

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
  const config_part: BarConfig = {
    data: rawData['serializer_data_participant'] || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of participants by topic',
    loading,
    scale: {
      x: { padding: 0.5 }
    },

    style: {
      maxWidth: 100
    }
  };
  const config_reply: BarConfig = {
    data: rawData['serializer_data_reply'] || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of posts by topic',
    loading,
    scale: {
      x: { padding: 0.5 }
    },
    style: {
      maxWidth: 100
    }
  };
  const config_post_by_week: ColumnConfig = {
    data: rawData['reply_by_week'] || [],
    xField: 'week_range',
    yField: 'entry_count',
    title: 'Number of posts by week',
    loading,
    scale: {
      x: { padding: 0.5 }
    },
    forceFit: true,

    style: {
      maxWidth: 100
    },
    interactions: [
      {
        type: 'slider'
        // cfg: {
        //   start: 0.4,
        //   end: 0.45
        // }
      }
    ]
  };

  return (
    <div className={'overflow-auto flex flex-col gap-4'}>
      <div style={{ display: 'flex', flex: 1, gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '300px', maxWidth: '50%' }}>
          <Bar {...config_part} />
        </div>
        <div style={{ flex: 1, minWidth: '300px', maxWidth: '50%' }}>
          <Bar {...config_reply} />
        </div>
      </div>
      <div style={{ flex: 2, minWidth: '300px', maxWidth: '100%' }}>
        <Column {...config_post_by_week} />
      </div>
    </div>
  );
};

export default Visualization;
