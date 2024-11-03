import { useEffect, useState } from 'react';
import { Space, Table, TablePaginationConfig } from 'antd';
import { get_discussion_participation } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true
};

const DiscussionData = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [topic, setTopic] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);

  const get_participation = async (
    paginationConfig: TablePaginationConfig = {}
  ) => {
    try {
      const { pageSize = 10, current = 1 } = paginationConfig;
      setLoading(true);
      const res = await get_discussion_participation({
        option_course: courseCode,
        option_topic: topic,
        page: current,
        limit: pageSize
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
      title: 'Posts',
      dataIndex: 'entry_id_posts',
      key: 'posts',
      sorter: (a: any, b: any) => a.entry_id_posts - b.entry_id_posts
    },
    {
      title: 'Replies received',
      dataIndex: 'entry_replies_received_count',
      key: 'replies',
      render: (replies: any) => replies?.length || 0,
      sorter: (a: any, b: any) =>
        (a.entry_replies_received_count?.length || 0) -
        (b.entry_replies_received_count?.length || 0)
    },
    {
      title: 'Users interacted with',
      dataIndex: 'interacted_users_count',
      key: 'interactions',
      render: (interactions: any) => interactions?.length || 0,
      sorter: (a: any, b: any) =>
        (a.interacted_users_count?.length || 0) -
        (b.interacted_users_count?.length || 0)
    },
    {
      title: 'Topics participated',
      dataIndex: 'entry_topic_count',
      key: 'topics',
      sorter: (a: any, b: any) => a.entry_topic_count - b.entry_topic_count
    },
    {
      title: 'Reads',
      dataIndex: 'entry_read_count',
      key: 'reads',
      sorter: (a: any, b: any) => a.entry_read_count - b.entry_read_count
    },
    {
      title: 'Likes',
      dataIndex: 'entry_likes_sum',
      key: 'likes',
      sorter: (a: any, b: any) => a.entry_likes_sum - b.entry_likes_sum
    }
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    get_participation(pagination);
  };
  useEffect(() => {
    topic && get_participation();
  }, [courseCode, topic]);

  return (
    <Space direction={'vertical'} className={'w-full'}>
      <SelectSUSS
        placeholder={'Please select a topic from the course.'}
        className={'w-full'}
        handleSelect={(v) => setTopic(v)}
      />
      <Table
        columns={columns}
        rowKey="user_id"
        dataSource={records}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Space>
  );
};

export default DiscussionData;
