import { Bar, Column, BarConfig, ColumnConfig } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { draw_participants_posts } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';

const useChartResize = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const Visualization = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [rawData, setData] = useState({
    serializer_data_participant: [],
    serializer_data_reply: [],
    reply_by_week: []
  });
  const width = useChartResize();

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
  // 处理过长的标题
  const processData = (data = []) => {
    return data.map((item) => ({
      ...item,
      topic_title:
        item?.topic_title?.length > 30
          ? item?.topic_title?.substring?.(0, 30) + '...'
          : item?.topic_title
    }));
  };

  const commonConfig = {
    loading,
    scale: {
      x: { padding: 0.5 }
    },
    style: {
      maxWidth: 100
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
        autoEllipsis: true,
        maxLength: 30 // 限制标签长度
      }
    },
    width: width > 768 ? width * 0.8 : width * 0.95
  };

  const config_part: BarConfig = {
    ...commonConfig,
    data: processData(rawData['serializer_data_participant']) || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of participants by topic'
  };

  const config_reply: BarConfig = {
    ...commonConfig,
    data: processData(rawData['serializer_data_reply']) || [],
    xField: 'topic_title',
    yField: 'unique_entry_count',
    title: 'Number of posts by topic'
  };

  const config_post_by_week: ColumnConfig = {
    ...commonConfig,
    data: processData(rawData['reply_by_week']) || [],
    xField: 'week_range',
    yField: 'entry_count',
    title: 'Number of posts by week'
  };

  return !isEmpty(rawData?.['serializer_data_participant']) ||
    !isEmpty(rawData?.['serializer_data_reply']) ||
    !isEmpty(rawData?.['reply_by_week']) ? (
    <div className={'overflow-x-auto w-full'}>
      {!isEmpty(rawData?.['serializer_data_participant']) && (
        <div className={'mb-5 w-full min-w-[300px]'}>
          <Bar {...config_part} />
        </div>
      )}
      {!isEmpty(rawData?.['serializer_data_reply']) && (
        <div className={'mb-5 w-full min-w-[300px]'}>
          <Bar {...config_reply} />
        </div>
      )}
      {!isEmpty(rawData?.['reply_by_week']) && (
        <div className={'mb-5 w-full min-w-[300px]'}>
          <Column {...config_post_by_week} />
        </div>
      )}
    </div>
  ) : (
    <Empty className={'mt-10'} />
  );
};

export default Visualization;
