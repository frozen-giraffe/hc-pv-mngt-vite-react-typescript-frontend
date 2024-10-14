import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Tooltip,
} from "antd";
import { UserPublic, UsersService, UserUpdate } from "../../client";
import { useAuth } from "../../context/AuthContext";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { CopyOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPublic | null>(null);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passwordInputRef = useRef<InputRef>(null);

  useEffect(() => {
    const search_current_page = searchParams.get("current_page");
    const search_page_size = searchParams.get("page_size");
    if (search_current_page) {
      setCurrentPage(parseInt(search_current_page));
    }
    if (search_page_size) {
      setPageSize(parseInt(search_page_size));
    }
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, searchParams]);

  const fetchUsers = async (page: number, size: number) => {
    const { data, error } = await UsersService.readUsers({
      query: {
        skip: (page - 1) * size,
        limit: size,
      },
    });
    if (error) {
      message.error("获取用户列表失败：" + error.detail);
    } else if (data) {
      setUsers(data.data);
      setTotalUsers(data.count);
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
        fetchUsers(currentPage, pageSize);
      }
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) {
    //   setCurrentPage(pagination.current);
      navigate(`/system-management?tab=userManagement&current_page=${pagination.current}&page_size=${pagination.pageSize}`, { replace: true });
    }
    if (pagination.pageSize) {
    //   setPageSize(pagination.pageSize);
      navigate(`/system-management?tab=userManagement&current_page=${pagination.current}&page_size=${pagination.pageSize}`, { replace: true });
    }
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
      width: 160,
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalUsers,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={`重置密码: ${editingUser?.full_name}`}
        open={isResetPasswordModalVisible}
        onOk={handleResetPasswordOk}
        onCancel={() => setIsResetPasswordModalVisible(false)}
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Space direction="vertical" size={16}>
          <Typography.Text>
            用户 {editingUser?.email} 的密码已重置，请复制下方新密码并发送给用户。
            <Typography.Text type="warning">此密码只会显示一次。</Typography.Text>
          </Typography.Text>
          <Space.Compact style={{ width: "100%" }}>
            <Input variant="filled" ref={passwordInputRef} value={newPassword} size="large" style={{fontFamily: "monospace"}} onClick={() => passwordInputRef.current?.focus({cursor: "all"})}/>
            <Tooltip title="复制密码">
              <Button 
                size="large"
                onClick={() => {
                  copyToClipboard(newPassword)
                    .then(() => message.success('密码已复制到剪贴板'))
                    .catch(() => {
                      message.error('复制密码失败，请手动复制');
                      passwordInputRef.current?.focus({cursor: "all"});
                    });
                  }}
                >
                <CopyOutlined />
              </Button>
            </Tooltip>
          </Space.Compact>
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
