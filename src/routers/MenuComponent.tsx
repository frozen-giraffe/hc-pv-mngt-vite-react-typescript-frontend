import React, { useEffect, useState } from "react";
import "./MenuComponent.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Layout, Menu, theme,MenuProps, Dropdown, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ProjectOutlined,
  SettingOutlined,
  HomeOutlined,
  CalculatorOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import Logo from '../assets/Logo.png'
import LogoWithText from '../assets/LogoWithText.png'
import { useAuth } from "../hooks/useAuth";


type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
};
const items: MenuItem[] = [
  {
    key: '/dashboard',
    label: (
      <a href="/dashboard">
        主页
      </a>
    ),
    icon: <HomeOutlined />,
    path: '/dashboard',

  },
  {
    key: '/projects',
    label: (
      <a href="/projects">
        项目
      </a>
    ),
    icon: <ProjectOutlined />,
    path: '/projects'
  },
  {
    type: 'divider',
  },
  {
    key: '/employees',
    label: (
      <a href="/employees">
        人员管理
      </a>
    ),
    icon: <UserOutlined />,
    path: '/employees'
  },
  {
    key: '/calculation-settings',
    label: (
      <a href="/calculation-settings">
        计算配置
      </a>
    ),
    icon: <CalculatorOutlined />,
    path: '/calculation-settings',
  },
  {
    key: '/system-management',
    label: (
      <a href="/system-management">
        系统管理
      </a>
    ),
    icon: <SettingOutlined />,
    path: '/system-management',
  },
  
];



export const MenuComponent: React.FC<{ children: React.ReactNode }>  = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKeys, setSelectedKeys] = useState<string[]>(['/dashboard']);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = items.find(item => item.path && currentPath.startsWith(item.path));
    if (matchingItem) {
      setSelectedKeys([matchingItem.key as string]);
    }
  }, [location]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const onClickImage:React.DOMAttributes<HTMLImageElement>['onClick']=()=>{
    navigate('/');
  }
  const onClickMenuItem: MenuProps['onClick'] = (e) => {
    const item = items.find(item => item.key === e.key);
    if (item?.path) {
      navigate(item.path, {state:{from:location.pathname}});
    }
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setCollapsed(true)
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setCollapsed(false)
      }
    }
  };

  const dropDownMenu: MenuProps['items']= [
    {
      key: '1',
      icon: isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      label: isFullScreen ? '退出全屏' : '全屏',
      onClick: toggleFullScreen
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: (<a href="/system-management?tab=personalInfo">{auth.user?.full_name || '个人信息'}</a>),
      onClick: (e) => {
        e.domEvent.preventDefault();
        navigate('/system-management?tab=personalInfo', {state:{from:"settings_dropdown"}})
      }
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: (
        <div style={{display:'flex', justifyContent:'center'}}>
          登出
        </div>
      ),
      onClick:()=>{
        auth.logout()
        navigate('/login', {state:{from:"settings_dropdown"}})
      }
    },
  ];
  

  const isEmployeesOrProjectsPage = location.pathname.startsWith('/employees') || location.pathname.startsWith('/projects');

  const FullScreenButton = () => (
    <Tooltip title={isFullScreen ? '退出全屏' : '全屏'}>
      <Button
        type="text"
      icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      onClick={toggleFullScreen}
      style={{
        fontSize: '16px',
        marginRight: '16px',
        }}
      />
    </Tooltip>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider for Drawer Menu */}
      <Sider  trigger={null} collapsible collapsed={collapsed} width={collapsed ? 70 : 200}  style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
        collapsedWidth={70}
        onCollapse={(going_collapsed) => {
          if (going_collapsed !== collapsed) {
            setCollapsed(going_collapsed)
          }
        }}
        breakpoint="lg"
        >
        <div className='logo-div'> 
          <img 
              src={collapsed ? Logo : LogoWithText} 
              className={`logo-inner-img ${collapsed ? 'collapsed' : 'expanded'}`} 
              onClick={onClickImage}
              alt="Logo"
          />
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={selectedKeys}
          items={items}
          onClick={(e) => {
            e.domEvent.preventDefault();
            onClickMenuItem(e);
          }}
          
        />
      </Sider>

      {/* Layout for Top Nav and Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s ease' }}>
        <Header style={{ position: 'sticky', top: 0, zIndex: 99, padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title={collapsed ? '展开菜单' : '折叠菜单'} placement="right">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Tooltip>
          <div style={{display:'flex', alignItems:'center'}}>昊辰产值管理系统 - {auth.user?.full_name}</div>
          <div>
            {isEmployeesOrProjectsPage && <FullScreenButton />}
            <Dropdown menu={{items:dropDownMenu}} placement="bottomRight">
              <Button
                type="text"
                icon={<SettingOutlined />}
                style={{
                  fontSize: '16px',
                  marginRight: '16px',
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
