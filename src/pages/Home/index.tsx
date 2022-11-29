import React, { useState } from 'react';
import {
  GroupOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Usuário 1', '1', <UserOutlined />),
  getItem('Grupos', '2', <GroupOutlined />),
  getItem('Eventos', 'sub1', <ScheduleOutlined />, [
    getItem('Listar', '3'),
    getItem('Novo', '4'),
  ]),
  getItem('Contatos', 'sub2', <TeamOutlined />, [
    getItem('Listar', '6'),
    getItem('Novo', '8')
  ]),
  getItem('Sair', '9', <LogoutOutlined />),
];

export const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      < Layout className="site-layout" >
        <Header className="site-layout-background" style={{ padding: 0 }} />
        < Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home </Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            Home page
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> IFSP {new Date().getFullYear()} all rights reserved </Footer>
      </Layout>
    </Layout>
  );
};
