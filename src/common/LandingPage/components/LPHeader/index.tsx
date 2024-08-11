import { Button, Image, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import sussLogoWithTagline from '../../../../assets/suss-logo-with-tagline.jpg';
const { Header } = Layout;

const LPHeader = () => {
  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
      }}
    >
      <Image height={40} src={sussLogoWithTagline} />
      <Link to={'/login'}>
        <Button type="primary" size="large" icon={<UserOutlined />}>
          Log in
        </Button>
      </Link>
    </Header>
  );
};

export default LPHeader;
