import { useEffect, useState } from 'react';
import { Layout, Avatar, Dropdown, Button, Anchor, MenuProps } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import {
  LeftOutlined,
  RightOutlined,
  LogoutOutlined,
  UserOutlined,
  UserSwitchOutlined,
  HomeOutlined
} from '@ant-design/icons';
import menuLogo from '../../assets/suss-logo-with-tagline.jpg';
import { SelectSUSSHeader, VersionSelect } from '../../components';
import styles from './index.module.scss';
import { clearSWRCache } from '../../config/swr.ts';
import { useResponsive } from 'ahooks';

const { Header, Footer, Content, Sider } = Layout;
const Home = (): any => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const name = useUserStore((state) => state.username);
  const version = useUserStore((state) => state.version);
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1
  };
  const responsive = useResponsive();

  useEffect(() => {
    setCollapsed(!responsive.lg);
  }, [responsive.lg]);

  const getHeaderItems = () => {
    const items = [
      {
        key: 'discussion',
        href: '#discussion',
        title: 'Discussion Participation'
      },
      {
        key: 'social',
        href: '#social',
        title: 'Social Interaction'
      },
      version === 'Teacher'
        ? {
            key: 'assignment',
            href: '#assignment',
            title: 'Assignment Progress'
          }
        : {
            key: 'trajectory',
            href: '#trajectory',
            title: 'Idea Trajectory'
          }
    ];

    return responsive.xl
      ? items
      : items.map((v) => ({ ...v, title: v.title.split(' ')[1] }));
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Dashboard',
      icon: <HomeOutlined />,
      onClick: () => navClick({ k: 'dashboard', label: 'Dashboard' })
    },
    {
      key: '2',
      label: 'Profile',
      icon: <UserSwitchOutlined />,
      onClick: () => navClick({ k: 'profile', label: 'Profile' })
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    clearSWRCache();
    setTimeout(() => window.location.reload(), 300);
  };

  const navClick = (props: { k: string; label: string }) => {
    const { k } = props;
    navigate(`/dashboard/${k}`);
  };
  const renderSider = () => (
    <Sider
      className={styles.sider}
      style={{
        ...siderStyle,
        backgroundColor: '#d9e4f5',
        backgroundImage: 'linear-gradient(315deg, #d9e4f5 0%, #f5e3e6 74%)'
      }}
      collapsed={collapsed}
    >
      <div className="flex flex-col items-center p-4">
        <Dropdown arrow menu={{ items }}>
          <Avatar
            icon={<UserOutlined />}
            size={collapsed ? 48 : 64}
            className="cursor-pointer bg-amber-600"
          />
        </Dropdown>
        {!collapsed && (
          <h4 className="text-2xl font-bold bg-gradient-to-r from-[#d92d27] to-[#ff6f61] bg-clip-text text-transparent text-center mt-4">
            {name}
          </h4>
        )}
        <Button
          className={'mt-2'}
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>
      <SelectSUSSHeader />
      <div className="flex flex-col gap-2 mt-auto p-4">
        <Button type="text" onClick={() => setCollapsed(!collapsed)} block>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </Button>
      </div>
    </Sider>
  );

  const renderHeader = () => (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        left: collapsed ? 80 : 200,
        right: 0,
        zIndex: 2,
        paddingInline: '20px',
        transition: 'left 0.2s'
      }}
      className={'bg-white flex justify-between items-center fixed'}
    >
      <img
        className={'h-10 cursor-pointer hover:shadow'}
        src={menuLogo}
        alt={''}
        onClick={() => window.open('https://www.suss.edu.sg/')}
      />
      {window.location.pathname === '/dashboard/dashboard' && responsive.md && (
        <Anchor
          direction="horizontal"
          targetOffset={60}
          className={styles.anchorContainer}
          items={getHeaderItems()}
        />
      )}
      <VersionSelect />
    </Header>
  );
  const renderFooter = () => (
    <Footer className={'flex items-center justify-center bg-white h-10'}>
      <span>
        Copyright {new Date().getFullYear()} SUSS. All Rights Reserved.{' '}
      </span>
    </Footer>
  );

  return (
    <Layout hasSider>
      {renderSider()}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s'
        }}
      >
        {renderHeader()}
        <Content
          style={{
            marginTop: 64,
            minHeight: '80vh',
            backgroundColor: 'white'
            // overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
        {renderFooter()}
      </Layout>
    </Layout>
  );
};

export default Home;
