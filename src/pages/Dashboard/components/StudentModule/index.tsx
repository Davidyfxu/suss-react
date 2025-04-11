import { Typography } from 'antd';
import SocialInteraction from '../SocialInteraction';
import WordCloudComp from '../WordCloudComp';
import IdeaTrajectory from '../IdeaTrajectory';
const { Title } = Typography;

const StudentModule = () => {
  return (
    <div id="social" className={'py-1 px-5 bg-white'}>
      <Title level={4} className={'!mb-1'}>
        Social Interaction
      </Title>
      <div className="flex gap-4">
        <SocialInteraction />
        <WordCloudComp />
      </div>
      <IdeaTrajectory></IdeaTrajectory>
    </div>
  );
};

export default StudentModule;
