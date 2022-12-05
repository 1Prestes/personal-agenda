import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, MenuProps } from 'antd'
import {
  GroupOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../features/auth/authSlice'
import { getUserIdByToken } from '../../helpers/jwt'
import { useGetUserMutation } from '../../services/user'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

interface IMenuItem {
  label: React.ReactNode
  key: React.Key
  icon?: React.ReactNode
  onClick?: () => void
  children?: MenuItem[]
}

function getItem ({
  label,
  key,
  icon,
  onClick,
  children
}: IMenuItem
): MenuItem {
  return { key, icon, children, onClick, label }
}

interface IProps {
  children: JSX.Element
}

export const Home: React.FC<IProps> = ({ children }: IProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [getUser] = useGetUserMutation()
  const user = useAppSelector(state => state.getUserSlice.user)

  const loadData = async (): Promise<void> => {
    const iduser = getUserIdByToken()

    try {
      if (!user) {
        await getUser(iduser as string).unwrap()
      }
    } catch (error) {
      console.log('deu ruim ', error)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const onLogout = (): void => {
    dispatch(logout())
    navigate('/')
  }

  const items: MenuItem[] = [
    getItem({
      label: user?.name.split(' ')[0],
      key: 'user',
      icon: <UserOutlined />
    }),
    getItem({
      label: <Link to={'/home'}>Home</Link>,
      key: 'home',
      icon: <HomeOutlined />
    }),
    getItem({
      label: <Link to={'/events'}>Eventos</Link>,
      key: 'events',
      icon: <ScheduleOutlined />
    }),
    getItem({ label: 'Grupos', key: 'groups', icon: <GroupOutlined /> }),
    getItem({ label: 'Contatos', key: 'contacts', icon: <TeamOutlined /> }),
    getItem({ label: 'Sair', key: 'logout', icon: <LogoutOutlined />, onClick: onLogout })
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      dispatch(logout())
      navigate('/')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['home']}
          mode="inline"
          items={items}
          onClick={onClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> IFSP {new Date().getFullYear()} all rights reserved </Footer>
      </Layout>
    </Layout>
  )
}
