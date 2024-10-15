import React, { useContext, useEffect, useRef, useState } from "react";
import type { AutoCompleteProps, GetRef, InputRef, TableProps } from "antd";
import {EditOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Col, Collapse, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { DepartmentPayoutRatiosService, DepartmentPublicOut, DepartmentsService, EmployeePublicOut, EmployeeService, JobPayoutRatioProfilePublicOut, JobPayoutRatioProfilesService, ProjectsService, WorkLocationPublicOut, WorkLocationsService } from "../client";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  text: string;
  category: string;
}

interface EditableRowProps {
  index: number;
  form: any;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, form, ...props }) => {
  //const [form] = Form.useForm();
  return (
    //<Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    //</Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  rowIndex: number;
  columnIndex: number;
  departments: DepartmentPublicOut[];
  workLocations: WorkLocationPublicOut[];
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  rowIndex,
  columnIndex,
  departments,
  workLocations,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [department, setDepartment] = useState<DepartmentPublicOut | null | undefined>(null)
  const [options, setOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  
  useEffect(() => {
    // if (editing) {
    //   inputRef.current?.focus();
    // }
    
  }, [editing]);
  useEffect(()=>{
    setDepartment(departments?.find(dp=>dp.name===record?.category))
  },[])
  
  const toggleEdit = () => {
    console.log("click");

    setEditing(!editing);
    //form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });
  };

  const save = async () => {
    // try {
    //   const values = await form.validateFields();
    //   console.log(values);
      
    //   toggleEdit();
    //   handleSave({ ...record, ...values });
    // } catch (errInfo) {
    //   console.log("Save failed:", errInfo);
    // }
  };
  const onSelect = (data: string) => {
    //const person:EmployeePublicOut[] = options.filter((value)=> value.id===parseInt(data))
    //console.log(person);
    
  };
  
  const onSearch = async(searchText:string)=>{
    //setDepartment(departments?.find(dp=>dp.name===record?.category))
    if(searchText===""){
      setOptions([])
      return
    }
    try {
      const repsonse = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
        query: {
          department_id: department?.id
        }
      })
      if(repsonse.data){
        const formattedOptions = repsonse.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,                // Spread the existing EmployeePublicOut fields
          label: employee.name,       // Label is set to employee's name
          value: employee.name
        }));
        
        setOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
      
    }
    
  }
  let formItemName
  if(record?.category === '建筑'){
    if(record?.text === '设计人'){
      formItemName='archPM'
    }else if(record?.text === '产值'){
      formItemName='archAssistant'
    }
  }
  else if(record?.category === '结构'){
    if(record?.text === '设计人'){
      formItemName='structPM'
    }else if(record?.text === '产值'){
      formItemName='structAssistant'
    }
  }else{
    formItemName=dataIndex
  }
  console.log(formItemName,"llll");
  console.log(record,"llll1");
  console.log(rowIndex,"llll2");
  console.log(columnIndex,"llll4");
  console.log(dataIndex,"llll5");
  
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={formItemName}
        rules={[{ required: true, message: `${record?.text}不能为空` }]}
      >
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        {record?.text==='设计人' ? 
          <AutoComplete
            onBlur={save}
            options={options.map((option)=>({
              value:option.value,
              label:(
                <div style={{ display: 'flex' }}>
                  <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                  <div style={{ textAlign:'center',flex:'1 1 100px',borderLeft: '1px solid #000',borderRight: '1px solid #000'}}>{department?.name}</div>
                  <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                </div>
              )
            }))}
            style={{ width: 200 }}
            onSelect={onSelect}
            onSearch={onSearch}
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
  
  pm_assistant: string
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

export const PayoutTable: React.FC = () => {
  
  const [formPayout] = Form.useForm();
  const [selectedProfileId, setSelectedProfileId] = useState<
    number | undefined
  >(undefined);
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );

  const [designChiefOptions,setDesignChiefOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [designAssistantOptions,setdesignAssistantOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [selectedProfileData, setSelectedProfileData] = useState<JobPayoutRatioProfilePublicOut | null>(null);
  const [togglePayoutTable, setTogglePayoutTable] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);

  
  const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
  const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing

  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      age: "32",
      category:'建筑',
      text:'设计人',
      pm: "韩乐",
      pm_assistant: 'you',
      
    },
    {
      key: "1",
      text:'产值',
      category:'建筑',
      age: "32",
      pm: "123",
      pm_assistant: 'you',
    },
    {
      key: "2",
      text:'设计人',
      category:'结构',
      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "3",
      text:'产值',
      category:'结构',
      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "4",
      text:'设计人',
      category:'给排水',

      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "5",
      text:'产值',
      category:'给排水',

      age: "32",
      pm: "",
      pm_assistant: 'you',
    },
    {
      key: "6",
      text:'设计人',
      category:'暖通',

      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "7",
      text:'产值',
      category:'暖通',

      age: "32",
      pm: "",
      pm_assistant: 'you',
    },
    {
      key: "8",
      text:'设计人',
      category:'强电',

      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "9",
      text:'产值',
      category:'强电',

      age: "32",
      pm: "",
      pm_assistant: 'you',
    },
    {
      key: "10",
      text:'设计人',
      category:'弱电',

      age: "32",
      pm: "韩乐",
      pm_assistant: 'you',
    },
    {
      key: "11",
      text:'产值',
      category:'弱电',

      age: "32",
      pm: "",
      pm_assistant: 'you',
    },
  ]);

  useEffect(() => {
    
    // formPayout.setFieldsValue({
    //   archPM: dataSource[1].pm,//index 1 is arch's 产值
    //   archAssistant:dataSource[1].pm_assistant,
    //   structPM: dataSource[3].pm,
    //   structAssistant: dataSource[3].pm_assistant,

    // })
    console.log(formPayout.getFieldsValue());
    
  }, [formPayout, dataSource]);
  useEffect(()=>{
    fetchData()
    fetchProfiles()
  },[])

  const fetchData= async()=>{
    try {
      const [resWorkLocations, resDepartments] = await Promise.all([
        WorkLocationsService.readWorkLocations(),
        DepartmentsService.readDepartments(),
      ])
      if(resWorkLocations.error){
        message.error("工作地点获取失败: "+ resWorkLocations.error?.detail)
        return
      }
      if(resDepartments.error){
        message.error("部门获取失败: "+ resDepartments.error?.detail)
        return
      }
      setWorkLocations(resWorkLocations.data.data)
      setDepartments(resDepartments.data.data)
      
    } catch(error){
      message.error("工作地点或部门获取失败: "+ error);
    }
  }
  const fetchProfiles = async () => {
    try {
      const {error, data} =
        await JobPayoutRatioProfilesService.readJobPayoutRatioProfiles({
          query: {
            hidden: true,
          },
        });
        if (error) {
          message.error("获取工比失败: " + error.detail);
        } else {
          const filteredProfiles = data.data.filter(
            (profile) => profile.id !== 1
          );
          setProfiles(filteredProfiles);
        setLoading(false);
      }
    } catch (error) {
      message.error("获取工比失败: 未知错误: " + error);
      console.log(error);
    }
  };
  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    const selectedProfile = profiles.find(
      (profile) => profile.id === profileId
    );
    
    if (selectedProfile) {
      setSelectedProfileData(selectedProfile);
      console.log(selectedProfile);
      
    } else {
      message.error("未找到所选配置文件");
    }
  };
  const onSearchDesignChief=async(searchText:string)=>{
    if(searchText===""){
      setDesignChiefOptions([])
      return
    }
    try {
      const repsonse = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
      })
      if(repsonse.error){
        message.error("自动查询失败: "+repsonse.error)
        return
      }
      const formattedOptions = repsonse.data.data.map((employee: EmployeePublicOut) => ({
        ...employee,                // Spread the existing EmployeePublicOut fields
        label: employee.name,       // Label is set to employee's name
        value: employee.name, // Value is set to employee's id as a string
        key: employee.id,
      }));
      setDesignChiefOptions(formattedOptions)
    } catch (error) {
      message.error("自动查询失败: "+error)
      
    }
  }
  const handlePayoutFinish = (fieldsValue: any)=>{
    console.log("表单提交时的值:", fieldsValue);
    console.log("表单提交时的值:", formPayout.getFieldsValue());

  }
  const generatePayout = async()=>{
    console.log("生成产值表...");
    setTogglePayoutTable(true)
    const [resProject,resDepartmentPayoutRatio] = await Promise.all([
      ProjectsService.readProject({
        path: {
          id: 2216
        }
      }),
      DepartmentPayoutRatiosService.getDepartmentPayoutRatio({
        path: {
          project_class_id: 2,//hardcode
          project_rate_adjustment_class_id: 2,
        }
      }),

    ]) 
    if(resProject.error){
      message.error("获得工程失败: "+ resProject.error)
      return
    }
    if(resDepartmentPayoutRatio.error){
      message.error("获得部门间工比失败: "+ resDepartmentPayoutRatio.error)
      return
    }
    //计算部门间payout
    const valueForPMTeam = resProject.data?.calculated_employee_payout!! * resDepartmentPayoutRatio.data.pm_ratio / 100//项目总负责及助理产值
    const valueForRestOfPM = resProject.data?.calculated_employee_payout!! * (100-resDepartmentPayoutRatio.data.pm_ratio) /100 //除项目总负责及助理剩余专业产值
    const valueArch = valueForRestOfPM * resDepartmentPayoutRatio.data.arch_ratio / 100 //建筑专业产值
    const valueStruct = valueForRestOfPM * resDepartmentPayoutRatio.data.struct_ratio / 100 //结构专业产值
    const valuePlumbing = valueForRestOfPM * resDepartmentPayoutRatio.data.plumbing_ratio / 100 //给排水专业产值
    const valueElectric = valueForRestOfPM * resDepartmentPayoutRatio.data.electrical_ratio / 100 //强电专业产值
    const valueHVAC = valueForRestOfPM * resDepartmentPayoutRatio.data.hvac_ratio / 100 //暖通专业产值
    const valueLowVoltage = valueForRestOfPM * resDepartmentPayoutRatio.data.low_voltage_ratio / 100 //弱电专业产值
    //具体职责payout
    const pm = valueForPMTeam * selectedProfileData?.pm_ratio!! /100
    const pmAssistant = valueForPMTeam * selectedProfileData?.pm_assistant_ratio!! /100
    const archPM = valueArch * selectedProfileData?.arch_pm_ratio!! / 100
    const archAssistant = valueArch * selectedProfileData?.arch_pm_assistant_ratio!! / 100
    const structPM = valueStruct * selectedProfileData?.struct_pm_ratio!! / 100
    const structAssistant = valueStruct * selectedProfileData?.struct_pm_assistant_ratio!! / 100
    const plumbingPM = valuePlumbing * selectedProfileData?.plumbing_pm_ratio!! / 100
    const plumbingAssistant = valuePlumbing * selectedProfileData?.plumbing_pm_assistant_ratio!! / 100

    formPayout.setFieldsValue({
      designChief: pm,
      designAssistant: pmAssistant,
      archPM: archPM,
      archAssistant:archAssistant,
      structPM: structPM,
      structAssistant: structAssistant
    })
  }
  

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
      onCell: (record: any, index: number) => {
        const cellProps = {} as any;
    
        // 每两行合并一次
        if (index % 2 === 0) {
          cellProps.rowSpan = 2; // 合并两行
        } else {
          cellProps.rowSpan = 0; // 隐藏第二行
        }
    
        return cellProps;
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
            onCell: (record: DataType, rowIndex:number,columnIndex:number) => ({
              record,
              editable: child.editable === true, // Set editable for specific child column
              dataIndex: child.dataIndex,
              title: child.title,
              rowIndex,
              columnIndex,
              departments: departments,
              workLocations: workLocations,
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

  return (
    <div>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}> 
        <Space size="middle">
          <Select
            value={selectedProfileId}
            onChange={handleProfileSelect}
            style={{ width: 300 }}
            placeholder="选择配置文件"
            options={
              profiles.length > 0
                ? [
                    {
                      label: "活跃",
                      title: "not_hidden",
                      options: profiles
                        .filter((profile) => !profile.hidden)
                        .map((profile) => ({
                          value: profile.id,
                          label: (
                            <span>
                              {profile.name}
                              {!profile.is_in_use && (
                                <Tag style={{ marginLeft: "8px" }}>无项目</Tag>
                              )}
                            </span>
                          ),
                          disabled: false,
                        })),
                    },
                    {
                      label: <span>已隐藏</span>,
                      title: "已隐藏",
                      options: profiles
                        .filter((profile) => profile.hidden)
                        .map((profile) => ({
                          value: profile.id,
                          label: (
                            <span>
                              {profile.name}
                              {!profile.is_in_use && (
                                <Tag style={{ marginLeft: "8px" }}>无项目</Tag>
                              )}
                            </span>
                          ),
                          disabled: false,
                        })),
                    },
                  ]
                : [
                    {
                      label: "无配置",
                      title: "no_profiles",
                      options: [
                        {
                          value: "no_profiles",
                          label: "系统内无配置",
                          disabled: true,
                        },
                      ],
                    },
                  ]
            }
          />
          <Button type="primary" disabled={selectedProfileId===undefined ? true : false} onClick={generatePayout}>
            生成产值表
          </Button>
        </Space>
          
        {/* <Collapse activeKey={togglePayoutTable ? ["1"] : []} onChange={(key) => setTogglePayoutTable(!togglePayoutTable)} ghost items={[{key:'1',label:<span style={togglePayoutTable? {fontWeight: 'bold' }:{fontWeight:'normal'}}>
            产值表
          </span>, children:<PayoutTable></PayoutTable>}]} /> */}
        {/* {togglePayoutTable && <PayoutTable></PayoutTable>} */}
        {togglePayoutTable && 
        <Form.Provider>
          
          <Form form={formPayout} onFinish={handlePayoutFinish} >
          
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            
              <Row gutter={16}>
                <Col span={6}>
                <Form.Item label="设计总负责人" name="designChief">
                  <AutoComplete options={designChiefOptions} onSearch={onSearchDesignChief} placeholder="input here"/>
                </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item label="设计总负责产值" name='designChiefPayout'>
                  <Input></Input>
                </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="设计总负责助理" name='designAssistant'>
                    
                    <AutoComplete options={designChiefOptions} onSearch={onSearchDesignChief}/>
                  </Form.Item>
                </Col>
                <Col span={6}>

                  <Form.Item label="设计总负责助理产值" name='designAssistantPayout'>
                    
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Table<DataType>
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                pagination={false}
              />
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交产值表
                </Button>
                
              </Form.Item>
            </Space>
            
          </Form>
        </Form.Provider>
        }
            
      </Space>
      

    </div>
  );
};


