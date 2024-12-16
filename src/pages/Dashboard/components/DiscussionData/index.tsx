import { useEffect, useState } from 'react';
import { Alert, Space, Table, TablePaginationConfig, Typography } from 'antd';
import { get_discussion_participation } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';
const { Title } = Typography;
const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 100,
  total: 0,
  pageSizeOptions: ['500'],
  showSizeChanger: false,
  showQuickJumper: false
};

const DiscussionData = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [topic, setTopic] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);

  const get_participation = async (
    paginationConfig: TablePaginationConfig = {}
  ) => {
    try {
      const { pageSize = 500, current = 1 } = paginationConfig;
      setLoading(true);
      const res = await get_discussion_participation({
        option_course: courseCode,
        option_topic: topic,
        page: current,
        limit: pageSize,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      });
      setRecords(res?.discussions || []);
      setPagination({
        ...pagination,
        current: res?.pagination.page || 1,
        pageSize: pageSize,
        total: res?.pagination.total || 0
      });
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
      dataIndex: 'replies_received_count',
      key: 'replies',
      render: (replies: any) => replies,
      sorter: (a: any, b: any) =>
        a.replies_received_count - b.replies_received_count
    },
    {
      title: '# users interacted with',
      width: 220,
      dataIndex: 'interacted_users_count',
      key: 'interactions',
      render: (interactions: any) => interactions,
      sorter: (a: any, b: any) =>
        a.interacted_users_count - b.interacted_users_count
    },
    {
      title: '# topics participated',
      width: 220,
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
    <Space direction={'vertical'} className={'w-full border rounded-lg p-4'}>
      <Title level={5} className="m-0">
        Canvas Discussion Participation
      </Title>
      <SelectSUSS
        allowClear
        placeholder={'Please select a topic from the course.'}
        className={'w-full'}
        handleSelect={(v) => setTopic(v)}
      />
      <Alert
        message="Keep clicking the table header to sort the coloumn in ascending or descending order as you need."
        type="info"
        showIcon
      />
      <Table
        scroll={{ x: '100%', y: 500 }}
        columns={columns}
        rowKey="user_id"
        dataSource={records}
        loading={loading}
        pagination={pagination}
        // onChange={handleTableChange}
      />
    </Space>
  );
};

export default DiscussionData;
