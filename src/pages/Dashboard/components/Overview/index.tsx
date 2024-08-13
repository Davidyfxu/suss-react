import type { StatisticProps } from 'antd';
import { Col, Row, Statistic, Typography } from 'antd';
import CountUp from 'react-countup';
const { Title } = Typography;
const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
);
const Overview = () => {
  return (
    <>
      <Title level={2}>Course Overview</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="Number of students"
            value={112893}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Number of topics"
            value={112893}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Number of replies"
            value={112893}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Number of 'Reads'"
            value={112893}
            precision={2}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Number of 'Likes'"
            value={112893}
            precision={2}
            formatter={formatter}
          />
        </Col>
      </Row>
    </>
  );
};

export default Overview;
