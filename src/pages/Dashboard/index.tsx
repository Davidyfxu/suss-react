import { Anchor, Space, Typography } from 'antd';
import Overview from './components/Overview';
import DashboardTabs from './components/DashboardTabs';
import styles from './styles.module.css';

const { Title } = Typography;

const Dashboard = () => {
  const items = [
    {
      key: 'overview',
      href: '#overview',
      title: 'Overview'
    },
    {
      key: 'discussion',
      href: '#discussion',
      title: 'Discussion Distribution'
    },
    {
      key: 'social',
      href: '#social',
      title: 'Social Interaction'
    },
    {
      key: 'assignment',
      href: '#assignment',
      title: 'Assignment Progress'
    }
  ];

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-content']}>
        <div className={styles['page-header']}>
          <Title level={2}>Dashboard</Title>
        </div>
        <Space className="w-full" direction="vertical" size={24}>
          <div id="overview" className={styles['section']}>
            <Overview />
          </div>
          <DashboardTabs />
        </Space>
      </div>
    </div>
  );
};

export default Dashboard;
