import React, { useEffect, useState } from "react";
import SelfMenu from "./../components/Menu";
import { Nav } from "../components/Nav";
import "./Dashboard.css";
import { Test } from "./MainPage";
import { Link, Navigate, Route, Router, Routes, useNavigate, useLocation } from "react-router-dom";
import { Button, Layout, Menu, theme,MenuProps, Dropdown, DropDownProps, Divider, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import Logo from '/favicon.png'
import { useAuth } from "../context/AuthContext";
import { OpenAPI, ReportsService, UserPublic, UsersService } from "../client";
import { downloadReport } from "../utils/ReportFileDownload";


type MenuItem = Required<MenuProps>['items'][number] & {
  path?: string;
};
const items: MenuItem[] = [
  {
    key: '/dashboard',
    label: '主页',
    icon: <MailOutlined />,
    path: '/dashboard',

  },
  {
    key: '/projects',
    label: '项目',
    icon: <SettingOutlined />,
    path: '/projects'
  },
  {
    type: 'divider',
  },
  {
    key: '/employees',
    label: '人员管理',
    icon: <AppstoreOutlined />,
    path: '/employees'
  },
  {
    key: '/calculation-settings',
    label: '计算配置',
    icon: <SettingOutlined />,
    path: '/calculation-settings',
  },
  {
    key: '/system-management',
    label: '系统管理',
    icon: <SettingOutlined />,
    path: '/system-management',
  },
  
];



export const Dashboard: React.FC<{ children: React.ReactNode }>  = ({children}) => {
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
    const matchingItem = items.find(item => item.path === currentPath);
    if (matchingItem) {
      setSelectedKeys([matchingItem.key as string]);
    }
  }, [location]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const onClickImage:React.DOMAttributes<HTMLImageElement>['onClick']=()=>{
    navigate('/');
  }
  const onClickMenuItem: MenuProps['onClick'] = (e) => {
    const item = items.find(item => item.key === e.key);
    if (item?.path) {
      navigate(item.path);
    }
    
  };
  const dropDownMenu: MenuProps['items']= [
    {
      key: '1',
      label: (
          '1st menu item'
      ),
      onClick: async()=>{
        try {
          const { data, error, response }= await ReportsService.getEmployeeProjectPayoutListByProjectYearReport({
            query: {
              project_year: 2023,
              employee_id: 21
            }
          })
          if (error){
            console.log(error);
            message.error("Error getting report: "+error.detail)
            return;
          }
          downloadReport(data, response)
        } catch (error) {
          console.log(error);
        }
      }
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
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
        navigate('/login')
        
      }
    },
  ];
  

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider for Drawer Menu */}
      <Sider  trigger={null} collapsible collapsed={collapsed} width={collapsed ? 80 : 200}  style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}>
        <div className='logo-div'> 
          <img src={Logo} className='logo-inner-img' onClick={onClickImage}></img>

        </div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={selectedKeys}
          items={items}
          onClick={onClickMenuItem}
          
        />
      </Sider>

      {/* Layout for Top Nav and Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s ease' }}>
        <Header style={{ padding: 0, background: colorBgContainer,display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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