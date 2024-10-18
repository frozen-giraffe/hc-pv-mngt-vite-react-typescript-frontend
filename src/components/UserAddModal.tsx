import React from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { UserCreate, UsersService } from '../client';

interface UserAddModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserAddModal: React.FC<UserAddModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newUser: UserCreate = {
        email: values.email,
        full_name: values.full_name,
        password: values.password,
        is_superuser: values.is_superuser,
        is_active: values.is_active,
      };

      const { data, error } = await UsersService.createUser({ body: newUser });
      if (error) {
        message.error('创建用户失败：' + error.detail);
      } else if (data) {
        message.success('用户创建成功');
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue('password');
    if (value && value !== password) {
      return Promise.reject('两次输入的密码不一致');
    }
    return Promise.resolve();
  };

  const preventCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    message.warning('不允许复制密码');
  };

  return (
    <Modal
      title="添加用户"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="full_name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }, { min: 8, message: '密码至少需要8个字符' }]}
        >
          <Input.Password onCopy={preventCopy} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          rules={[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword }
          ]}
        >
          <Input.Password 
            onBlur={() => form.validateFields(['confirmPassword'])} 
            onCopy={preventCopy}
          />
        </Form.Item>
        <Form.Item name="is_superuser" label="管理员" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="is_active" label="可以登录" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAddModal;
