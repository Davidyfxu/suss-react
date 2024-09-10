import { Tabs } from 'antd';

import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';

const DASHBOARD_TABS = [
  {
    label: 'Discussion Visualization',
    key: 'discussion_visual',
    children: <Visualization />
  },
  {
    label: 'Canvas Discussion Participation',
    key: 'discussion_data',
    children: <DiscussionData />
  },
  {
    label: 'Social Interaction',
    key: 'social_interaction',
    children: <SocialInteraction />
  },
  {
    label: 'Word Cloud',
    key: 'word_cloud',
    children: <WordCloudComp />
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
