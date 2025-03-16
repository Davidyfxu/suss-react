import Overview from '../Overview';
import DashboardTabs from '../DashboardTabs';
import { ConfigProvider } from 'antd';

export default function TeacherModule() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            fontSize: 12,
            padding: 8,
            cellPaddingBlock: 4,
            cellPaddingInline: 8
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
}