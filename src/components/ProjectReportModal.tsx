import React, { useState } from 'react';
import { Modal, Tabs, Radio, DatePicker, Space, Button } from 'antd';
import { ReportsService } from '../client';
import { downloadReport } from "../utils/ReportFileDownload";
import { useNotificationApi } from "../hooks/useNotificationApi";
import { LoadingOutlined } from '@ant-design/icons';

interface ProjectReportModalProps {
  visible: boolean;
  onCancel: () => void;
  projectId: number;
}

const ProjectReportModal: React.FC<ProjectReportModalProps> = ({
  visible,
  onCancel,
  projectId,
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [payoutListType, setPayoutListType] = useState<'payment' | 'project'>('payment');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const notificationApi = useNotificationApi();

  const handleDownload = async () => {
    try {
      let response;
      notificationApi.open({
        key: 'project_report_loading',
        message: '正在生成报告...',
        description: '请稍候...',
        icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
        duration: 7,
        onClose: () => {
          notificationApi.open({
            key: 'project_report_loading',
            message: '正在生成报告...',
            description: '数据较多，请耐心等待',
            icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
            duration: 0,
          });
        },
      });
      switch (activeTab) {
        case '1':
          response = await ReportsService.getProjectPayoutReport({ query: { project_id: projectId } });
          break;
        case '2':
          response = await ReportsService.getProjectProductionValueReport({ query: { project_id: projectId } });
          break;
        case '3':
          if (payoutListType === 'payment') {
            if (!selectedYear) {
              notificationApi.error({
                key: 'project_report_loading',
                message: '未提供回款年度',
                duration: 2,
              });
              return;
            }
            response = await ReportsService.getProjectPayoutListByPaymentYearReport({ 
              query: { project_id: projectId, payment_year: selectedYear } 
            });
          } else {
            response = await ReportsService.getProjectPayoutListByProjectYearReport({ 
              query: { project_id: projectId } 
            });
          }
          break;
      }

      if (response?.data) {
        notificationApi.success({
          key: 'project_report_loading',
          message: '报告生成成功',
          description: '正在下载...',
          duration: 2,
        });
        downloadReport(response.data, response.response);
      } else {
        notificationApi.error({
          key: 'project_report_loading',
          message: '获取报告失败',
          description: String(response?.error?.detail),
          duration: 0,
        });
      }
    } catch (error) {
      notificationApi.error({
        key: 'project_report_loading',
        message: '获取报告失败，未知错误',
        description: String(error),
        duration: 0,
      });
    }
    onCancel();
  };

  const isDownloadDisabled = activeTab === '3' && payoutListType === 'payment' && !selectedYear;

  const tabItems = [
    { key: '1', label: '项目产值下发表' },
    { key: '2', label: '员工产值报告' },
    {
      key: '3',
      label: '员工累计兑付产值报告',
      children: (
        <Space direction="vertical">
          <Radio.Group
            value={payoutListType}
            onChange={(e) => setPayoutListType(e.target.value)}
          >
            <Radio value="payment">按回款年度</Radio>
            <Radio value="project">按项目年度</Radio>
          </Radio.Group>
          {payoutListType === 'payment' && (
            <DatePicker
              picker="year"
              onChange={(date) => setSelectedYear(date ? date.year() : null)}
              placeholder='请选择年度'
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="生成项目报告"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload} disabled={isDownloadDisabled}>
          生成
        </Button>,
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Modal>
  );
};

export default ProjectReportModal;