import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Logo from './../assets/Logo.png'
import { Button, Input, Alert, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Login.css';
import { REDIRECT_LOGIN_REASON_KEY, REDIRECT_LOGIN_TOKEN_EXPIRED } from '../client/const';

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
  const redirectUrl = searchParams.get('redirect');

  const navigateAfterLogin = useCallback(() => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/dashboard');
    }
  }, [navigate, redirectUrl]);

  useEffect(() => {
    const loginReason = localStorage.getItem(REDIRECT_LOGIN_REASON_KEY);
    if (loginReason === REDIRECT_LOGIN_TOKEN_EXPIRED) {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem(REDIRECT_LOGIN_REASON_KEY);
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
        <div className='text'>新疆昊辰建筑设计规划研究院 - 产值管理系统</div>
      </div>
      
      <div className='login-page-right'>
        <img className='logo' src={Logo}></img>
        <Alert
          className='alert'
          style={errorMsgVisible ? {display: 'block'} : {display:'none'}}
          message="登录失败"
          description={errorMsg}
          type="error"
          showIcon
        />
        <Input 
          placeholder="邮箱" 
          value={username}
          size='large'
          onChange={(e) => setUsername(e.target.value)}/>
        <Input.Password
          size='large'
          placeholder="密码"
          value={password}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible,
          }}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button className='loginButton' type="primary" onClick={handleLogin} >登录</Button>

        <div className='copyright'>©2024 昊辰建筑设计研究院有限公司 版权所有</div>
      </div>
      
    </div>
  )
}

