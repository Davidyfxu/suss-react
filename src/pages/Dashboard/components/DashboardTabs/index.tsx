import { Tabs } from 'antd';
import { useEffect } from 'react';
import { getAllReadData } from '../../api.ts';
import DiscussionData from '../DiscussionData';
import ReadData from '../ReadData';

const DASHBOARD_TABS = [
  {
    label: 'Canvas Discussion Participation',
    key: 'discussion_data',
    children: <DiscussionData />
  },
  {
    label: 'Social Interaction (Social Network Analysis Graph)',
    key: 'read_data',
    children: <ReadData />
  },
  {
    label: 'World Cloud',
    key: 'others',
    children: <div>World Cloud</div>
  },
  {
    label: 'Check Assignment Progress',
    key: 'others2',
    children: <div>Check Assignment Progress</div>
  }
];

const DashboardTabs = () => {
  return <Tabs defaultActiveKey="1" centered items={DASHBOARD_TABS} />;
};

export default DashboardTabs;
