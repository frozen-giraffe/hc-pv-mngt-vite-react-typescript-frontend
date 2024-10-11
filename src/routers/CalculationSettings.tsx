import React, { useMemo, useCallback } from 'react';
import { Tabs } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProdValueRatioSettings from './calculation-settings-tabs/ProdValueRatioSettings';
import DepartmentPayoutRatioSettings from './calculation-settings-tabs/DepartmentPayoutRatioSettings';
import JobPayoutRatioProfileSettings from './calculation-settings-tabs/JobPayoutRatioProfileSettings';

export const CalculationSettings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const validTabs = useMemo(() => ['prodValueRatio', 'departmentPayoutRatio', 'jobPayoutRatioProfile'], []);
  const tabParam = searchParams.get('tab');
  const activeTab = searchParams.get('tab') || 'prodValueRatio';

  React.useEffect(() => {
    if (!tabParam || !validTabs.includes(tabParam)) {
      navigate('/calculation-settings?tab=prodValueRatio', { replace: true });
    }
  }, [tabParam, navigate, validTabs]);

  const handleTabChange = useCallback((key: string) => {
    navigate(`/calculation-settings?tab=${key}`, { replace: false });
  }, [navigate]);

  const items = useMemo(() => [
    {
      key: 'prodValueRatio',
      label: '合同/下发产值系数',
      children: <ProdValueRatioSettings />
    },
    {
      key: 'departmentPayoutRatio',
      label: '专业产值系数',
      children: <DepartmentPayoutRatioSettings />
    },
    {
      key: 'jobPayoutRatioProfile',
      label: '设计阶段产值系数',
      children: <JobPayoutRatioProfileSettings />
    }
  ], []);

  return (
    <div className="system-config-container">
      <h1>计算配置</h1>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
    </div>
  );
};

export default React.memo(CalculationSettings);