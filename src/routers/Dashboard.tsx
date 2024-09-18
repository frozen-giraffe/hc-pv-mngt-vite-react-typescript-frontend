import React, { useEffect, useState } from "react";
import SelfMenu from "./../components/Menu";
import { Nav } from "../components/Nav";
import "./Dashboard.css";
import { Test } from "./MainPage";
import { Link, Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, theme,MenuProps, Dropdown, DropDownProps, Divider } from "antd";
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
import { OpenAPI, UserPublic, UsersService } from "../client";


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
    key: 'sub2',
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
    key: 'sub4',
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
  
];


export const Dashboard: React.FC<{ children: React.ReactNode }>  = ({children}) => {
  //const [user, setUser] = useState<UserPublic>();
  const { setUser} = useAuth();
  const navigate = useNavigate();
  const auth = useAuth()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(()=>{
    UsersService.readUserMe().then((user:UserPublic)=>{
      console.log(user);
      setUser(user)
      //setUser(user)
    }).catch((reason)=>{
      console.log(reason);
    })
  },[])
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
        const url = "http://alang-main.griffin-vibes.ts.net/api/v1/employee/report/1"
        try {
          const response = await fetch(url, {
            method:'GET',
            
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjYxMDU5MTYsInN1YiI6IjEifQ.0y7x9s1GIIXQ5kIVr15JU01L6BD-ExPFfFeeW5IZTiA',
            }
          });
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
          
          response.blob().then((b)=>{
            const file = new Blob(
              [b], 
              {type: 'application/pdf'}
            );
            const fileURL = URL.createObjectURL(file);
            
            //window.open(fileURL);

            const a = document.createElement('a');
            a.download = 'my-file.pdf';
            a.href = fileURL
            a.click();
            // a.addEventListener('click', (e) => {
            //   setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
            // });
            document.body.appendChild(a);
            a.click();
            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
          })
          
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
          defaultSelectedKeys={['1']}
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
