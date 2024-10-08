import React, { useState } from 'react';
import { Modal, Radio, DatePicker, Space } from 'antd';

interface ProjectListDownloadModalProps {
  visible: boolean;
  onCancel: () => void;
  onDownload: (year: number | null) => void;
}

const ProjectListDownloadModal: React.FC<ProjectListDownloadModalProps> = ({
  visible,
  onCancel,
  onDownload,
}) => {
  const [selectedOption, setSelectedOption] = useState<'all' | 'specific'>('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleOk = () => {
    if (selectedOption === 'all') {
      onDownload(null);
    } else {
      onDownload(selectedYear);
    }
  };

  return (
    <Modal
      title="导出项目列表"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <Space direction="vertical">
        <Radio.Group
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <Radio value="all">所有年度</Radio>
          <Radio value="specific">指定年度</Radio>
        </Radio.Group>
        {selectedOption === 'specific' && (
          <DatePicker
            picker="year"
            onChange={(date) => setSelectedYear(date ? date.year() : null)}
          />
        )}
      </Space>
    </Modal>
  );
};

export default ProjectListDownloadModal;