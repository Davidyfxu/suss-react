import Overview from '../Overview';
import DashboardTabs from '../DashboardTabs';

const StudentModule = () => {
  return (
    <div className="flex flex-col w-full bg-gray-100">
      <div id="discussion">
        <Overview />
      </div>
      <DashboardTabs />
    </div>
  );
};

export default StudentModule;
