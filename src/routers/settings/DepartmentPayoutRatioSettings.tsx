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
} from "antd";
import {
  ApiError,
  DepartmentPayoutRatioPublicOut,
  DepartmentPayoutRatiosService,
  ProjectClassesService,
  ProjectRateAdjustmentClassesService,
} from "../../client";
import { InfoCircleOutlined } from "@ant-design/icons";
import InputDirectPercent from "../../components/InputDirectPercent";

interface ProjectClass {
  id: number;
  name: string;
}

interface ProjectRateAdjustmentClass {
  id: number;
  name: string;
}

interface DepartmentPayoutRatioWithNames extends DepartmentPayoutRatioPublicOut {
  project_class_name: string;
  project_rate_adjustment_class_name: string;
}

const DepartmentPayoutRatioSettings: React.FC = () => {
  const [ratios, setRatios] = useState<DepartmentPayoutRatioWithNames[]>([]);
  const [, setProjectClasses] = useState<ProjectClass[]>([]);
  const [, setProjectRateAdjustmentClasses] = useState<ProjectRateAdjustmentClass[]>([]);
  const [editForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [currentSum, setCurrentSum] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      const [ratiosResponse, projectClassesResponse, projectRateAdjustmentClassesResponse] = await Promise.all([
        DepartmentPayoutRatiosService.readDepartmentPayoutRatios(),
        ProjectClassesService.readProjectClasses(),
        ProjectRateAdjustmentClassesService.readProjectRateAdjustmentClasses(),
      ]);

      setProjectClasses(projectClassesResponse.data);
      setProjectRateAdjustmentClasses(projectRateAdjustmentClassesResponse.data);

      const ratiosWithNames = ratiosResponse.data.map(ratio => ({
        ...ratio,
        project_class_name: projectClassesResponse.data.find(pc => pc.id === ratio.project_class_id)?.name || '',
        project_rate_adjustment_class_name: projectRateAdjustmentClassesResponse.data.find(prac => prac.id === ratio.project_rate_adjustment_class_id)?.name || '',
      }));

      ratiosWithNames.sort((a, b) => a.project_class_id == b.project_class_id ? a.project_rate_adjustment_class_id - b.project_rate_adjustment_class_id : a.project_class_id - b.project_class_id);
      
      setRatios(ratiosWithNames);

    } catch (error) {
      message.error("Failed to fetch data: " + error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEditing = useCallback((record: DepartmentPayoutRatioWithNames) => record.id === editingKey, [editingKey]);

  const calculateSum = useCallback((values: Record<string, number | null>) => {
    const sum = [
      'arch_ratio',
      'struct_ratio',
      'plumbing_ratio',
      'electrical_ratio',
      'hvac_ratio',
      'low_voltage_ratio'
    ].reduce((acc, key) => acc + (values[key] || 0), 0);
    setCurrentSum(sum);
  }, []);

  
  const edit = useCallback((record: DepartmentPayoutRatioWithNames) => {
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
  }, [calculateSum, editForm]);

  const cancel = useCallback(() => {
    setEditingKey(null);
    setCurrentSum(0);
  }, []);

  const handleUpdate = useCallback(async (record: DepartmentPayoutRatioWithNames) => {
    try {
      await DepartmentPayoutRatiosService.updateDepartmentPayoutRatioById({
        id: record.id,
        requestBody: {
          project_class_id: record.project_class_id,
          project_rate_adjustment_class_id: record.project_rate_adjustment_class_id,
          pm_ratio: record.pm_ratio,
          arch_ratio: record.arch_ratio,
          struct_ratio: record.struct_ratio,
          plumbing_ratio: record.plumbing_ratio,
          electrical_ratio: record.electrical_ratio,
          hvac_ratio: record.hvac_ratio,
          low_voltage_ratio: record.low_voltage_ratio,
        },
      });
      message.success("更新成功");
      fetchData();
    } catch (error) {
      if (error instanceof ApiError) {
        message.error("更新失败: " + error.message);
      } else {
        message.error("更新失败: 未知错误");
      }
    }
  }, [fetchData]);
  const save = useCallback(async (key: React.Key) => {
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
  }, [ratios, editForm, handleUpdate]);


  const handleNew = useCallback((record: DepartmentPayoutRatioWithNames) => {
    message.warning("创建功能尚未实现");
    console.log(record);
  }, []);

  const columns = useMemo(() => [
    {
      title: "工程等级",
      dataIndex: "project_class_name",
      key: "project_class_name",
      fixed: 'left' as const,
      width: 110,
    },
    {
      title: "系数调整级别",
      dataIndex: "project_rate_adjustment_class_name",
      key: "project_rate_adjustment_class_name",
      fixed: 'left' as const,
      width: 140,
    },
    {
      title: "项目管理",
      dataIndex: "pm_ratio",
      key: "pm_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${value.toFixed(2)}%` : '',
    },
    {
      title: "建筑",
      dataIndex: "arch_ratio",
      key: "arch_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "结构",
      dataIndex: "struct_ratio",
      key: "struct_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "给排水",
      dataIndex: "plumbing_ratio",
      key: "plumbing_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "电气",
      dataIndex: "electrical_ratio",
      key: "electrical_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "暖通",
      dataIndex: "hvac_ratio",
      key: "hvac_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "弱电",
      dataIndex: "low_voltage_ratio",
      key: "low_voltage_ratio",
      editable: true,
      render: (value: number | null) => value !== null ? `${(value).toFixed(2)}%` : '',
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right' as const,
      width: 120,
      render: (_: React.ReactNode, record: DepartmentPayoutRatioWithNames) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Tooltip title={Math.abs(currentSum - 100) > 0.01 ? `部门间工比总和不为100%，当前总和为${currentSum.toFixed(2)}%` : ''}>
              <Popconfirm
                title="确定要保存更改吗？"
                onConfirm={() => save(record.id)}
                okText="确定"
                cancelText="取消"
                disabled={Math.abs(currentSum - 100) > 0.01}
              >
                <Typography.Link style={{ marginRight: 8 }} disabled={Math.abs(currentSum - 100) > 0.01}>
                  保存
                </Typography.Link>
              </Popconfirm>
            </Tooltip>
            <Popconfirm
              title="当前编辑的数据将会丢失，确定？"
              onConfirm={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Typography.Link>取消</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <span>
            {record.id === 0 ? (
              <Typography.Link onClick={() => handleNew(record)}>
                创建
              </Typography.Link>
            ) : (
              <Typography.Link disabled={editingKey !== null} onClick={() => edit(record)}>
                编辑
              </Typography.Link>
            )}
          </span>
        );
      },
    },
  ], [isEditing, currentSum, save, cancel, handleNew, edit, editingKey]);

  const mergedColumns = useMemo(() => columns.map((col) => {
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
  }), [columns, isEditing]);

  interface EditableCellProps {
    editing: boolean;
    dataIndex: string;
    title: string;
    children: React.ReactNode;
    record: DepartmentPayoutRatioWithNames;
  }

  const EditableCell: React.FC<EditableCellProps> = useCallback(({
    editing,
    dataIndex,
    title,
    children,
    ...restProps
  }) => {
    const handlePercentChange = (value: number | null) => {
      const currentValues = editForm.getFieldsValue();
      currentValues[dataIndex] = value;
      calculateSum(currentValues);
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
                if (typeof value === 'number') {
                  handlePercentChange(value);
                }
              }}
              style={{ width: '100px' }}
            />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }, [editForm, calculateSum]);

  return (
    <div>
      <h2>
        专业产值系数
        <Tooltip title="根据工程等级和系数调整级别指定的各专业的产值分配比例，用来自动化产值计算。当前不支持添加表内没有的工程类别和系数调整级别的专业产值系数。">
          <InfoCircleOutlined style={{ marginLeft: "8px", cursor: "pointer" }} />
        </Tooltip>
      </h2>
      <Alert message="修改此处的预设不会影响已计算的产值数据。" type="info" showIcon/>
      <Collapse
        bordered={false}
        items={[
          {
            key: '1',
            label: (
              <>
                <InfoCircleOutlined style={{ marginRight: "8px", cursor: "pointer" }} />
                <span>产值计算方法</span>
              </>
            ),
            children: (
              <>
                <p>项目负责人产值 = 下发产值 × 项目管理系数</p>
                <p>总专业产值 = 下发产值 - 项目负责人产值</p>
                <p>建筑产值 = 专业产值 × 建筑系数</p>
                <p>...</p>
                <p>100% = 建筑系数 + 结构系数 + 给排水系数 + 电气系数 + 暖通系数 + 弱电系数</p>
              </>
            ),
          },
        ]}
      />
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
          rowKey={(record) => `${record.project_class_id}-${record.project_rate_adjustment_class_id}`}
          scroll={{ x: 'max-content', y: 'max(calc(100vh - 520px), 300px)' }}
          style={{ minHeight: '300px' }}
        />
      </Form>
    </div>
  );
};

export default React.memo(DepartmentPayoutRatioSettings);