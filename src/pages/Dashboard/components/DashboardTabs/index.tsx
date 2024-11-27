import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';
import CheckAssignment from '../CheckAssignment';
import { Typography } from 'antd';

const { Title } = Typography;

const DashboardTabs = () => {
  return (
    <div className="flex flex-col gap-8">
      <div id="discussion">
        <Title level={3}>Discussion Distribution</Title>
        <div className="flex flex-col gap-4">
          <DiscussionData />
          <Visualization />
        </div>
      </div>

      <div id="social">
        <Title level={3}>Social Interaction</Title>
        <div className="flex flex-col gap-4">
          <SocialInteraction />
          <WordCloudComp />
        </div>
      </div>

      <div id="assignment">
        <Title level={3}>Check Assignment Progress</Title>
        <CheckAssignment />
      </div>
    </div>
  );
};

export default DashboardTabs;
