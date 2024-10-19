import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotificationApi = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationApi must be used within a NotificationProvider');
  }
  return context;
};