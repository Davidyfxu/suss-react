import { Card, StatisticProps } from 'antd';
import { Col, Row, Statistic, Typography } from 'antd';
import { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';
import { useUserStore } from '../../../../stores/userStore';
import { get_course_overview } from '../../api.ts';

const { Title } = Typography;

// const formatter: StatisticProps['formatter'] = (value) => (
//   <CountUp end={value as number} separator="," />
// );

const Overview = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({});
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
  }, [courseCode, dateRange]);

  return (
    <div className="p-5 rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <Title level={4} className="m-0">
          Course Overview
        </Title>
      </div>
      <div
        ref={contentRef}
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
        className="transition-height"
      >
        <div>
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Card bordered>
                <Statistic
                  loading={loading}
                  title="Number of students"
                  value={overview?.number_of_student || 0}
                />
              </Card>
            </Col>
            <Col span={5}>
              <Card bordered>
                <Statistic
                  loading={loading}
                  title="Number of topics"
                  value={overview?.number_topics_posted || 0}
                />
              </Card>
            </Col>
            <Col span={5}>
              <Card bordered>
                <Statistic
                  loading={loading}
                  title="Number of replies"
                  value={overview?.number_entries_posted || 0}
                />
              </Card>
            </Col>
            <Col span={5}>
              <Card bordered>
                <Statistic
                  loading={loading}
                  title="Number of 'Reads'"
                  value={overview?.user_read_number || 0}
                />
              </Card>
            </Col>
            <Col span={5}>
              <Card bordered>
                <Statistic
                  loading={loading}
                  title="Number of 'Likes'"
                  value={overview?.user_like_number || 0}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Overview;
