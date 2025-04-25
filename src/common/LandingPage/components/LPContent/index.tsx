import { Layout } from 'antd';
import WelcomeSection from './WelcomeSection';
import ImageSection from './ImageSection';
import IntroCards from './IntroCards';

const { Content } = Layout;

const LPContent = () => {
  return (
    <Content>
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)'
        }}
        className={
          'rounded-lg flex flex-col md:flex-row justify-evenly items-center'
        }
      >
        <WelcomeSection
          title="Welcome to SUSS"
          subtitle="Collaborative Analytic Tool"
          abbreviation="CLATo"
          description="is an in-house developed platform to support collaborative learning. Through the interactive visualizations and innovative features, this tool makes it handy for users to view discussion participations, track discussion flow and engagement dynamics."
        />
        <ImageSection />
      </div>
      <IntroCards />
    </Content>
  );
};

export default LPContent;
