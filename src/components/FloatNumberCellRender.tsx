import { Space } from 'antd';
import React from 'react';

interface FloatNumberCellRenderProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

const FloatNumberCellRender: React.FC<FloatNumberCellRenderProps> = ({ value, prefix, suffix }) => {
  const formattedValue = Number(value).toFixed(2);
  
  return (
    <div style={{ textAlign: 'right' }}>
      <Space>
        {prefix}
        {formattedValue}
        {suffix}
      </Space>
    </div>
  );
};

export default FloatNumberCellRender;
