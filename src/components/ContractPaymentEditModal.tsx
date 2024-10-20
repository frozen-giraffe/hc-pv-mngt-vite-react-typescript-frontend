import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, message } from 'antd';
import { ContractPaymentsService, ContractPaymentPublicOut, EmployeeService } from '../client';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';

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
  const [isCurrentYear, setIsCurrentYear] = useState(false);
  const [isConfirmNotCurrentYearModalVisible, setIsConfirmNotCurrentYearModalVisible] = useState(false);

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

  const handleSearch = useCallback(async (value: string) => {
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
  }, []);

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  const handleUpdateOrCreate = async () => {
    try {
      const values = await form.validateFields();
      const paymentData = {
        ...values,
        payment_date: values.payment_date.format('YYYY-MM-DD'),
        project_payout_id: projectPayoutId,
      };
      console.log('submit data');
      console.log(paymentData);

      if (payment) {
        await ContractPaymentsService.updateContractPayment({
          path: { id: payment.id },
          body: paymentData,
        });
      } else {
        const res = await ContractPaymentsService.createContractPayment({
          body: paymentData,
        });
        if (res.error) {
          message.error('项目回款创建失败：' + res.error.detail);
          console.log(res.error);
          console.log(paymentData);
          return;
        } else {
          message.success('项目回款创建成功');
        }
      }
      onCancel();
      setEmployees([]);
    } catch (error) {
      console.error('Error saving contract payment:', error);
      message.error('项目回款保存失败：' + error);
    }
  };

  const onFormValuesChange = useCallback(() => {
    // Use a timeout to allow the form to update its internal state
    console.log(form.getFieldsValue());
    setTimeout(() => {
      form.validateFields({ validateOnly: true })
        .then(() => {
          setFormIsValid(true);
          console.log('form is valid');
        })
        .catch((errors) => {
          setFormIsValid(false);
          console.log('form is invalid', errors);
        });
    }, 0);
  }, [form]);

  const handleOk = () => {
    if (!isCurrentYear) {
      setIsConfirmNotCurrentYearModalVisible(true);
    } else {
      handleUpdateOrCreate();
    }
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
            <DatePicker style={{ width: '100%' }} placeholder="请选择回款日期" onChange={(value) => setIsCurrentYear(value?.year() === dayjs().year())} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="回款金额"
            rules={[{ required: true, message: '请填写回款金额' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请填写回款金额"/>
          </Form.Item>
          <Form.Item
            name="processed_by_id"
            label="经办人"
            rules={[{ required: true, message: '请选择经办人' }]}
          >
            <Select
              showSearch
              placeholder="搜索员工"
              onSearch={debouncedHandleSearch}
              filterOption={false}
              // labelInValue
            >
              {employees.map(employee => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="备注" rules={[{ required: false }]}>
            <Input.TextArea placeholder="选填" />
          </Form.Item>
        </Form>
      )}
      <Modal 
        open={isConfirmNotCurrentYearModalVisible} 
        onCancel={() => setIsConfirmNotCurrentYearModalVisible(false)} 
        onOk={handleUpdateOrCreate} 
        title="确认提交？" 
        okText="确认提交" 
        cancelText="返回修改" 
        closable={false}
      >
        <p>输入的回款日期不在本年，保存后将无法编辑或删除。是否提交？</p>
      </Modal>
    </Modal>
  );
};

export default ContractPaymentEditModal;
