import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GroupOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Layout, List, Menu, MenuProps } from 'antd';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';
import { getUserIdByToken } from '../../helpers/jwt';
import { useGetUserMutation } from '../../services/user';
import { Schedule } from './Calendar';
import { useListEventsMutation } from '../../services/events';

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

export const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [getUser] = useGetUserMutation();
  const user = useAppSelector(state => state.getUserSlice.user)

  const loadData = async () => {
    const iduser = getUserIdByToken();

    try {
      if (!user) {
        await getUser(iduser).unwrap()
      }

    } catch (error) {
      console.log('deu ruim ', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const items: MenuItem[] = [
    getItem(user?.name.split(' ')[0] || '', '1', <UserOutlined />),
    getItem('Eventos', 'events', <ScheduleOutlined />,),
    getItem('Grupos', 'groups', <GroupOutlined />),
    getItem('Contatos', 'contacts', <TeamOutlined />,),
    getItem('Sair', 'logout', <LogoutOutlined />,),
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      dispatch(logout())
      navigate('/')
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={onClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home </Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ minHeight: 360 }}>
            <Schedule />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> IFSP {new Date().getFullYear()} all rights reserved </Footer>
      </Layout>
    </Layout>
  );
};
