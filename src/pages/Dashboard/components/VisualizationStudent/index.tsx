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
import { Empty, Spin } from 'antd';
import { isEmpty } from 'lodash-es';
import { SelectSUSS } from '../../../../components';
import SelectStudent from '../../../../components/SelectStudent';
import clsx from 'clsx';

// Constants
const FONT_SIZE = 10;
const CHART_COLORS = {
  primary: '#1677ff',
  secondary: '#52c41a',
  tertiary: '#4096ff'
};

// Types
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

// Utility functions
const truncateTitle = (title: string, maxLength: number = 25): string => {
  return title.length > maxLength
    ? title.substring(0, maxLength) + '...'
    : title;
};

const formatDateRange = (dateRange: string): string => {
  if (!dateRange || !dateRange.includes(' - ')) return dateRange;
  const dates = dateRange.split(' - ').map((d) => d.trim());
  const transform = (date: string) => {
    const [year = '', month = '', day = ''] = date.split('-');
    return `${day}/${month}/${year.slice(2)}`;
  };
  return `${transform(dates[0])}-${transform(dates[1])}`;
};

// Components
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload, label }) => {
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

const ChartContainer: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  isLeftChart?: boolean;
  loading?: boolean;
}> = ({ title, children, className, isLeftChart, loading }) => (
  <div
    className={clsx(
      'w-full p-4 rounded-lg shadow-sm bg-white relative',
      className
    )}
  >
    <h3 className="text-lg font-medium text-gray-800 text-center mb-4">
      {title}
    </h3>
    <Spin spinning={loading} wrapperClassName="h-full">
      <div
        className={clsx(
          isLeftChart ? 'h-[calc(11rem+132px)]' : 'h-44',
          'max-h-[500px]'
        )}
      >
        {children}
      </div>
    </Spin>
  </div>
);

const SelectorGroup: React.FC<{
  onTopicChange: (value?: string) => void;
  onUserChange: (value?: number) => void;
  topic?: string;
  selectedUser?: number;
}> = ({ onTopicChange, onUserChange, topic }) => {
  const courseCode = useUserStore((state) => state.courseCode);
  useEffect(() => {
    onTopicChange(undefined);
    onUserChange(undefined);
  }, [courseCode]);
  return (
    <div className="w-full flex flex-col gap-2">
      <span>Select topic title</span>
      <SelectSUSS
        placeholder="Select topic title"
        allowClear
        className="w-full"
        handleSelect={onTopicChange}
        value={topic}
      />
      <span>Select username</span>
      <SelectStudent
        placeholder="Select username"
        allowClear
        className="w-full"
        handleSelect={onUserChange}
        // value={selectedUser}
      />
    </div>
  );
};

const VisualizationStudent = ({ className }: { className?: string }) => {
  const courseCode = useUserStore((state) => state.courseCode);
  const version = useUserStore((state) => state.version);
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>();
  const [selectedUser, setSelectedUser] = useState<number>();
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
      setData(
        res || {
          serializer_data_participant: [],
          serializer_data_reply: [],
          reply_by_week: []
        }
      );
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setData({
        serializer_data_participant: [],
        serializer_data_reply: [],
        reply_by_week: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseCode) {
      getParticipants();
    }
  }, [
    courseCode,
    topic,
    selectedUser,
    dateRange?.[0],
    dateRange?.[1],
    version
  ]);

  const processData = (
    participantData: ChartDataItem[] = []
  ): ChartDataItem[] => {
    const topicMap = new Map<string, ChartDataItem>();

    participantData.forEach((item) => {
      const title = item.topic_title || '';
      const participantCount = item.unique_entry_count || 0;
      topicMap.set(title, {
        ...item,
        topic_title: title,
        unique_entry_count: participantCount
      });
    });

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
          topic_title: truncateTitle(title, 30),
          reply_count: replyCount
        });
      }
    });

    return Array.from(topicMap.values());
  };

  const renderChart = (
    data: ChartDataItem[],
    dataKey: string,
    title: string,
    xAxisDataKey: string,
    isLeftChart?: boolean,
    loading?: boolean,
    tickFormatter?: (value: string) => string
  ) => (
    <ChartContainer title={title} isLeftChart={isLeftChart} loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: 16, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={xAxisDataKey}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={50}
            tick={{ fontSize: FONT_SIZE }}
            tickFormatter={tickFormatter}
          />
          <YAxis tick={{ fontSize: FONT_SIZE }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={dataKey}
            fill={CHART_COLORS.tertiary}
            radius={[4, 4, 0, 0]}
            name={title}
            maxBarSize={40}
          >
            <LabelList
              style={{ fill: '#FFF' }}
              dataKey={dataKey}
              position="insideBottom"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  const hasData =
    !isEmpty(rawData?.['serializer_data_participant']) ||
    !isEmpty(rawData?.['serializer_data_reply']) ||
    !isEmpty(rawData?.['reply_by_week']);

  return (
    <div
      className={clsx(
        'h-full border rounded-lg pt-2 px-4 min-h-[450px] overflow-hidden',
        className
      )}
    >
      {hasData ? (
        <div className="w-full h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            {(!isEmpty(rawData?.['serializer_data_participant']) ||
              !isEmpty(rawData?.['serializer_data_reply'])) &&
              renderChart(
                processData(rawData['serializer_data_participant']),
                'reply_count',
                'Number of Posts by Topic',
                'topic_title',
                true,
                loading,
                (value) => truncateTitle(value, 10)
              )}
            {!isEmpty(rawData?.['reply_by_week']) && (
              <div className="flex flex-col h-full">
                <SelectorGroup
                  onTopicChange={setTopic}
                  onUserChange={setSelectedUser}
                  topic={topic}
                  selectedUser={selectedUser}
                />
                <div className="flex-1">
                  {renderChart(
                    rawData['reply_by_week'],
                    'entry_count',
                    'Number of Posts by Week',
                    'week_range',
                    false,
                    loading,
                    formatDateRange
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Empty className="mt-32" />
      )}
    </div>
  );
};

export default VisualizationStudent;
