import React, {useEffect, useState} from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './../assets/Logo.png'
import { Button, Input, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Login.css';
import { LoginService, type Body_Login_login_access_token as AccessToken } from '../client';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMsgVisible, setErrorMsgVisible] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const loginFetch = async (username: string, password: string) => {
    const a = {'username': username, 'password':password} as AccessToken
    LoginService.loginAccessToken({body: a}).then(({data, error}) => {
      if (data) {
        login(data.access_token)
        navigate(from);
      } else {
        console.log(error)
        setErrorMsg(error?.detail || '未知错误')
        setErrorMsgVisible(true)
      }
    }).catch((reason) => {
      console.log(reason)
    })
  };

  const handleLogin = () => {
    loginFetch(username, password);
  };

  return (
    <div className='login-page-wrap'>
      <div className='login-page-left'>
        {/* <img className='login-page-left-img' src={Image}></img> */}
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
