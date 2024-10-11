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
    key: '/mainpage',
    label: '主页',
    icon: <MailOutlined />,
    path: '/mainpage',
    // children: [
    //   {
    //     key: 'g1',
    //     label: 'Item 1',
    //     type: 'group',
    //     children: [
    //       { key: '1', label: 'Option 1' },
    //       { key: '2', label: 'Option 2' },
    //     ],
    //   },
    //   {
    //     key: 'g2',
    //     label: 'Item 2',
    //     type: 'group',
    //     children: [
    //       { key: '3', label: 'Option 3' },
    //       { key: '4', label: 'Option 4' },
    //     ],
    //   },
    // ],
  },
  {
    key: '/people',
    label: '人员',
    icon: <AppstoreOutlined />,
    path: '/people'
    // children: [
    //   { key: '5', label: 'Option 5' },
    //   { key: '6', label: 'Option 6' },
    //   {
    //     key: 'sub3',
    //     label: 'Submenu',
    //     children: [
    //       { key: '7', label: 'Option 7' },
    //       { key: '8', label: 'Option 8' },
    //     ],
    //   },
    // ],
  },
  {
    type: 'divider',
  },
  {
    key: '/projects',
    label: '工程',
    icon: <SettingOutlined />,
    path: '/projects'
    // children: [
    //   { key: '9', label: 'Option 9' },
    //   { key: '10', label: 'Option 10' },
    //   { key: '11', label: 'Option 11' },
    //   { key: '12', label: 'Option 12' },
    // ],
  },
  {
    key: '/settings',
    label: '系统配置',
    icon: <SettingOutlined />,
    path: '/settings',
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

  const [selectedKeys, setSelectedKeys] = useState<string[]>(['/mainpage']);

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
          mode="inline"
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