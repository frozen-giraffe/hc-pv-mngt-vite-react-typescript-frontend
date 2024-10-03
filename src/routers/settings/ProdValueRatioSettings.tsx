import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Typography,
  Popconfirm,
  InputNumber,
  Tag,
  Tooltip,
  Alert,
  Divider,
} from "antd";
import {
  ApiError,
  ProdValueCalcRatioCreateIn,
  ProdValueCalcRatioPublicOut,
  ProdValueCalcRatiosService,
  ProdValueCalcRatioUpdateIn,
} from "../../client";
import { InfoCircleOutlined } from "@ant-design/icons";
import InputFloatPercent from "../../components/InputFloatPercent";

const ProdValueRatioSettings: React.FC = () => {
  const [ratios, setRatios] = useState<ProdValueCalcRatioPublicOut[]>([]);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    fetchRatios();
  }, []);

  const fetchRatios = async () => {
    try {
      const data =
        await ProdValueCalcRatiosService.readProdValueCalcRatios().then(
          (res) => res.data
        );
      data.sort((a, b) => a.id - b.id);
      
      // // Add 20 fake data entries for testing
      // const fakeData = Array.from({ length: 20 }, (_, index) => ({
      //   id: data.length + index + 1,
      //   name: `Fake Ratio ${index + 1}`,
      //   ratio: Math.random().toFixed(2),
      //   default: false,
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString(),
      // }));
      // const combinedData = [...data, ...fakeData.map(item => ({
      //   ...item,
      //   ratio: parseFloat(item.ratio)
      // }))];
      // setRatios(combinedData);
      setRatios(data);
    } catch (error) {
      message.error("Failed to fetch ratios:" + (error instanceof Error ? error.message : String(error)));
    }
  };

  const isEditing = (record: ProdValueCalcRatioPublicOut) =>
    record.id.toString() === editingKey;

  const edit = (record: ProdValueCalcRatioPublicOut) => {
    editForm.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = await editForm.validateFields();
      const newData = [...ratios];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        await handleUpdate({ ...item, ...row });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleUpdate = async (record: ProdValueCalcRatioPublicOut) => {
    try {
      const updateData: ProdValueCalcRatioUpdateIn = {
        ...record,
        ratio: record.ratio,
        default: record.default,
      };
      await ProdValueCalcRatiosService.updateProdValueCalcRatio({
        id: record.id,
        requestBody: updateData,
      });
      message.success("更新成功");
      fetchRatios();
    } catch (error) {
      if (error instanceof ApiError) {
        message.error("更新失败: " + error.message);
      } else {
        message.error("更新失败: 未知错误");
      }
    }
  };

  const handleSetDefault = async (record: ProdValueCalcRatioPublicOut) => {
    await handleUpdate({ ...record, default: true });
  };

  const handleAdd = async (values: ProdValueCalcRatioCreateIn) => {
    try {
      await ProdValueCalcRatiosService.createProdValueCalcRatio({
        requestBody: {
          ...values,
          ratio: values.ratio,
        },
      });
      message.success("添加成功");
      addForm.resetFields();
      fetchRatios();
    } catch (error) {
      message.error("添加失败:" + error);
    }
  };

  const columns = [
    {
      title: "合同产值名称",
      dataIndex: "name",
      key: "name",
      width: '30%',
      editable: true,
      render: (text: string, record: ProdValueCalcRatioPublicOut) => (
        <span>
          {text}
          {record.default && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              默认
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "合同产值比",
      dataIndex: "ratio",
      key: "ratio",
      width: '40%',
      editable: true,
      render: (value: number) => (
        <span>
          {(value * 100).toFixed(2)}%
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right' as const,
      width: 140,
      render: (_: React.ReactNode, record: ProdValueCalcRatioPublicOut) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="确定取消？" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              编辑
            </Typography.Link>
            {!record.default && (
              <Typography.Link
                onClick={() => handleSetDefault(record)}
                style={{ marginRight: 8 }}
              >
                设为默认
              </Typography.Link>
            )}
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ProdValueCalcRatioPublicOut) => ({
        record,
        inputType: col.dataIndex === "ratio" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: "number" | "text";
    record: ProdValueCalcRatioPublicOut;
    index: number;
  }

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? (
      <InputFloatPercent step={0.005} min={0} max={1} />
    ) : (
      <Input />
    );
  
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  
  return (
    <div>
      <h2>
        合同/下发产值系数
        <Tooltip title="合同产值与下发产值的预设，展示在下发产值栏下方供快速计算。">
          <InfoCircleOutlined
            style={{ marginLeft: "8px", cursor: "pointer" }}
          />
        </Tooltip>
      </h2>
      <Alert message="修改此处的预设不会影响已计算的产值数据。" type="info" showIcon/>
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
          rowKey="id"
          scroll={{ x: 'max-content', y: 'calc(100vh - 600px)' }}
        />
      </Form>
      <h3>添加新系数</h3>
      <Form form={addForm} onFinish={handleAdd} layout="inline">
        <Form.Item
          name="name"
          rules={[{ required: true, message: "请输入合同产值名称" }]}
        >
          <Input placeholder="合同产值名称" />
        </Form.Item>
        <Form.Item
          name="ratio"
          rules={[{ required: true, message: "请输入合同产值比" }]}
        >
          <InputNumber addonAfter="%" step={0.1} placeholder="合同产值比" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProdValueRatioSettings;
