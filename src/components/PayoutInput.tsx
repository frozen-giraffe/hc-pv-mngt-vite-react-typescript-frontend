import React from 'react';
import { Input, Tooltip } from 'antd';

interface PayoutInputProps {
  style?: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  ref?: React.RefObject<HTMLInputElement>;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const PayoutInput: React.FC<PayoutInputProps> = (props) => {
  const { value, onChange, style, onBlur, onPressEnter, ref } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d{0,2})?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  };

  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (
    '输入产值'
  );

  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        style={style}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
        placeholder="Input a number"
        maxLength={16}
        ref={ref}
      />
    </Tooltip>
  );
};

export default PayoutInput;
