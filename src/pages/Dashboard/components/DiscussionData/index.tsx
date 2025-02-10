import { useEffect, useState } from 'react';
import { Alert, Space, Table, Typography } from 'antd';
import { get_discussion_participation } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';
const { Title } = Typography;

const DiscussionData = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [topic, setTopic] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const get_participation = async () => {
    try {
      setLoading(true);
      const res = await get_discussion_participation({
        option_course: courseCode,
        option_topic: topic,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      });
      setRecords(res?.discussions || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'user_name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '# posts',
      dataIndex: 'entry_id_posts',
      key: 'posts',
      sorter: (a: any, b: any) => a.entry_id_posts - b.entry_id_posts
    },
    {
      title: '# replies received',
      width: 150,
      dataIndex: 'replies_received_count',
      key: 'replies',
      render: (replies: any) => replies,
      sorter: (a: any, b: any) =>
        a.replies_received_count - b.replies_received_count
    },
    {
      title: '# users interacted with',
      dataIndex: 'interacted_users_count',
      width: 180,
      key: 'interactions',
      render: (interactions: any) => interactions,
      sorter: (a: any, b: any) =>
        a.interacted_users_count - b.interacted_users_count
    },
    {
      title: '# topics participated',
      width: 180,
      dataIndex: 'entry_topic_count',
      key: 'topics',
      sorter: (a: any, b: any) => a.entry_topic_count - b.entry_topic_count
    },
    {
      title: '# reads',
      dataIndex: 'entry_read_count',
      key: 'reads',
      sorter: (a: any, b: any) => a.entry_read_count - b.entry_read_count
    },
    {
      title: '# likes',
      dataIndex: 'entry_likes_sum',
      key: 'likes',
      sorter: (a: any, b: any) => a.entry_likes_sum - b.entry_likes_sum
    }
  ];

  useEffect(() => {
    courseCode && get_participation();
  }, [courseCode, topic, dateRange]);

  useEffect(() => {
    setTopic(undefined);
  }, [courseCode]);

  return (
    <div
      className={'flex-1 min-w-0 border rounded-lg p-4 h-full'}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <SelectSUSS
        allowClear
        placeholder={'Please select a topic from the course.'}
        className={'w-full'}
        handleSelect={(v) => setTopic(v)}
      />
      <Alert
        message="Click the table header to sort the column (ascending/descending)."
        type="info"
        showIcon
      />
      <Table
        scroll={{ x: 900, y: 'calc(100vh - 320px)' }}
        columns={columns}
        rowKey="user_id"
        dataSource={records}
        loading={loading}
        pagination={{ pageSize: 500 }}
      />
    </div>
  );
};

export default DiscussionData;
