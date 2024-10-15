import React, { useMemo, useCallback } from 'react';
import { Tabs } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserManagement from './system-management-tabs/UserManagement.tsx';
import PersonalInfo from './system-management-tabs/PersonalInfo.tsx';
import { useAuth } from '../context/AuthContext';

const SystemManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const validTabs = useMemo(() => ['userManagement', 'personalInfo'], []);
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam || 'userManagement';
  const { user } = useAuth();

  React.useEffect(() => {
    if (!tabParam || !validTabs.includes(tabParam)) {
      navigate('/system-management?tab=personalInfo', { replace: true });
    }
  }, [tabParam, navigate, validTabs]);

  const handleTabChange = useCallback((key: string) => {
    navigate(`/system-management?tab=${key}`, { replace: true });
  }, [navigate]);

  const items = useMemo(() => [
    {
      key: 'personalInfo',
      label: '个人信息',
      children: <PersonalInfo />,
      superuserOnly: false
    },
    {
      key: 'userManagement',
      label: '用户管理',
      children: <UserManagement />,
      superuserOnly: true
    }
  ], []);

  return (
    <div className="system-management-container">
      <h1>系统管理</h1>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items.filter(item => !item.superuserOnly || user?.is_superuser)} />
    </div>
  );
};

export default React.memo(SystemManagement);