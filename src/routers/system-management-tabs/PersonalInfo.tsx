import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Tag, Modal, Space, Typography, Card, Divider } from 'antd';
import { UserPublic, UsersService } from '../../client';
import { EditOutlined, LockOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const PersonalInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserPublic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const { data, error } = await UsersService.readUserMe();
    if (error) {
      message.error("获取用户信息失败：" + error);
    } else if (data) {
      setUserInfo(data);
      form.setFieldsValue(data);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      full_name: userInfo?.full_name,
      email: userInfo?.email,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!userInfo) return;

      const { data, error } = await UsersService.updateUserMe({
        body: {
          full_name: values.full_name,
          email: values.email,
        },
      });

      if (error) {
        message.error("更新用户信息失败：" + error);
      } else if (data) {
        setUserInfo({ ...userInfo, ...data });
        message.success("用户信息已更新");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      full_name: userInfo?.full_name,
      email: userInfo?.email,
    });
    setIsEditing(false);
  };

  const handlePasswordUpdate = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('新密码不匹配');
      return;
    }
    const { data, error } = await UsersService.updatePasswordMe({
      body: {
        current_password: values.oldPassword,
        new_password: values.newPassword,
      },
    });
    if (error) {
      message.error("密码更新失败：" + error.detail);
    } else if (data) {
      message.success('密码更新成功');
      setIsPasswordModalVisible(false);
      fetchUserInfo();
    }
  };

  if (!userInfo) return <div>Loading...</div>;



  return (
    <Card>
      <Form form={form} layout="horizontal" labelCol={{ span: 3 }} labelAlign="left">
          <Form.Item label="ID">
            <Text strong>{userInfo.id}</Text>
          </Form.Item>

          <Form.Item label="姓名" name="full_name">
            {isEditing ? <Input /> : <Text>{userInfo.full_name}</Text>}
          </Form.Item>

          <Form.Item label="用户名/邮箱" name="email">
            {isEditing ? <Input /> : <Text>{userInfo.email}</Text>}
          </Form.Item>

          <Form.Item label="权限">
            {userInfo.is_superuser ? (
              <Tag color="orange">管理员</Tag>
            ) : (
              <Tag color="blue">普通用户</Tag>
            )}
          </Form.Item>

          <Divider />

          <Space>
            {isEditing ? (
              <>
                <Button onClick={handleSave} type="primary">保存</Button>
                <Button onClick={handleCancel}>取消</Button>
              </>
            ) : (
              <Button icon={<EditOutlined />} onClick={handleEdit}>编辑信息</Button>
            )}
            <Button 
              icon={<LockOutlined />} 
              onClick={() => setIsPasswordModalVisible(true)}
            >
              修改密码
          </Button>
        </Space>
      </Form>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handlePasswordUpdate} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={[{ required: true, message: '请输入旧密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[{ required: true, message: '请确认新密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新密码
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PersonalInfo;
