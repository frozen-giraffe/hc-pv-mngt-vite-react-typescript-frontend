import React from 'react';
import { Input, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { YearPicker, RangePicker } = DatePicker;

interface FilterDropdownProps {
  type: 'input' | 'number_range' | 'year' | 'date_range';
  placeholder?: string | [string, string];
  value: any;
  onChange: (value: any) => void;
  onConfirm: () => void;
  onClear: () => void;
}

const ProjectFilterDropdown: React.FC<FilterDropdownProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onConfirm,
  onClear,
}) => {
  const renderInput = () => (
    <Input
      placeholder={placeholder as string}
      value={value}
      onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      onPressEnter={onConfirm}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
  );

  const renderNumberRange = () => (
    <>
      <Input
        placeholder={(placeholder as [string, string])[0]}
        value={value[0]}
        onChange={(e) => onChange([e.target.value, value[1]])}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Input
        placeholder={(placeholder as [string, string])[1]}
        value={value[1]}
        onChange={(e) => onChange([value[0], e.target.value])}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
    </>
  );

  const renderYearPicker = () => (
    <YearPicker
      placeholder={placeholder as string}
      value={value ? dayjs(value, 'YYYY') : undefined}
      onChange={(date, dateString) => onChange(dateString ? [dateString] : [])}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
  );

  const renderDateRange = () => (
    <RangePicker
      value={value && value.length === 2 ? [dayjs(value[0]), dayjs(value[1])] : undefined}
      onChange={(dates) => {
        if (dates && dates[0] && dates[1]) {
          onChange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
        } else {
          onChange([]); // Clear the filter when dates are null
        }
      }}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
      allowClear={false}
    />
  );

  return (
    <div style={{ padding: 8 }}>
      {type === 'input' && renderInput()}
      {type === 'number_range' && renderNumberRange()}
      {type === 'year' && renderYearPicker()}
      {type === 'date_range' && renderDateRange()}
      <Button
        type="primary"
        onClick={onConfirm}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        筛选
      </Button>
      <Button onClick={onClear} size="small" style={{ width: 90 }}>
        重置
      </Button>
    </div>
  );
};

export default ProjectFilterDropdown;
