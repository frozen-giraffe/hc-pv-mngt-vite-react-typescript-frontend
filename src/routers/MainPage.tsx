// import React from 'react'

// export const MainPage = () => {
//   return (
//     <div>欢迎

//     </div>
//   )
// }

import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    console.log("click");

    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ width: "100%", minHeight: "20px" }}
        onClick={toggleEdit}
      >
        {/* {children} */}
        {children || <span style={{ color: "#999" }}>Click to edit</span>}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  age: string;
  pm: string;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const MainPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      age: "32",
      pm: "",
    },
    {
      key: "1",

      age: "32",
      pm: "韩乐",
    },
    {
      key: "2",

      age: "32",
      pm: "韩乐",
    },
    {
      key: "3",

      age: "32",
      pm: "韩乐",
    },
    {
      key: "4",

      age: "32",
      pm: "韩乐",
    },
    {
      key: "5",

      age: "32",
      pm: "",
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: "专业分类",
      dataIndex: "category",
      width: 50,
      editable: false,
      render: (text: string, record: any, index: number) => {
        const leftContent = ["建筑", "结构", "给排水", "暖通", "强电", "弱电"][
          Math.floor(index / 2)
        ];
        const topContent = "设计人";
        const bottomContent = "产值";
        const obj = {
          children: (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "50px auto",
                height: "100%",
            fontWeight:600
              }}
            >
              {/* Left Cell */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                {leftContent}
              </div>

              {/* Right Cell with top and bottom sections */}
              <div style={{ paddingLeft: "10px" }}>
                <div
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                    paddingBottom:'20px'
                  }}
                >
                  {topContent}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                    paddingTop:'20px'

                  }}
                >
                  {bottomContent}
                </div>
              </div>
            </div>
          ),
          props: {} as any,
        };

        // Merge the cells for every two rows
        if (index % 2 === 0) {
          obj.props.rowSpan = 2; // Merge two rows
        } else {
          obj.props.rowSpan = 0; // Hide the second row
        }

        return obj;

        // Define the left and right content based on the index
        // const leftContent = ["建筑", "结构", "给排水", "暖通", "强电", "弱电"][
        //   Math.floor(index / 2)
        // ];
        // const topContent = "设计人";
        // const bottomContent = "产值";

        // return (
        //   <div
        //     style={{
        //       display: "grid",
        //       gridTemplateColumns: "50px auto",
        //       height: "100%",
        //     }}
        //   >
        //     {/* Left Cell */}
        //     <div
        //       style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         borderRight: "1px solid #f0f0f0",
        //         backgroundColor: "#fafafa",
        //       }}
        //     >
        //       {leftContent}
        //     </div>

        //     {/* Right Cell with top and bottom sections */}
        //     <div style={{ paddingLeft: "10px" }}>
        //       <div
        //         style={{
        //           borderBottom: "1px solid #f0f0f0",
        //           display: "flex",
        //           justifyContent: "center",
        //           alignItems: "center",
        //           height: "50%",
        //         }}
        //       >
        //         {topContent}
        //       </div>
        //       <div
        //         style={{
        //           display: "flex",
        //           justifyContent: "center",
        //           alignItems: "center",
        //           height: "50%",
        //         }}
        //       >
        //         {bottomContent}
        //       </div>
        //     </div>
        //   </div>
        // );
      },
    },
    {
      title: "施工图设计",
      dataIndex: "age",
      width: 800,
      editable: false,
      children: [
        {
          title: "专业负责人",
          dataIndex: "pm",
          editable: true,
          width: 100,
        },
        {
          title: "专业负责人助理",
          dataIndex: "pm_assistant",
          editable: true,
          width: 100,
        },
        {
          title: "设计",
          dataIndex: "designer",
          editable: true,
          width: 100,
        },
        {
          title: "施工图",
          dataIndex: "drafter",
          editable: true,
          width: 100,
        },
        {
          title: "后期服务",
          dataIndex: "post_service",
          editable: true,
          width: 100,
        },
        {
          title: "校对",
          dataIndex: "proofreader",
          editable: true,
          width: 100,
        },
        {
          title: "审核",
          dataIndex: "reviewer",
          editable: true,
          width: 100,
        },
        {
          title: "审定",
          dataIndex: "approver",
          editable: true,
          width: 100,
        },
      ],
    },
    {
      title: "小计",
      dataIndex: "address",
      width: 100,
      render: (text: string, record: any, index: number) => {
        const obj = {
          children: text,
          props: {} as any,
        };

        // Merge the cells for every two rows
        if (index % 2 === 0) {
          obj.props.rowSpan = 2; // Merge two rows
        } else {
          obj.props.rowSpan = 0; // Hide the second row
        }

        return obj;
      },
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // const columns = defaultColumns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: DataType) => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       handleSave,
  //     }),
  //   };
  // });
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      if (col.children) {
        return {
          ...col,
          children: col.children.map((child) => ({
            ...child,
            onCell: (record: DataType) => ({
              record,
              editable: child.editable === true, // Set editable for specific child column
              dataIndex: child.dataIndex,
              title: child.title,
              handleSave,
            }),
          })),
        };
      }
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table<DataType>
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default MainPage;
