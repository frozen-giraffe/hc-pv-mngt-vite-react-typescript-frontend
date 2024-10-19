import React, { createContext } from 'react';
import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

export const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};