import Overview from './components/Overview';
import DashboardTabs from './components/DashboardTabs';
import { ConfigProvider } from 'antd';

const Dashboard = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            fontSize: 12, // 设置表格字体大小
            padding: 8, // 设置单元格内边距
            cellPaddingBlock: 4, // 设置单元格上下内边距
            cellPaddingInline: 8 // 设置单元格左右内边距
          }
        }
      }}
    >
      <div className="flex flex-col w-full bg-gray-100">
        <div id="discussion">
          <Overview />
        </div>
        <DashboardTabs />
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
