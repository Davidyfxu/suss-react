import Overview from "./components/Overview";
import DashboardTabs from "./components/DashboardTabs";
import { Space } from "antd";

const Dashboard = () => {
  return (
    <Space className={"w-full"} direction="vertical">
      <Overview />
      <DashboardTabs />
    </Space>
  );
};

export default Dashboard;
