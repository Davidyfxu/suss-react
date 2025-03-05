import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { draw_participants_posts } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import { SelectSUSS } from '../../../../components';
import SelectStudent from '../../../../components/SelectStudent';
const truncateTitle = (title: string, maxLength: number = 25): string => {
  return title.length > maxLength
    ? title.substring(0, maxLength) + '...'
    : title;
};
const FONT_SIZE = 10;
// 添加日期格式化函数
const formatDateRange = (dateRange: string): string => {
  if (!dateRange || !dateRange.includes(' - ')) return dateRange;

  const dates = dateRange.split(' - ').map((d) => d.trim());
  const transform = (date: string) => {
    const [year = '', month = '', day = ''] = date.split('-');
    return `${day}/${month}/${year.slice(2)}`;
  };

  // 返回格式化后的日期范围
  return `${transform(dates[0])}-${transform(dates[1])}`;
};

interface ChartDataItem {
  topic_title?: string;
  unique_entry_count?: number;
  entry_count?: number;
  week_range?: string;
  reply_count?: number;
  username?: string;
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
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<number | null>();
  const [rawData, setData] = useState<RawData>({
    serializer_data_participant: [],
    serializer_data_reply: [],
    reply_by_week: []
  });

  const getParticipants = async () => {
    try {
      setLoading(true);
      const res = await draw_participants_posts({
        option_course: courseCode,
        topic_title: topic,
        user_id: selectedUser,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      });
      setData(res);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getParticipants();
  }, [courseCode, topic, selectedUser, dateRange]);

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
        topic_title: title,
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
    margin: { top: 10, right: 16, left: 16, bottom: 10 }
  };

  const commonLegendProps = {
    align: 'right' as const,
    verticalAlign: 'top' as const,
    iconType: 'circle' as const
  };

  return (
    <div className="h-full border rounded-lg p-2 min-h-[450px] flex flex-col overflow-hidden">
      {!isEmpty(rawData?.['serializer_data_participant']) ||
      !isEmpty(rawData?.['serializer_data_reply']) ||
      !isEmpty(rawData?.['reply_by_week']) ? (
        <div className="w-full flex flex-col gap-2 h-full overflow-auto">
          {(!isEmpty(rawData?.['serializer_data_participant']) ||
            !isEmpty(rawData?.['serializer_data_reply'])) && (
            <div className="w-full p-1 rounded-lg shadow-sm flex-1">
              <div className="text-lg font-medium text-gray-800 text-center">
                Number of Posts by Topic
              </div>
              <div className="h-[calc(100%-40px)]">
                <ResponsiveContainer width="100%" height="100%">
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
                      height={50}
                      tick={{ fontSize: FONT_SIZE }}
                      tickFormatter={(value) => truncateTitle(value, 10)}
                    />
                    <YAxis tick={{ fontSize: FONT_SIZE }} />
                    <Tooltip content={<CustomTooltip />} />
                    {/*<Legend {...commonLegendProps} />*/}
                    <Bar
                      dataKey="reply_count"
                      fill={CHART_COLORS.tertiary}
                      radius={[4, 4, 0, 0]}
                      name="Number of Posts"
                      maxBarSize={40}
                    >
                      <LabelList
                        style={{ fill: '#FFF' }}
                        dataKey={'reply_count'}
                        position="insideBottom"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className={'w-full flex flex-col gap-2 flex-shrink-0'}>
            <span>Please select the topic title here.</span>
            <SelectSUSS
              placeholder="Select topic title"
              allowClear
              className={'w-full flex-1'}
              handleSelect={(value) => setTopic(value)}
            />
            <span>Please select the username here.</span>
            <SelectStudent
              placeholder="Select topic title"
              allowClear
              className={'w-full flex-1'}
              handleSelect={(value) => setSelectedUser(value)}
            />
          </div>
          {!isEmpty(rawData?.['reply_by_week']) && (
            <div className="w-full p-1 rounded-lg shadow-sm flex-1">
              <h3 className="text-lg font-medium text-gray-800 text-center">
                Number of Posts by Week
              </h3>
              <div className="h-[calc(100%-40px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rawData['reply_by_week']}
                    {...commonChartProps}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey={'week_range'}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={68}
                      tick={{ fontSize: FONT_SIZE }}
                      tickFormatter={(value) => formatDateRange(value)}
                    />
                    <YAxis tick={{ fontSize: FONT_SIZE }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey={'entry_count'}
                      fill={CHART_COLORS.tertiary}
                      radius={[4, 4, 0, 0]}
                      name={'Number of Posts by Week'}
                      maxBarSize={40}
                    >
                      <LabelList
                        style={{ fill: '#FFF' }}
                        dataKey={'entry_count'}
                        position="insideBottom"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Empty className="mt-32" />
      )}
    </div>
  );
};

export default Visualization;
