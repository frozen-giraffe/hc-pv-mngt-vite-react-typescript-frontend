import React, { useState } from 'react';
import { Modal, Tabs, Radio, DatePicker, Space, Button } from 'antd';
import { ReportsService } from '../client';
import { downloadReport } from "../utils/ReportFileDownload";
import { useNotificationApi } from "../hooks/useNotificationApi";
import { LoadingOutlined } from '@ant-design/icons';
interface EmployeeReportModalProps {
  visible: boolean;
  onCancel: () => void;
  employeeId: number;
  employeeName: string;
}

const EmployeeReportModal: React.FC<EmployeeReportModalProps> = ({
  visible,
  onCancel,
  employeeId,
  employeeName,
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [payoutListType, setPayoutListType] = useState<'payment' | 'project'>('payment');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const notificationApi = useNotificationApi();

  const handleDownload = async () => {
    try {
      let response;
      notificationApi.open({
        key: 'employee_report_loading',
        message: '正在生成报告...',
        icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
        duration: 2,
        onClose: () => {
          notificationApi.open({
            key: 'employee_report_loading',
            message: '正在生成报告...数据较多，请耐心等待，不要离开页面',
            icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
            duration: 0,
          });
        },
      });
      if (!selectedYear) {
        notificationApi.error({
        key: 'employee_report_loading',
        message: '未提供年度',
        duration: 2,
        });
        return;
      }
      
      onCancel();
      switch (activeTab) {
        case '1':
          response = await ReportsService.getEmployeeProjectProductionValueByProjectYearReport({ 
            query: { project_year: selectedYear, employee_id: employeeId} });
          break;
        case '2':
          if (payoutListType === 'payment') {
            response = await ReportsService.getEmployeeProjectPayoutListByPaymentYearReport({ 
              query: { payment_year: selectedYear, employee_id: employeeId } 
            });
          } else {
            response = await ReportsService.getEmployeeProjectPayoutListByProjectYearReport({ 
              query: { project_year: selectedYear, employee_id: employeeId } 
            });
          }
          break;
      }

      if (response?.data) {
        notificationApi.success({
          key: 'employee_report_loading',
          message: '报告生成成功',
          description: '正在下载...',
          duration: 2,
        });
        downloadReport(response.data, response.response);
      } else {
        notificationApi.error({
          key: 'employee_report_loading',
          message: '获取报告失败',
          description: String(response?.error?.detail),
          duration: 20,
        });
      }
    } catch (error) {
      notificationApi.open({
        key: 'employee_report_loading',
        message: '获取报告失败，未知错误',
        description: String(error),
        duration: 10,
      });
    }
  };

  const isDownloadDisabled = !selectedYear;

  const tabItems = [
    { key: '1', 
      label: '产值报告',
     },
    {
      key: '2',
      label: '累计兑付产值报告',
      children: (
        <Space direction="vertical">
          <Radio.Group
            value={payoutListType}
            onChange={(e) => setPayoutListType(e.target.value)}
          >
            <Radio value="payment">按回款年度</Radio>
            <Radio value="project">按项目年度</Radio>
          </Radio.Group>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={`生成员工年度报告：${employeeName}`}
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
      <Space direction="vertical">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          <DatePicker
          picker="year"
          onChange={(date) => setSelectedYear(date ? date.year() : null)}
          placeholder='请选择年度'
          />
      </Space>
    </Modal>
  );
};

export default EmployeeReportModal;