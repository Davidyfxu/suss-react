import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';
import CheckAssignment from '../CheckAssignment';
import { Typography } from 'antd';

const { Title } = Typography;

const DashboardTabs = () => {
  return (
    <div className="flex flex-col gap-4">
      <div id="discussion" className={'p-5 rounded-lg bg-white'}>
        <Title level={4}>Discussion Distribution</Title>
        <div className="flex flex-col gap-4">
          <DiscussionData />
          <Visualization />
        </div>
      </div>

      <div id="social" className={'p-5 rounded-lg bg-white'}>
        <Title level={4}>Social Interaction</Title>
        <div className="flex flex-col gap-4">
          <SocialInteraction />
          <WordCloudComp />
        </div>
      </div>

      <div id="assignment" className={'p-5 rounded-lg bg-white'}>
        <Title level={4}>Check Assignment Progress</Title>
        <CheckAssignment />
      </div>
    </div>
  );
};

export default DashboardTabs;
