import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  message,
  Space,
  Typography,
  Popconfirm,
  Divider,
  Popover,
} from "antd";
import {
  ContractPaymentsService,
  ContractPaymentPublicOut,
  EmployeeService,
  ReportsService,
  ProjectPublicOut,
  ProjectsService,
  ProjectPayoutPublicOut,
  ProjectPayoutsService,
} from "../client";
import { FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ContractPaymentEditModal from "./ContractPaymentEditModal";
import { downloadReport } from "../utils/ReportFileDownload";
import FloatNumberCellRender from "./FloatNumberCellRender";

interface ContractPaymentModalProps {
  visible: boolean;
  onCancel: () => void;
  projectPayoutId: number;
}

const ContractPaymentModal: React.FC<ContractPaymentModalProps> = ({
  visible,
  onCancel,
  projectPayoutId,
}) => {
  const [project, setProject] = useState<ProjectPublicOut | null>(null);
  const [projectPayout, setProjectPayout] =
    useState<ProjectPayoutPublicOut | null>(null);
  const [contractPayments, setContractPayments] = useState<
    ContractPaymentPublicOut[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<ContractPaymentPublicOut | null>(null);
  const [employeeNames, setEmployeeNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [messageApi, contextHolder] = message.useMessage();

  const fetchContractPayments = async () => {
    setLoading(true);
    try {
      const response =
        await ContractPaymentsService.getContractPaymentByProjectPayoutId({
          path: { id: projectPayoutId },
        });
      if (response.data) {
        setContractPayments(response.data.data);
        fetchEmployeeNames(response.data.data);
      } else {
        message.error("获取项目回款失败: " + response.error.detail);
      }
    } catch (error) {
      message.error("获取项目回款时发生错误: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectAndProjectPayout = async () => {
    const projectPayoutResponse = await ProjectPayoutsService.readProjectPayout(
      { path: { id: projectPayoutId } }
    );
    if (projectPayoutResponse.error) {
      message.error("获取项目回款失败: " + projectPayoutResponse.error.detail);
    }
    const projectResponse = await ProjectsService.readProject({
      path: { id: projectPayoutResponse.data!.project_id },
    });
    if (projectResponse.error) {
      message.error("获取项目失败: " + projectResponse.error.detail);
    }
    if (projectResponse.data && projectPayoutResponse.data) {
      setProject(projectResponse.data);
      setProjectPayout(projectPayoutResponse.data);
    }
  };

  const fetchEmployeeNames = async (payments: ContractPaymentPublicOut[]) => {
    const employeeIds = [...new Set(payments.map((p) => p.processed_by_id))];
    const names: { [key: number]: string } = {};
    for (const id of employeeIds) {
      try {
        const response = await EmployeeService.getEmployeeById({
          path: { id },
        });
        if (response.data) {
          names[id] = response.data.name;
        }
      } catch (error) {
        console.error(`Error fetching employee name for ID ${id}:`, error);
      }
    }
    setEmployeeNames(names);
  };

  useEffect(() => {
    if (visible) {
      fetchContractPayments();
      fetchProjectAndProjectPayout();
    }
  }, [visible, projectPayoutId]);

  const handleEdit = (payment: ContractPaymentPublicOut) => {
    setSelectedPayment(payment);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await ContractPaymentsService.deleteContractPayment({ path: { id } });
      if (response.error) {
        message.error("项目回款删除失败: " + response.error.detail);
      } else {
        message.success("项目回款删除成功");
        fetchContractPayments();
      }
    } catch (error) {
      message.error("项目回款删除失败，未知错误: " + error);
    }
  };

  const handleSinglePaymentReport = async (id: number) => {
    messageApi.open({
      key: "contract_payment_report_loading",
      type: "loading",
      content: "正在生成报告...",
      duration: 0,
    });
    const res = await ReportsService.getContractPaymentPayoutListReport({
      query: { contract_payment_id: id },
    });
    if (res.error) {
      messageApi.open({
        key: "contract_payment_report_loading",
        type: "error",
        content: "报告生成失败: " + res.error.detail,
        duration: 10,
      });
      return;
    }
    messageApi.open({
      key: "contract_payment_report_loading",
      type: "success",
      content: "报告生成成功，正在下载...",
      duration: 2,
    });
    downloadReport(res.data, res.response);
  };

  const handleProjectContractPaymentListReport = async () => {
    messageApi.open({
      key: "contract_payment_report_loading",
      type: "loading",
      content: "正在生成项目回款列表报告...",
      duration: 0,
    });
    const res = await ReportsService.getContractPaymentListReport({
      query: { project_id: project!.id },
    });
    if (res.error) {
      messageApi.open({
        key: "contract_payment_report_loading",
        type: "error",
        content: "报告生成失败: " + res.error.detail,
        duration: 10,
      });
      return;
    }
    messageApi.open({
      key: "contract_payment_report_loading",
      type: "success",
      content: "报告生成成功，正在下载...",
      duration: 2,
    });
    downloadReport(res.data, res.response);
  };

  const columns = [
    {
      title: "回款ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => id.toString(),
    },
    {
      title: "到账日期",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    { title: "回款金额", dataIndex: "amount", key: "amount", 
      render: (amount: number) => <FloatNumberCellRender value={amount} /> 
    },
    {
      title: "经办人",
      dataIndex: "processed_by_id",
      key: "processed_by_id",
      render: (id: number) => employeeNames[id] || "Unknown",
    },
    {
      title: "回款比例",
      dataIndex: "paid_ratio",
      key: "paid_ratio",
      render: (ratio: number) => `${(ratio * 100).toFixed(2)}%`,
    },
    { title: "产值下发金额", dataIndex: "payout_amount", key: "payout_amount", 
      render: (amount: number) => <FloatNumberCellRender value={amount} /> 
    },
    { title: "备注", dataIndex: "notes", key: "notes" },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record: ContractPaymentPublicOut) => (
        <Space size="middle">
          <Popover title={!dayjs(record.payment_date).isSame(dayjs(), "year") ? "无法编辑非本年度的回款" : ""}>
            <Typography.Link onClick={() => handleEdit(record)} disabled={!dayjs(record.payment_date).isSame(dayjs(), "year")}>
              编辑
            </Typography.Link>
          </Popover>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Popover title={!dayjs(record.payment_date).isSame(dayjs(), "year") ? "无法删除非本年度的回款" : ""}>
              <Typography.Link
                disabled={!dayjs(record.payment_date).isSame(dayjs(), "year")}
              >
                删除
              </Typography.Link>
            </Popover>
          </Popconfirm>
          <Typography.Link onClick={() => handleSinglePaymentReport(record.id)}>
            报告
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const handleCreateNew = () => {
    setSelectedPayment(null);
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setSelectedPayment(null);
    fetchContractPayments();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={`项目回款列表：${project?.name} `}
        open={visible}
        onCancel={onCancel}
        width={1200}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            <Button
              onClick={handleCreateNew}
              type="primary"
              icon={<PlusOutlined />}
            >
              新增回款
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={() => handleProjectContractPaymentListReport()}
              icon={<FilePdfOutlined />}
            >
              项目回款报告
            </Button>
          </Space>
          <Table
            columns={columns}
            dataSource={contractPayments}
            rowKey="id"
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </Space>
      </Modal>
      <ContractPaymentEditModal
        visible={editModalVisible}
        onCancel={handleEditModalClose}
        payment={selectedPayment}
        projectPayoutId={projectPayoutId}
        employeeName={
          selectedPayment
            ? employeeNames[selectedPayment.processed_by_id]
            : undefined
        }
      />
    </>
  );
};

export default ContractPaymentModal;
