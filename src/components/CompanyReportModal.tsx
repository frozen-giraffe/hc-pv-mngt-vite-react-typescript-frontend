import React, { useState } from 'react';
import { Modal, Tabs, Radio, DatePicker, Space, Button, message } from 'antd';
import { ReportsService } from '../client';
import { downloadReport } from "../utils/ReportFileDownload";
import Paragraph from 'antd/es/typography/Paragraph';

interface CompanyReportModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CompanyReportModal: React.FC<CompanyReportModalProps> = ({
  visible,
  onCancel,
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
        duration: 2,
        onClose: () => {
          messageApi.open({
            key: 'project_report_loading',
            type: 'loading',
            content: '正在生成报告...数据较多，请耐心等待，不要离开页面',
            duration: 0,
          });
        },
      });
      if (!selectedYear) {
        messageApi.open({
        key: 'project_report_loading',
        type: 'error',
        content: '未提供年度',
        duration: 2,
        });
        return;
      }
      
      onCancel();
      switch (activeTab) {
        case '1':
          response = await ReportsService.getCompanyProjectProductionValueByProjectYearReport({ 
            query: { project_year: selectedYear} });
          break;
        case '2':
          if (payoutListType === 'payment') {
            response = await ReportsService.getCompanyProjectPayoutListByPaymentYearReport({ 
              query: { payment_year: selectedYear } 
            });
          } else {
            response = await ReportsService.getCompanyProjectPayoutListByProjectYearReport({ 
              query: { project_year: selectedYear } 
            });
          }
          break;
        case '3':
          response = await ReportsService.getContractPaymentListReport({ 
            query: { time_start: `${selectedYear}-01-01`, time_end: `${selectedYear}-12-31` } 
          });
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
          duration: 20,
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
  };

  const isDownloadDisabled = !selectedYear;

  const tabItems = [
    { key: '1', 
      label: '年度产值报告',
      children: (
        <Paragraph>
            <blockquote>按工程年度</blockquote>
        </Paragraph>
      ),
     },
    {
      key: '2',
      label: '年度累计兑付产值报告',
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
    {
      key: '3',
      label: '年度回款列表',
      children: (
        <Paragraph>
            <blockquote>按回款年度</blockquote>
        </Paragraph>
      ),
    }
  ];

  return (
    <Modal
      title="生成公司年度报告"
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

export default CompanyReportModal;