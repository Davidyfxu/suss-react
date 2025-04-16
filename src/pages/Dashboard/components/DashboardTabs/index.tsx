import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';
import CheckAssignment from '../CheckAssignment';
import { Typography } from 'antd';
import { useUserStore } from '../../../../stores/userStore';
import IdeaTrajectory from '../IdeaTrajectory';
import VisualizationStudent from '../VisualizationStudent';
const { Title } = Typography;

const DashboardTabs = () => {
  const version = useUserStore((state) => state.version);
  return (
    <div className="flex flex-col">
      <div id="discussion" className="py-1 px-5 bg-white">
        <Title level={4}>Discussion Participation</Title>
        {version === 'Teacher' ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:max-h-[calc(100vh-110px)] min-h-[600px]">
            <div className="lg:w-1/2">
              <DiscussionData />
            </div>
            <div className="lg:w-1/2">
              <Visualization />
            </div>
          </div>
        ) : (
          <VisualizationStudent />
        )}
      </div>

      <div id="social" className="py-1 px-5 bg-white">
        <Title level={4} className="!mb-1">
          Social Interaction
        </Title>
        <div className="flex gap-4 flex-col md:flex-row md:min-h-[550px]">
          <SocialInteraction />
          <WordCloudComp />
        </div>
      </div>
      {version === 'Teacher' && (
        <div
          id="assignment"
          className="py-2 px-5 bg-white max-h-[calc(100vh-110px)]"
        >
          <Title level={4} className="!mb-1">
            Check Assignment Progress
          </Title>
          <CheckAssignment />
        </div>
      )}
      <div
        id="trajectory"
        className="py-2 px-5 bg-white max-h-[calc(100vh-110px)]"
      >
        <Title level={4} className="!mb-1">
          Idea Trajectory
        </Title>
        <IdeaTrajectory />
      </div>
    </div>
  );
};

export default DashboardTabs;
