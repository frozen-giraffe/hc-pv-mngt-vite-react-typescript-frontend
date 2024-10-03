import React from 'react';
import { InputNumber, InputNumberProps } from 'antd';

interface InputDirectPercentProps extends Omit<InputNumberProps, 'step' | 'min' | 'max'> {
  step?: number;
  min?: number;
  max?: number;
}

const InputDirectPercent: React.FC<InputDirectPercentProps> = ({ step = 0.005, min, max, ...props }) => {
  return (
    <InputNumber
      {...props}
      step={step}
      min={min}
      max={max}
      addonAfter="%"
      formatter={(value) => (value ? `${(Number(value)).toFixed(2)}` : '')}
      parser={(value) => (value ? parseFloat(value as string) : 0)}
    />
  );
};

export default InputDirectPercent;