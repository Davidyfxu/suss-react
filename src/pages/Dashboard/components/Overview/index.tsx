import { Card } from 'antd';
import { Statistic } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../../../../stores/userStore';
import { get_course_overview } from '../../api.ts';
import {
  UserOutlined,
  MessageOutlined,
  CommentOutlined,
  EyeOutlined,
  LikeOutlined
} from '@ant-design/icons';

const CARD_COLORS = {
  students: '#e8f4ff',
  topics: '#e6fffb',
  replies: '#f6ffed',
  reads: '#fff7e6',
  likes: '#e6e6fa',
  likesNew: '#ffd6e7' // 新增的颜色
};

// 添加卡片样式
const cardStyle = {
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
};

interface Overview {
  number_of_student?: number;
  number_topics_posted?: number;
  number_entries_posted?: number;
  user_read_number?: number;
  user_like_number?: number;
}

const Overview = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<Overview>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const getCourseOverview = async () => {
    try {
      setLoading(true);
      const params = {
        option_course: courseCode,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      };
      const res = await get_course_overview(params);
      setOverview(res || {});
    } catch (error) {
      console.error('getCourseOverview', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getCourseOverview();
  }, [courseCode, dateRange?.[0], dateRange?.[1]]);

  return (
    <div className="py-1 px-5 bg-white">
      <div
        ref={contentRef}
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
        className="transition-height"
      >
        <div className={'flex gap-2 flex-wrap'}>
          <Card
            style={{
              backgroundColor: CARD_COLORS.students,
              ...cardStyle
            }}
            styles={{ body: { padding: '8px 24px' } }}
            className="hover:shadow-lg"
          >
            <Statistic
              loading={loading}
              title={
                <span style={{ fontSize: '16px' }}>Number of students</span>
              }
              value={overview?.number_of_student || 0}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1890ff'
              }}
              prefix={<UserOutlined style={{ fontSize: '20px' }} />}
            />
          </Card>

          <Card
            styles={{ body: { padding: '8px 24px' } }}
            style={{
              backgroundColor: CARD_COLORS.topics,
              ...cardStyle
            }}
            className="hover:shadow-lg"
          >
            <Statistic
              loading={loading}
              title={<span style={{ fontSize: '16px' }}>Number of topics</span>}
              value={overview?.number_topics_posted || 0}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#13c2c2'
              }}
              prefix={<MessageOutlined style={{ fontSize: '20px' }} />}
            />
          </Card>

          <Card
            styles={{ body: { padding: '8px 24px' } }}
            style={{
              backgroundColor: CARD_COLORS.replies,
              ...cardStyle
            }}
            className="hover:shadow-lg"
          >
            <Statistic
              loading={loading}
              title={<span style={{ fontSize: '16px' }}>Number of posts</span>}
              value={overview?.number_entries_posted || 0}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#52c41a'
              }}
              prefix={<CommentOutlined style={{ fontSize: '20px' }} />}
            />
          </Card>

          <Card
            styles={{ body: { padding: '8px 24px' } }}
            style={{
              backgroundColor: CARD_COLORS.reads,
              ...cardStyle
            }}
            className="hover:shadow-lg"
          >
            <Statistic
              loading={loading}
              title={
                <span style={{ fontSize: '16px' }}>Number of 'Reads'</span>
              }
              value={overview?.user_read_number || 0}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#fa8c16'
              }}
              prefix={<EyeOutlined style={{ fontSize: '20px' }} />}
            />
          </Card>

          <Card
            styles={{ body: { padding: '8px 24px' } }}
            style={{
              backgroundColor: CARD_COLORS.likes,
              ...cardStyle
            }}
            className="hover:shadow-lg"
          >
            <Statistic
              loading={loading}
              title={
                <span style={{ fontSize: '16px' }}>Number of 'Likes'</span>
              }
              value={overview?.user_like_number || 0}
              valueStyle={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#8a2be2'
              }}
              prefix={<LikeOutlined style={{ fontSize: '20px' }} />}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
