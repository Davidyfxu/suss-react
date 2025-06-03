import { Layout } from 'antd';
import WelcomeSection from './WelcomeSection';
import ImageSection from './ImageSection';
import '../../index.css';
const { Content } = Layout;

const LPContent = () => {
  return (
    <Content
      className="landing-page"
      style={{
        height: 'calc(100vh - 120px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          flex: 1,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.9) 100%)'
        }}
        className="rounded-lg flex flex-col gap-0 md:flex-row justify-evenly items-center p-8 md:p-12 h-full lg:h-4/5"
      >
        <WelcomeSection
          title="Welcome to SUSS"
          subtitle="Collaborative Analytic Tool"
          abbreviation="CLAto"
          description="is an in-house developed platform to support collaborative learning. Through the interactive visualizations and innovative features, this tool makes it handy for users to view discussion participations, track discussion flow and engagement dynamics."
        />
        <ImageSection />
      </div>

      {/*<IntroCards />*/}
    </Content>
  );
};

export default LPContent;
