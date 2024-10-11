import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Logo from './../assets/Logo.png'
import { Button, Input, Alert, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = (location.state as { from?: string })?.from || '/dashboard';
  const redirectUrl = searchParams.get('redirect');

  const navigateAfterLogin = useCallback(() => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate(from);
    }
  }, [navigate, redirectUrl, from]);

  useEffect(() => {
    const loginReason = localStorage.getItem('redirect_login_reason');
    if (loginReason === 'token_expired') {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem('redirect_login_reason');
    }
    if (isAuthenticated) {
      navigateAfterLogin();
    }
  }, [isAuthenticated, navigateAfterLogin]);

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigateAfterLogin();
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMsg((error as Error).message || '未知错误');
      setErrorMsgVisible(true);
    }
  };

  return (
    <div className='login-page-wrap'>
      <div className='login-page-left'>
        <div></div>
        <div className='text'>新疆昊辰产值管理系统</div>
      </div>
      
      <div className='login-page-right'>
        <img className='logo' src={Logo}></img>
        <Alert
          className='alert'
          style={errorMsgVisible ? {display: 'block'} : {display:'none'}}
          message="Error"
          description={errorMsg}
          type="error"
          showIcon
        />
        <Input 
          placeholder="Username" 
          value={username}
          size='large'
          onChange={(e) => setUsername(e.target.value)}/>
        <Input.Password
          size='large'
          placeholder="Password"
          value={password}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button className='loginButton' type="primary" onClick={handleLogin} >Login</Button>

        <div className='copyright'>© 2024 Hao Cheng Architecture Planning and Design Research Institute Co., Ltd. All Rights Reserved</div>
      </div>
      
    </div>
  )
}
