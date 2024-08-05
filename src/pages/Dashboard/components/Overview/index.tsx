import type { StatisticProps } from "antd";
import { Col, Row, Statistic } from "antd";
import CountUp from "react-countup";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);
const Overview = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Statistic title="Active Users" value={112893} formatter={formatter} />
      </Col>
      <Col span={6}>
        <Statistic title="Active Users" value={112893} formatter={formatter} />
      </Col>
      <Col span={6}>
        <Statistic title="Active Users" value={112893} formatter={formatter} />
      </Col>
      <Col span={6}>
        <Statistic
          title="Account Balance (CNY)"
          value={112893}
          precision={2}
          formatter={formatter}
        />
      </Col>
    </Row>
  );
};

export default Overview;
