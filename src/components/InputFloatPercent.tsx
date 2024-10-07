import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';

interface InputFloatPercentProps extends Omit<InputNumberProps, 'step' | 'min' | 'max'> {
  step?: number;
  min?: number;
  max?: number;
}

const InputFloatPercent: React.FC<InputFloatPercentProps> = ({ step = 0.005, min, max, ...props }) => {
  return (
    <InputNumber
      {...props}
      step={step}
      min={min}
      max={max}
      addonAfter="%"
      formatter={(value) => (value ? `${(Number(value) * 100).toFixed(2)}` : '')}
      parser={(value) => (value ? parseFloat(value as string) / 100 : 0)}
    />
  );
};

export default InputFloatPercent;