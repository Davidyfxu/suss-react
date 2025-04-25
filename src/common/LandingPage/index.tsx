import LPHeader from './components/LPHeader';
import LPContent from './components/LPContent';
import LPFooter from './components/LPFooter';
import { ConfigProvider } from 'antd';
import './index.css';

const LandingPage = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: { colorPrimary: '#D92D27' }
        }
      }}
    >
      <div
        className="landing-page"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%'
        }}
      >
        <LPHeader />
        <LPContent />
        <LPFooter />
      </div>
    </ConfigProvider>
  );
};

export default LandingPage;
