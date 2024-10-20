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
  ProdValueCalcRatioCreateIn,
  ProdValueCalcRatioPublicOut,
  ProdValueCalcRatiosService,
  ProdValueCalcRatioUpdateIn,
  UpdateProdValueCalcRatioError,
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
      const {data, error} =
        await ProdValueCalcRatiosService.readProdValueCalcRatios();
      if (error) {
        message.error("获取合同产值系数失败:" + error.detail);
      } else {
        data.data.sort((a, b) => a.id - b.id);
        setRatios(data.data);
      }

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
    } catch (error) {
      message.error(
        "Failed to fetch ratios:" +
          (error instanceof Error ? error.message : String(error))
      );
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
      const {error} = await ProdValueCalcRatiosService.updateProdValueCalcRatio({
        path: {
          id: record.id,
        },
        body: updateData,
      });
      if (error) {
        message.error("更新失败: " + error.detail);
      } else {
        message.success("更新成功");
        fetchRatios();
      }
    } catch (error) {
      message.error("更新失败，未知错误: " + error);
      console.log(error);
    }
  };

  const handleSetDefault = async (record: ProdValueCalcRatioPublicOut) => {
    try {
      const {error} = await ProdValueCalcRatiosService.updateProdValueCalcRatio({
        path: { id: record.id },
        body: { ...record, default: true }
      });
      if (error) {
        message.error("设置默认失败: " + error.detail);
      } else {
        message.success("设置默认成功");
        fetchRatios();
      }
    } catch (error) {
      message.error("设置默认失败，未知错误：" + error);
      console.log(error)
    }
  };

  const handleAdd = async (values: ProdValueCalcRatioCreateIn) => {
    try {
      await ProdValueCalcRatiosService.createProdValueCalcRatio({
        body: {
          ...values,
          ratio: (values.ratio / 100).toFixed(2),
        },
      });
      message.success("添加成功");
      addForm.resetFields();
      fetchRatios();
    } catch (error) {
      message.error(
        "添加失败:" + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleDelete = async (record: ProdValueCalcRatioPublicOut) => {
    const {error} = await ProdValueCalcRatiosService.deleteProdValueCalcRatio({
      path: {
        id: record.id,
      },
    });
    if (error) {
      message.error("删除失败: " + error.detail);
    } else {
      message.success("删除成功");
      fetchRatios();
    }
  };

  const columns = [
    {
      title: "合同产值名称",
      dataIndex: "name",
      key: "name",
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
      editable: true,
      fixed: "right" as const,
      width: 140,
      render: (value: number) => <span>{(value * 100).toFixed(2)}%</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right" as const,
      width: 180,
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

            <Tooltip title={record.default ? "默认系数不可删除" : ""}>
              <Typography.Link
                onClick={() => handleDelete(record)}
                style={{ marginRight: 8 }}
                disabled={editingKey !== "" || record.default}
              >
                删除
              </Typography.Link>
            </Tooltip>
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
    const inputNode =
      inputType === "number" ? (
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
    <div style={{ maxWidth: "1300px" }}>
      <h2>
        合同/下发产值系数
        <Tooltip title="合同产值与下发产值的预设，展示在下发产值栏下方供快速计算。">
          <InfoCircleOutlined
            style={{ marginLeft: "8px", cursor: "pointer" }}
          />
        </Tooltip>
      </h2>
      <Alert
        message="修改此处的预设不会影响已计算的产值数据。"
        type="info"
        showIcon
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
          rowKey="id"
          scroll={{ x: 400, y: "max(calc(100vh - 600px), 300px)" }}
          size="large"
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
