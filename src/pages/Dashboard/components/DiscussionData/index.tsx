import { useEffect, useState } from 'react';
import { Select, Space, Table } from 'antd';
import { get_discussion_participation, get_active_topics } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';

const DiscussionData = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  // get_active_topics
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const get_participation = async () => {
    try {
      setLoading(true);
      const { discussions = [] } = await get_discussion_participation({
        option_course: courseCode,
        option_topic: topic
      });
      setRecords(discussions);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user_name',
      key: 'Name'
    },
    {
      title: 'Posts',
      dataIndex: 'entry_id_posts',
      key: 'Posts'
    },
    {
      title: 'Replies received',
      dataIndex: 'entry_replies_received_count',
      key: 'Replies received',
      render: (records: any) => (
        <>{records?.['entry_replies_received_count']?.length || 0}</>
      )
    },
    {
      title: 'Users interacted with',
      dataIndex: 'interacted_users_count',
      key: 'Users interacted with',
      render: (records: any) => (
        <>{records?.['interacted_users_count']?.length || 0}</>
      )
    },
    {
      title: 'Topics participated',
      dataIndex: 'entry_topic_count',
      key: 'Topics participated'
    },
    {
      title: 'Reads',
      dataIndex: 'entry_likes_sum',
      key: 'Reads'
    },
    {
      title: 'Likes',
      dataIndex: 'entry_likes_sum',
      key: 'Likes'
    }
  ];

  const getActiveTopics = async () => {
    try {
      const { active_topics = [] } = await get_active_topics({
        option_course: courseCode
      });
      setTopics(active_topics.map((t: any) => ({ label: t, value: t })));
    } catch (err) {}
  };

  useEffect(() => {
    topic && get_participation();
  }, [courseCode, topic]);
  useEffect(() => {
    courseCode && getActiveTopics();
  }, [courseCode]);

  return (
    <Space direction={'vertical'} className={'w-full'}>
      <Select
        placeholder={'Please select a topic from the course.'}
        className={'w-full'}
        onChange={(v) => setTopic(v)}
        options={topics}
      />
      <Table columns={columns} dataSource={records} loading={loading}></Table>
    </Space>
  );
};

export default DiscussionData;
