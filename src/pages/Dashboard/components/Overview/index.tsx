import type { StatisticProps } from 'antd';
import { Col, Row, Statistic, Typography } from 'antd';
import CountUp from 'react-countup';
import { useUserStore } from '../../../../stores/userStore';
import { useEffect, useState } from 'react';
import { get_course_overview } from '../../api.ts';
const { Title } = Typography;
const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);
const Overview = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
  const getCourseOverview = async () => {
    try {
      setLoading(true);
      const res = await get_course_overview({ option_course: courseCode });
      setOverview(res || {});
    } catch (error) {
      console.error('getCourseOverview', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    courseCode && getCourseOverview();
  }, [courseCode]);

  return (
    <>
      <Title level={2}>Course Overview</Title>
      <Row>
        <Col span={4}>
          <Statistic
            loading={loading}
            title="Number of students"
            value={overview?.number_of_student || 0}
            formatter={formatter}
          />
        </Col>
        <Col span={5}>
          <Statistic
            loading={loading}
            title="Number of topics"
            value={overview?.number_topics_posted || 0}
            formatter={formatter}
          />
        </Col>
        <Col span={5}>
          <Statistic
            loading={loading}
            title="Number of replies"
            value={overview?.number_entries_posted || 0}
            formatter={formatter}
          />
        </Col>
        <Col span={5}>
          <Statistic
            title="Number of 'Reads'"
            value={overview?.user_read_number || 0}
            formatter={formatter}
          />
        </Col>
        <Col span={5}>
          <Statistic
            loading={loading}
            title="Number of 'Likes'"
            value={overview?.user_like_number || 0}
            formatter={formatter}
          />
        </Col>
      </Row>
    </>
  );
};

export default Overview;
