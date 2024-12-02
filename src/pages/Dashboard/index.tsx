import { Space } from 'antd';
import Overview from './components/Overview';
import DashboardTabs from './components/DashboardTabs';

const Dashboard = () => {
  return (
    <Space className="w-full p-4 bg-gray-100" direction="vertical" size={16}>
      <div id="overview">
        <Overview />
      </div>
      <DashboardTabs />
    </Space>
  );
};

export default Dashboard;
