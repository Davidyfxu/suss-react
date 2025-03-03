import DiscussionData from '../DiscussionData';
import Visualization from '../Visualization';
import WordCloudComp from '../WordCloudComp';
import SocialInteraction from '../SocialInteraction';
import CheckAssignment from '../CheckAssignment';
import { Typography } from 'antd';
import styles from './index.module.scss';
const { Title } = Typography;

const DashboardTabs = () => {
  return (
    <div className="flex flex-col">
      <div id="discussion" className={'py-1 px-5 bg-white'}>
        <Title level={4}>Discussion Participation</Title>
        <div className={`flex gap-4 ${styles.discussion}`}>
          <div className="w-1/2">
            <DiscussionData />
          </div>
          <div className="w-1/2">
            <Visualization />
          </div>
        </div>
      </div>

      <div id="social" className={'py-1 px-5 bg-white'}>
        <Title level={4} className={'!mb-1'}>
          Social Interaction
        </Title>
        <div className="flex gap-4">
          <SocialInteraction />
          <WordCloudComp />
        </div>
      </div>

      <div
        id="assignment"
        className={`py-2 px-5 bg-white ${styles.assignment}`}
      >
        <Title level={4}>Check Assignment Progress</Title>
        <CheckAssignment />
      </div>
    </div>
  );
};

export default DashboardTabs;
