import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Anchor } from 'antd';
import { routers } from '../config/routers';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import menuLogo from '../../assets/SUSS_LOGO.jpg';
import { SelectSUSSHeader } from '../../components';

const { Header, Footer, Content, Sider } = Layout;
const Home = (): any => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [selectItem, setSelectItem] = useState({ k: [], label: '' });
  const name = useUserStore((state) => state.username);
  const avatar = useUserStore((state) => state.avatar);

  const renderSider = () => (
    <Sider
      style={{
        backgroundColor: '#d9e4f5',
        backgroundImage: 'linear-gradient(315deg, #d9e4f5 0%, #f5e3e6 74%)'
      }}
      collapsed={collapsed}
    >
      <img
        className={'p-4 w-full rounded-3xl cursor-pointer'}
        src={menuLogo}
        alt={''}
        onClick={() => window.open('https://www.suss.edu.sg/')}
      />
      <Menu
        mode="inline"
        selectedKeys={selectItem?.k}
        items={routers.map((router: any) => ({
          ...router,
          onClick: () => {
            navigate(`/dashboard/${router?.key}`);
            setSelectItem({ k: [router?.key], label: router?.label });
          }
        }))}
      />
      <Button type="text" onClick={() => setCollapsed(!collapsed)} block>
        {collapsed ? <RightOutlined /> : <LeftOutlined />}
      </Button>
    </Sider>
  );

  const renderHeader = () => (
    <Header
      style={{ width: '-webkit-fill-available' }}
      className={'z-40 bg-white flex justify-between items-center fixed gap-4'}
    >
      <Anchor
        direction="horizontal"
        targetOffset={200}
        className="px-4 py-2 rounded-lg [&_.ant-anchor-link]:px-3 [&_.ant-anchor-link]:py-1 [&_.ant-anchor-link-title]:text-[#3498db] [&_.ant-anchor-link-title:hover]:text-[#D92D27] [&_.ant-anchor-link-title-active]:text-[#D92D27] [&_.ant-anchor-ink-ball]:border-[#D92D27] [&_.ant-anchor-link]:rounded-md [&_.ant-anchor-link]:transition-all [&_.ant-anchor-link]:duration-300"
        items={[
          {
            key: 'overview',
            href: '#overview',
            title: 'Course Overview'
          },
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
          {
            key: 'assignment',
            href: '#assignment',
            title: 'Assignment Progress'
          }
        ]}
      />
      <div className={'flex justify-between items-center gap-4'}>
        <SelectSUSSHeader />
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <a
                    onClick={() => {
                      localStorage.removeItem('token');
                      setTimeout(() => window.location.reload(), 300);
                    }}
                  >
                    Logout
                  </a>
                )
              }
            ]
          }}
        >
          <Avatar src={avatar}>{name.slice(0, 2)}</Avatar>
        </Dropdown>
      </div>
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
    <Layout>
      {renderSider()}
      <Layout>
        {renderHeader()}
        <Content
          style={{
            marginTop: 64,
            height: '100%',
            overflow: 'auto'
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
