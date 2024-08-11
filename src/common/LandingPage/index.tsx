import LPHeader from './components/LPHeader';
import LPContent from './components/LPContent';
import LPFooter from './components/LPFooter';
import { ConfigProvider } from 'antd';

const LandingPage = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: { colorPrimary: '#001e60' }
        }
      }}
    >
      <LPHeader />
      <LPContent />
      <LPFooter />
    </ConfigProvider>
  );
};

export default LandingPage;
