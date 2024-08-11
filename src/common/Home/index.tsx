import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Select } from 'antd';
import { routers } from '../config/routers';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import menuLogo from '../../assets/SUSS_LOGO.jpg';

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
      <img className={'p-4 w-full rounded-3xl'} src={menuLogo} alt={''} />
      <Menu
        mode="inline"
        selectedKeys={selectItem?.k}
        items={routers.map((router: any) => ({
          ...router,
          onClick: () => {
            navigate(`/${router?.key}`);
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
    <Header className={'bg-white flex justify-end items-center'}>
      <div className={'flex justify-between items-center gap-4'}>
        <Select
          placeholder="Select a semester"
          options={[
            { value: '1', label: 'semester 1' },
            { value: '2', label: 'semester 2' },
            { value: '3', label: 'semester 3' }
          ]}
        />
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
          <Avatar
            className={'cursor-pointer'}
            src={avatar}
            // onClick={() => navigate("/")}
          >
            {name.slice(0, 2)}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
  const renderFooter = () => (
    <Footer className={'flex items-center justify-center bg-white'}>
      <span>
        Copyright © {new Date().getFullYear()} SUSS. All Rights Reserved.{' '}
      </span>
    </Footer>
  );

  return (
    <Layout
      style={{
        height: '100vh'
      }}
    >
      {renderSider()}
      <Layout>
        {renderHeader()}
        <Content
          style={{
            padding: '8px',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <div className={'rounded-lg bg-white p-4 h-full'}>
            <Outlet />
          </div>
        </Content>
        {renderFooter()}
      </Layout>
    </Layout>
  );
};

export default Home;
