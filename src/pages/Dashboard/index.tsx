import Overview from './components/Overview';
import DashboardTabs from './components/DashboardTabs';

const Dashboard = () => {
  return (
    <div className="flex flex-col w-full p-2 bg-gray-100 gap-2">
      <div id="overview">
        <Overview />
      </div>
      <DashboardTabs />
    </div>
  );
};

export default Dashboard;
