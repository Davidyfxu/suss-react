import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush
} from 'recharts';
import { draw_participants_posts } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';

interface ChartDataItem {
  topic_title?: string;
  unique_entry_count?: number;
  entry_count?: number;
  week_range?: string;
}

interface RawData {
  serializer_data_participant: ChartDataItem[];
  serializer_data_reply: ChartDataItem[];
  reply_by_week: ChartDataItem[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CHART_COLORS = {
  primary: '#4096ff',
  secondary: '#4096ff',
  tertiary: '#4096ff'
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
        <p className="text-gray-600 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Visualization = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState<boolean>(false);
  const [rawData, setData] = useState<RawData>({
    serializer_data_participant: [],
    serializer_data_reply: [],
    reply_by_week: []
  });

  const getParticipants = async () => {
    try {
      setLoading(true);
      const res = await draw_participants_posts({ option_course: courseCode });
      setData(res);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getParticipants();
  }, [courseCode]);

  const processData = (data: ChartDataItem[] = []): ChartDataItem[] => {
    // 创建一个Map来存储每个topic的最高值
    const topicMap = new Map<string, ChartDataItem>();

    data.forEach((item) => {
      const title = item.topic_title || '';
      const currentCount = item.unique_entry_count || item.entry_count || 0;

      if (
        !topicMap.has(title) ||
        currentCount >
          (topicMap.get(title)?.unique_entry_count ||
            topicMap.get(title)?.entry_count ||
            0)
      ) {
        topicMap.set(title, {
          ...item,
          topic_title:
            title.length > 30 ? title.substring(0, 30) + '...' : title
        });
      }
    });

    return Array.from(topicMap.values());
  };

  const commonChartProps = {
    width: '100%',
    height: 400,
    margin: { top: 20, right: 30, left: 40, bottom: 100 }
  };

  const renderChart = (
    data: ChartDataItem[],
    dataKey: 'unique_entry_count' | 'entry_count',
    title: string,
    color: string = CHART_COLORS.primary,
    isProcessData: boolean = true
  ) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">{title}</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={isProcessData ? processData(data) : data}
            {...commonChartProps}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={isProcessData ? "topic_title" : "week_range"}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
              name={title}
            />
            {!isProcessData && (
              <Brush
                dataKey="week_range"
                height={30}
                stroke={color}
                fill="#ffffff"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return !isEmpty(rawData?.['serializer_data_participant']) ||
    !isEmpty(rawData?.['serializer_data_reply']) ||
    !isEmpty(rawData?.['reply_by_week']) ? (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isEmpty(rawData?.['serializer_data_participant']) &&
          renderChart(
            rawData['serializer_data_participant'],
            'unique_entry_count',
            'Number of Participants by Topic',
            CHART_COLORS.primary
          )}
        {!isEmpty(rawData?.['serializer_data_reply']) &&
          renderChart(
            rawData['serializer_data_reply'],
            'unique_entry_count',
            'Number of Posts by Topic',
            CHART_COLORS.secondary
          )}
      </div>
      {!isEmpty(rawData?.['reply_by_week']) &&
        renderChart(
          rawData['reply_by_week'],
          'entry_count',
          'Number of Posts by Week',
          CHART_COLORS.tertiary,
          false
        )}
    </div>
  ) : (
    <Empty className="mt-10" />
  );
};

export default Visualization;
