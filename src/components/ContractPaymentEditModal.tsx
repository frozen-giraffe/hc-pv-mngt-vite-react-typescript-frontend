import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, message } from 'antd';
import { ContractPaymentsService, ContractPaymentPublicOut, EmployeeService } from '../client';
import dayjs from 'dayjs';

interface ContractPaymentEditModalProps {
  visible: boolean;
  onCancel: () => void;
  payment: ContractPaymentPublicOut | null;
  projectPayoutId: number;
  employeeName?: string;
}

const ContractPaymentEditModal: React.FC<ContractPaymentEditModalProps> = ({
  visible,
  onCancel,
  payment,
  projectPayoutId,
  employeeName,
}) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (visible) {
      if (payment) {
        form.setFieldsValue({
          ...payment,
          payment_date: dayjs(payment.payment_date),
          processed_by_id: { value: payment.processed_by_id, label: employeeName || 'Unknown' },
        });
      } else {
        form.resetFields();
      }
      // Trigger form validation when modal becomes visible
      form.validateFields().then(() => setFormIsValid(true)).catch(() => setFormIsValid(false));
    }
  }, [visible, payment, form, employeeName]);

  const handleSearch = async (value: string) => {
    if (value) {
      try {
        const response = await EmployeeService.searchEmployee({
          path: { query: value },
        });
        if (response.data) {
          setEmployees(response.data.data.map(e => ({ id: e.id, name: e.name })));
        }
      } catch (error) {
        console.error('Error searching employees:', error);
      }
    } else {
      setEmployees([]);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const paymentData = {
        ...values,
        payment_date: values.payment_date.format('YYYY-MM-DD'),
        processed_by_id: values.processed_by_id.value,
        project_payout_id: projectPayoutId,
      };

      if (payment) {
        await ContractPaymentsService.updateContractPayment({
          path: { id: payment.id },
          body: paymentData,
        });
      } else {
        await ContractPaymentsService.createContractPayment({
          body: paymentData,
        });
        message.success('项目回款创建成功');
      }
      onCancel();
    } catch (error) {
      console.error('Error saving contract payment:', error);
      message.error('项目回款保存失败：' + error);
    }
  };

  const onFormValuesChange = () => {
    form.validateFields().then(() => setFormIsValid(true)).catch(() => setFormIsValid(false));
  };

  return (
    <Modal
      title={payment ? '编辑项目回款' : '新建项目回款'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ disabled: !formIsValid }}
    >
      {visible && (
        <Form form={form} layout="vertical" onValuesChange={onFormValuesChange}>
          <Form.Item
            name="payment_date"
            label="回款日期"
            rules={[{ required: true, message: '请填写回款日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择回款日期" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="回款金额"
            rules={[{ required: true, message: '请填写回款金额' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请填写回款金额" />
          </Form.Item>
          <Form.Item
            name="processed_by_id"
            label="经办人"
            rules={[{ required: true, message: '请选择经办人' }]}
          >
            <Select
              showSearch
              placeholder="搜索员工"
              onSearch={handleSearch}
              filterOption={false}
              labelInValue
            >
              {employees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea placeholder="请填写备注" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ContractPaymentEditModal;