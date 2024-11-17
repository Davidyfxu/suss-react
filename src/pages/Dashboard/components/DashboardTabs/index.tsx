import { Space, Splitter, Tabs } from 'antd';

import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';
import CheckAssignment from '../CheckAssignment';

const DASHBOARD_TABS = [
  {
    label: 'Discussion Distribution',
    key: 'discussion_data',
    children: (
      <div className={'flex flex-col gap-4'}>
        <DiscussionData />
        <Visualization />
      </div>
    )
  },
  {
    label: 'Social Interaction',
    key: 'social_interaction',
    children: (
      <Splitter className={'h-full'}>
        <Splitter.Panel
          className={'h-full'}
          defaultSize="40%"
          min="20%"
          max="70%"
        >
          <SocialInteraction />
        </Splitter.Panel>
        <Splitter.Panel collapsible>
          <WordCloudComp />
        </Splitter.Panel>
      </Splitter>
    ),
    destroyInactiveTabPane: true // 只对这个标签页设置为true
  },
  {
    label: 'Check Assignment Progress',
    key: 'check_assignment',
    children: <CheckAssignment />
  }
];

const DashboardTabs = () => {
  return (
    <Tabs
      defaultActiveKey="discussion_visual"
      centered
      items={DASHBOARD_TABS}
    />
  );
};

export default DashboardTabs;
