import type { StatisticProps } from 'antd';
import { Col, Row, Statistic, Typography, Button } from 'antd';
import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';
import { useUserStore } from '../../../../stores/userStore';
import { get_course_overview } from '../../api.ts';

const { Title } = Typography;

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);

const Overview = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="p-5 rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <Title level={4} className="m-0">
          Course Overview
        </Title>
        <Button onClick={toggleOpen}>{isOpen ? 'Collapse' : 'Expand'}</Button>
      </div>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
        className="transition-height"
      >
        <div className="mt-4">
          <Row gutter={[16, 16]}>
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
                loading={loading}
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
        </div>
      </div>
    </div>
  );
};

export default Overview;
