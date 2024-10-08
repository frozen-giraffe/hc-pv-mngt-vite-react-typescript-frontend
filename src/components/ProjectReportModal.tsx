import React, { useState } from 'react';
import { Modal, Tabs, Radio, DatePicker, Space, Button, message } from 'antd';
import { ReportsService } from '../client';
import { downloadReport } from "../utils/ReportFileDownload";

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
  const [messageApi, contextHolder] = message.useMessage();

  const handleDownload = async () => {
    try {
      let response;
      messageApi.open({
        key: 'project_report_loading',
        type: 'loading',
        content: '正在生成报告...',
        duration: 7,
        onClose: () => {
          messageApi.open({
            key: 'project_report_loading',
            type: 'loading',
            content: '正在生成报告...数据较多，请耐心等待，并不要离开页面',
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
              messageApi.open({
                key: 'project_report_loading',
                type: 'error',
                content: '未提供回款年度',
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
        messageApi.open({
          key: 'project_report_loading',
          type: 'success',
          content: '报告生成成功，正在下载...',
          duration: 2,
        });
        downloadReport(response.data, response.response);
      } else {
        messageApi.open({
          key: 'project_report_loading',
          type: 'error',
          content: '获取报告失败：' + response?.error?.detail,
          duration: 10,
        });
      }
    } catch (error) {
      messageApi.open({
        key: 'project_report_loading',
        type: 'error',
        content: '获取报告失败，未知错误：' + error,
        duration: 10,
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
      {contextHolder}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </Modal>
  );
};

export default ProjectReportModal;