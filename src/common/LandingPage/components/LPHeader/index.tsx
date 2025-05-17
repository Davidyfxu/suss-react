import { Button, Image, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import sussLogoWithTagline from '../../../../assets/suss-logo-with-tagline.jpg';
const { Header } = Layout;

const LPHeader = () => {
  return (
    <Header
      style={{
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
      }}
    >
      <Image
        preview={false}
        style={{ cursor: 'pointer' }}
        height={40}
        src={sussLogoWithTagline}
        onClick={() => window.open(`https://www.suss.edu.sg/`, '_blank')}
      />

      <Button
        type="primary"
        size="large"
        icon={<UserOutlined />}
        style={{ backgroundColor: '#D92D27' }}
        onClick={() =>
          window.open(`${location.origin}/dashboard/dashboard`, '_blank')
        }
      >
        Login
      </Button>
    </Header>
  );
};

export default LPHeader;
