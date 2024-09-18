import React from 'react'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import './Nav.css'


export const Nav = () => {
  return (
    <div className='nav-inner-wrap'>
        
        <div className='x1-icon-wrap'>
            <AppstoreOutlined></AppstoreOutlined>
        </div>
        <div className='setting-icon-wrap'>
            <SettingOutlined></SettingOutlined>
        </div>
        <div>
            Hi there!
        </div>
    </div>
  )
}
