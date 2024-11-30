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
import { Empty, Typography } from 'antd';
import { isEmpty } from 'lodash-es';
const { Title } = Typography;
interface ChartDataItem {
  topic_title?: string;
  unique_entry_count?: number;
  entry_count?: number;
  week_range?: string;
  reply_count?: number;
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
  primary: '#1677ff', // A vibrant blue for participants
  secondary: '#52c41a', // A fresh green for posts
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

  const processData = (
    participantData: ChartDataItem[] = []
  ): ChartDataItem[] => {
    const topicMap = new Map<string, ChartDataItem>();

    // Process participant data
    participantData.forEach((item) => {
      const title = item.topic_title || '';
      const participantCount = item.unique_entry_count || 0;

      topicMap.set(title, {
        ...item,
        topic_title: title.length > 30 ? title.substring(0, 30) + '...' : title,
        unique_entry_count: participantCount
      });
    });

    // Process reply data and merge with participant data
    rawData['serializer_data_reply']?.forEach((item) => {
      const title = item.topic_title || '';
      const replyCount = item.unique_entry_count || 0;

      if (topicMap.has(title)) {
        const existingData = topicMap.get(title)!;
        topicMap.set(title, {
          ...existingData,
          reply_count: replyCount
        });
      } else {
        topicMap.set(title, {
          ...item,
          topic_title:
            title.length > 30 ? title.substring(0, 30) + '...' : title,
          reply_count: replyCount
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
    <div className="bg-white p-2 rounded-lg shadow-sm flex-1">
      <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">
        {title}
      </h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={isProcessData ? processData(data) : data}
            {...commonChartProps}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={isProcessData ? 'topic_title' : 'week_range'}
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

  return (
    <div className={'border rounded-lg p-4'}>
      <Title level={5} className="m-0">
        Canvas Discussion Charts
      </Title>
      {!isEmpty(rawData?.['serializer_data_participant']) ||
      !isEmpty(rawData?.['serializer_data_reply']) ||
      !isEmpty(rawData?.['reply_by_week']) ? (
        <div className="flex flex-wrap justify-between items-center">
          <div className="grid grid-cols-1 gap-6 flex-1">
            {(!isEmpty(rawData?.['serializer_data_participant']) ||
              !isEmpty(rawData?.['serializer_data_reply'])) && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">
                  Number of Participants and Posts by Topic
                </h3>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={processData(rawData['serializer_data_participant'])}
                      {...commonChartProps}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="topic_title"
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
                        dataKey="unique_entry_count"
                        fill={CHART_COLORS.primary}
                        radius={[4, 4, 0, 0]}
                        name="Number of Participants"
                        maxBarSize={40}
                      />
                      <Bar
                        dataKey="reply_count"
                        fill={CHART_COLORS.secondary}
                        radius={[4, 4, 0, 0]}
                        name="Number of Posts"
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
      )}
    </div>
  );
};

export default Visualization;
