import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Form,
  message,
  Typography,
  Popconfirm,
  Tooltip,
  Collapse,
  Divider,
  Alert,
  Space,
  Tag,
} from "antd";
import {
  DepartmentPayoutRatioPublicOut,
  DepartmentPayoutRatiosService,
  ProjectClassesService,
  ProjectRateAdjustmentClassesService,
} from "../../client";
import { InfoCircleOutlined } from "@ant-design/icons";
import InputDirectPercent from "../../components/InputDirectPercent";
import { useForm } from "antd/es/form/Form";

interface ProjectClass {
  id: number;
  name: string;
}

interface ProjectRateAdjustmentClass {
  id: number;
  name: string;
}

interface DepartmentPayoutRatioWithNames
  extends DepartmentPayoutRatioPublicOut {
  project_class_name: string;
  project_rate_adjustment_class_name: string;
}

const DepartmentPayoutRatioSettings: React.FC = () => {
  const [ratios, setRatios] = useState<DepartmentPayoutRatioWithNames[]>([]);
  const [, setProjectClasses] = useState<ProjectClass[]>([]);
  const [, setProjectRateAdjustmentClasses] = useState<
    ProjectRateAdjustmentClass[]
  >([]);
  const [editForm] = useForm();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [currentSum, setCurrentSum] = useState<number>(0);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [
        ratiosResponse,
        projectClassesResponse,
        projectRateAdjustmentClassesResponse,
      ] = await Promise.all([
        DepartmentPayoutRatiosService.readDepartmentPayoutRatios(),
        ProjectClassesService.readProjectClasses(),
        ProjectRateAdjustmentClassesService.readProjectRateAdjustmentClasses(),
      ]);

      if (ratiosResponse.error) {
        message.error("获取部门产值系数失败: " + ratiosResponse.error.detail);
        return;
      }
      if (projectClassesResponse.error) {
        message.error("获取工程等级失败: " + projectClassesResponse.error.detail);
        return;
      }
      if (projectRateAdjustmentClassesResponse.error) {
        message.error("获取系数调整级别失败: " + projectRateAdjustmentClassesResponse.error.detail);
        return;
      }

      setProjectClasses(projectClassesResponse.data.data);
      setProjectRateAdjustmentClasses(
        projectRateAdjustmentClassesResponse.data.data
      );

      const ratiosWithNames = ratiosResponse.data.data.map((ratio: DepartmentPayoutRatioPublicOut) => ({
        ...ratio,
        project_class_name:
          projectClassesResponse.data.data.find(
            (pc) => pc.id === ratio.project_class_id
          )?.name || "",
        project_rate_adjustment_class_name:
          projectRateAdjustmentClassesResponse.data.data.find(
            (prac) => prac.id === ratio.project_rate_adjustment_class_id
          )?.name || "",
      }));

      ratiosWithNames.sort((a, b) =>
        a.project_class_id == b.project_class_id
          ? a.project_rate_adjustment_class_id -
            b.project_rate_adjustment_class_id
          : a.project_class_id - b.project_class_id
      );

      setRatios(ratiosWithNames);
    } catch (error) {
      message.error("Failed to fetch data: " + error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEditing = useCallback(
    (record: DepartmentPayoutRatioWithNames) => record.id === editingKey,
    [editingKey]
  );

  const calculateSum = useCallback((values: Record<string, number | null>) => {
    const sum = [
      "arch_ratio",
      "struct_ratio",
      "plumbing_ratio",
      "electrical_ratio",
      "hvac_ratio",
      "low_voltage_ratio",
    ].reduce((acc, key) => acc + (values[key] || 0), 0);
    setCurrentSum(sum);
  }, []);

  const edit = useCallback(
    (record: DepartmentPayoutRatioWithNames) => {
      const recordAsRecord: Record<string, number | null> = {
        arch_ratio: record.arch_ratio,
        struct_ratio: record.struct_ratio,
        plumbing_ratio: record.plumbing_ratio,
        electrical_ratio: record.electrical_ratio,
        hvac_ratio: record.hvac_ratio,
        low_voltage_ratio: record.low_voltage_ratio,
      };
      editForm.setFieldsValue({ ...record });
      setEditingKey(record.id);
      calculateSum(recordAsRecord);
      setIsFormDirty(false); // Reset form dirty state when entering edit mode
    },
    [calculateSum, editForm]
  );

  const cancel = useCallback(() => {
    setEditingKey(null);
    setCurrentSum(0);
    setIsFormDirty(false); // Reset form dirty state when canceling
  }, []);

  const handleUpdate = useCallback(
    async (record: DepartmentPayoutRatioWithNames) => {
      try {
        const { error } = await DepartmentPayoutRatiosService.updateDepartmentPayoutRatioById({
          path: {
            id: record.id,
          },
          body: {
            project_class_id: record.project_class_id,
            project_rate_adjustment_class_id:
              record.project_rate_adjustment_class_id,
            pm_ratio: record.pm_ratio,
            arch_ratio: record.arch_ratio,
            struct_ratio: record.struct_ratio,
            plumbing_ratio: record.plumbing_ratio,
            electrical_ratio: record.electrical_ratio,
            hvac_ratio: record.hvac_ratio,
            low_voltage_ratio: record.low_voltage_ratio,
          },
        });
        if (error) {
          message.error("更新失败: " + error.detail);
        } else {
          message.success("更新成功");
        }
        fetchData();
      } catch (error) {
        message.error("更新失败，未知错误: " + error);
      }
    },
    [fetchData]
  );
  const save = useCallback(
    async (key: React.Key) => {
      try {
        const row = await editForm.validateFields();
        const newData = [...ratios];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          const item = newData[index];
          await handleUpdate({ ...item, ...row });
          setEditingKey(null);
          setCurrentSum(0);
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    },
    [ratios, editForm, handleUpdate]
  );

  const handleNew = useCallback((record: DepartmentPayoutRatioWithNames) => {
    message.warning("创建功能尚未实现");
    console.log(record);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "工程等级",
        dataIndex: "project_class_name",
        key: "project_class_name",
        fixed: "left" as const,
        width: 80,
      },
      {
        title: "系数调整级别",
        dataIndex: "project_rate_adjustment_class_name",
        key: "project_rate_adjustment_class_name",
        fixed: "left" as const,
        width: 140,
      },
      {
        title: "项目管理",
        dataIndex: "pm_ratio",
        key: "pm_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "建筑",
        dataIndex: "arch_ratio",
        key: "arch_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "结构",
        dataIndex: "struct_ratio",
        key: "struct_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "给排水",
        dataIndex: "plumbing_ratio",
        key: "plumbing_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "电气",
        dataIndex: "electrical_ratio",
        key: "electrical_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "暖通",
        dataIndex: "hvac_ratio",
        key: "hvac_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "弱电",
        dataIndex: "low_voltage_ratio",
        key: "low_voltage_ratio",
        editable: true,
        render: (value: number | null) =>
          value !== null ? `${value.toFixed(2)}%` : "",
      },
      {
        title: "操作",
        key: "action",
        fixed: "right" as const,
        width: 120,
        render: (
          _: React.ReactNode,
          record: DepartmentPayoutRatioWithNames
        ) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Tooltip
                title={
                  Math.abs(currentSum - 100) > 0.01
                    ? `部门间工比总和不为100%，当前总和为${currentSum.toFixed(
                        2
                      )}%`
                    : !isFormDirty ? "未修改数据" : ""
                }
              >
                <Popconfirm
                  title="确定要保存更改吗？"
                  onConfirm={() => save(record.id)}
                  okText="确定"
                  cancelText="取消"
                  disabled={Math.abs(currentSum - 100) > 0.01 || !isFormDirty}
                >
                  <Typography.Link
                    style={{ marginRight: 8 }}
                    disabled={Math.abs(currentSum - 100) > 0.01 || !isFormDirty}
                  >
                    保存
                  </Typography.Link>
                </Popconfirm>
              </Tooltip>
              {isFormDirty ? (
                <Popconfirm
                  title="当前编辑的数据将会丢失，确定？"
                  onConfirm={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Typography.Link>取消</Typography.Link>
                </Popconfirm>
              ) : (
                <Typography.Link onClick={cancel}>取消</Typography.Link>
              )}
            </span>
          ) : (
            <span>
              {record.id === 0 ? (
                <Typography.Link onClick={() => handleNew(record)}>
                  创建
                </Typography.Link>
              ) : (
                <Typography.Link
                  disabled={editingKey !== null}
                  onClick={() => edit(record)}
                >
                  编辑
                </Typography.Link>
              )}
            </span>
          );
        },
      },
    ],
    [isEditing, currentSum, save, cancel, handleNew, edit, editingKey, isFormDirty]
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: DepartmentPayoutRatioWithNames) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      }),
    [columns, isEditing]
  );

  interface EditableCellProps {
    editing: boolean;
    dataIndex: string;
    title: string;
    children: React.ReactNode;
    record: DepartmentPayoutRatioWithNames;
  }

  const EditableCell: React.FC<EditableCellProps> = useCallback(
    ({ editing, dataIndex, title, children, ...restProps }) => {
      const handlePercentChange = (value: number | null) => {
        const currentValues = editForm.getFieldsValue();
        currentValues[dataIndex] = value;
        calculateSum(currentValues);
        setIsFormDirty(true); // Set form as dirty when a change is made
      };

      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ]}
            >
              <InputDirectPercent
                step={0.5}
                min={0}
                max={100}
                onChange={(value: number | string | null) => {
                  if (typeof value === "number") {
                    handlePercentChange(value);
                  }
                }}
                style={{ width: "100px" }}
              />
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    },
    [editForm, calculateSum]
  );

  return (
    <div style={{ maxWidth: "1300px" }}>
      <h2>
        专业产值系数
        <Tooltip title="根据工程等级和系数调整级别指定的各专业的产值分配比例，用来自动化产值计算。当前不支持添加表内没有的工程类别和系数调整级别的专业产值系数。">
          <InfoCircleOutlined
            style={{ marginLeft: "8px", cursor: "pointer" }}
          />
        </Tooltip>
      </h2>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Alert
          message="修改此处的预设不会影响已计算的产值数据。"
          type="info"
          showIcon
        />
        <Collapse
          bordered={false}
          items={[
            {
              key: "1",
              label: (
                <>
                  <InfoCircleOutlined
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <span>产值计算方法</span>
                </>
              ),
              children: (
                <>
                  <p>
                    <Tag color="blue">项目负责人总产值</Tag> ={" "}
                    <Tag color="green">下发产值</Tag> × 项目管理系数
                  </p>
                  <p>
                    <Tag color="orange">总专业产值</Tag> ={" "}
                    <Tag color="green">下发产值</Tag> -{" "}
                    <Tag color="blue">项目负责人产值</Tag>
                  </p>
                  <p>
                    各<Tag color="cyan">专业产值</Tag> ={" "}
                    <Tag color="orange">总专业产值</Tag> × 相应专业系数
                  </p>
                  <p>
                    <Tag color="red">100%</Tag> = 建筑系数 + 结构系数 + 给排水系数 + 电气系数 +
                    暖通系数 + 弱电系数
                  </p>
                </>
              ),
            },
          ]}
        />
      </Space>
      <Divider />
      <Form form={editForm} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={ratios}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          rowKey={(record) =>
            `${record.project_class_id}-${record.project_rate_adjustment_class_id}`
          }
          scroll={{ x: "max-content", y: "max(calc(100vh - 570px), 300px)" }}
          size="small"
        />
      </Form>
    </div>
  );
};

export default React.memo(DepartmentPayoutRatioSettings);
