import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const LoginButton = () => {
  return (
    <Button
      type="primary"
      size="large"
      icon={<UserOutlined />}
      style={{ backgroundColor: '#D92D27' }}
      onClick={() =>
        window.open(`${location.origin}/dashboard/dashboard`, '_blank')
      }
    >
      Log in
    </Button>
  );
};

export default LoginButton;
