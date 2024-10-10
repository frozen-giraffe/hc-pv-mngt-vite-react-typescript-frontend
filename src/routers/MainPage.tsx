import React, { useContext, useEffect, useRef, useState } from "react";
import type { AutoCompleteProps, GetRef, InputRef, StatisticProps, TableProps } from "antd";
import {EditOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Card, Col, Form, Input, Popconfirm, Row, Space, Statistic, Table } from "antd";
import { EmployeePublicOut, EmployeeService } from "../client";
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons'
import CountUp from 'react-countup';
import { useAuth } from "../context/AuthContext";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  text: string;
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
  rowIndex: Boolean;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  rowIndex,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const {user} = useAuth()

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
    console.log("rowIndex1",rowIndex, title, record?.text==='设计人',editable);
    
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
  const onSelect = (data: string) => {
    const person:EmployeePublicOut[] = options.filter((value)=> value.id===parseInt(data))
    console.log(person);
    
  };
  const onSearch = async(searchText:string, department_id:number | null)=>{
    try {
      const repsonse = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
        query: {
          department_id: department_id
        }
      })
      if(repsonse.data){
        const formattedOptions = repsonse.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,                // Spread the existing EmployeePublicOut fields
          label: employee.name,       // Label is set to employee's name
          value: employee.id.toString(), // Value is set to employee's id as a string
        }));
        setOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
      
    }
    
  }
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        {record?.text==='设计人' ? 
          <AutoComplete
          onBlur={save}
          options={options}
          style={{ width: 200 }}
          onSelect={onSelect}
          onSearch={onSearch}
          placeholder="input here"
          allowClear={true}
        />
        
        :
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        }
        
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ width: "100%", minHeight: "20px", cursor:'pointer' }}
        onClick={toggleEdit}
      >
        
        <Space>
          {editable ? <EditOutlined style={{color:'gray'}}/> : <></>}
        
          {children}
        </Space>
        
        
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  age: string;
  pm: string;
  category: string;
  text: string;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const MainPage: React.FC = () => {
  const { user } = useAuth();  // Move this line inside the component
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      age: "32",
      category:'建筑',
      text:'设计人',
      pm: "韩乐",
    },
    {
      key: "1",
      text:'产值',
      category:'建筑',

      age: "32",
      pm: "123",
    },
    {
      key: "2",
      text:'设计人',
      category:'建筑',

      age: "32",
      pm: "韩乐",
    },
    {
      key: "3",
      text:'产值',
      category:'建筑',

      age: "32",
      pm: "韩乐",
    },
    {
      key: "4",
      text:'设计人',
      category:'建筑',

      age: "32",
      pm: "韩乐",
    },
    {
      key: "5",
      text:'产值',
      category:'建筑',

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
      rowScope: 'row',
      editable: false,
      colSpan: 2,
      onCell: (_:any, index:number) => {
        if (index %2===0) {
          return { rowSpan: 2 };
        }else{
          return {rowSpan:0}
        }
      },
    },
    {
      title: "",//being colSpan to 专业分类
      dataIndex: "text",
      width: 50,
      colSpan:0,
      editable: false,
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
      onCell: (record: DataType, rowIndex:number) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        rowIndex,
        handleSave,
      }),
    };
  });

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp start={(value as number) / 2} end={value as number} duration={2} />
  );

  return (
    <div>
      <h1>新疆昊辰建筑设计规划研究院有限公司-产值计算系统</h1>
      <h2>欢迎回来，{user?.full_name}</h2>
      <Table<DataType>
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
      <Row gutter={[18,18]}>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="本年工程数量"
              value={420}
              suffix="个"
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="总工程数量"
              value={2048}
              suffix="个"
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="未进行产值计算项目"
              value={3}
              suffix="个"
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={true}>
            <Statistic
              title="无回款项目"
              value={10}
              suffix="个"
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MainPage;
