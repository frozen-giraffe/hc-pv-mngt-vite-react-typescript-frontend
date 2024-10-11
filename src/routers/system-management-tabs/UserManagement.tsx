import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Select,
  Typography,
  Switch,
  Popconfirm,
} from "antd";
import { UserPublic, UsersService, UserUpdate } from "../../client";
import { useAuth } from "../../context/AuthContext";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { ColumnsType } from "antd/es/table";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPublic | null>(null);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Fetch users from API
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await UsersService.readUsers();
    if (error) {
      message.error("获取用户列表失败：" + error.detail);
    } else if (data) {
      setUsers(data.data);
    }
  };

  const handleEdit = (selectedUser: UserPublic) => {
    setEditingUser(selectedUser);
    form.setFieldsValue(selectedUser);
    setIsModalVisible(true);
  };

  const handleDelete = (userId: number) => {
    // Implement delete logic
    message.error(`删除用户ID ${userId} 失败：功能未启用。`);
  };

  const handleResetPassword = (selectedUser: UserPublic) => {
    setEditingUser(selectedUser);
    UsersService.adminResetPassword({
      path: { user_id: selectedUser.id },
    }).then((res) => {
      if (res.error) {
        message.error("重置密码失败：" + res.error.detail);
      } else if (res.data) {
        message.success("重置密码成功");
        setNewPassword(res.data.message);
      }
    });
    setIsResetPasswordModalVisible(true);
  };

  const handleResetPasswordOk = () => {
    setNewPassword("");
    setIsResetPasswordModalVisible(false);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      if (!editingUser?.id) {
        message.error("表单错误，请联系管理员");
        return;
      }
      const {data, error} = await UsersService.updateUser({
        path: { user_id: editingUser?.id },
        body: values as UserUpdate,
      });
      if (error) {
        message.error("更新用户信息失败：" + error.detail);
      } else if (data) {
        message.success("用户信息已更新");
        setIsModalVisible(false);
        fetchUsers();
      }
    });
  };

  const columns: ColumnsType<UserPublic> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "用户名/邮箱",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email: string) => (
        <Typography.Link href={`mailto:${email}`}>{email}</Typography.Link>
      ),
    },
    { title: "姓名", dataIndex: "full_name", key: "full_name" },
    {
      title: "权限",
      dataIndex: "is_superuser",
      key: "is_superuser",
      render: (isSuperuser: boolean) =>
        isSuperuser ? (
          <Tag color="orange">管理员</Tag>
        ) : (
          <Tag color="blue">普通用户</Tag>
        ),
    },
    {
      title: "状态",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">活跃</Tag>
        ) : (
          <Tag color="red">已停用</Tag>
        ),
    },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (record: UserPublic) =>
        user?.id === record.id ? (
          <Tag color="cyan">当前用户</Tag>
        ) : (
          <Space>
            <Typography.Link onClick={() => handleEdit(record)}>
              编辑
            </Typography.Link>
            <Popconfirm
              title="确定删除该用户吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
            <Popconfirm
              title="确定重置该用户密码吗？"
              onConfirm={() => handleResetPassword(record)}
            >
              <Typography.Link>重置密码</Typography.Link>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
      />
      <Modal
        title={`重置密码: ${editingUser?.full_name}`}
        open={isResetPasswordModalVisible}
        onOk={handleResetPasswordOk}
        onCancel={() => setIsResetPasswordModalVisible(false)}
      >
        <Space direction="vertical" size={16}>
          <Typography.Text>
            用户 {editingUser?.email}{" "}
            的密码已重置，请复制下发新密码并发送给用户。此密码只会显示一次。
          </Typography.Text>
          <Space style={{ width: "100%" }}>
            <Input value={newPassword} disabled={true} size="large" />
            <Button 
              type="primary" 
              onClick={() => {
                copyToClipboard(newPassword)
                  .then(() => message.success('密码已复制到剪贴板'))
                  .catch(() => message.error('复制密码失败'));
              }}
            >
              复制
            </Button>
          </Space>
        </Space>
      </Modal>
      <Modal
        title={`编辑用户: ${editingUser?.full_name}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="full_name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="用户名"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="is_superuser"
            label="权限"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={true}>管理员</Select.Option>
              <Select.Option value={false}>普通用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="is_active" label="状态" rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
