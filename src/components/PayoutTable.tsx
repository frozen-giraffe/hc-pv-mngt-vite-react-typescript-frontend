import React, { useContext, useEffect, useRef, useState } from "react";
import type { AutoCompleteProps, GetRef, InputRef, TableProps } from "antd";
import {EditOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Col, Collapse, Divider, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag, Typography } from "antd";
import { DepartmentPayoutRatiosService, DepartmentPublicOut, DepartmentsService, EmployeePublicOut, EmployeeService, JobPayoutRatioProfilePublicOut, JobPayoutRatioProfilesService, ProjectsService, WorkLocationPublicOut, WorkLocationsService } from "../client";
import type { BaseSelectRef } from 'rc-select'; // Import the correct type
import './PayoutTable.css'
//import type { FormInstance } from 'antd/es/form';
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

interface DataType {
  key:string
  category: string;
  text: string;
  pm: string | number
  pm_assistant: string | number
  designer: string | number
  drafter: string | number
  post_service: string | number
  proofreader: string | number
  reviewer: string | number
  approver: string | number
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;
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
  form:any
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
  const selectRef  = useRef<BaseSelectRef>(null);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  
  useEffect(() => {
    if (editing) {
      record?.text==='设计人' ? selectRef.current?.focus() : inputRef.current?.focus()
      //inputRef.current?.focus();
    }
    
  }, [editing]);
  useEffect(()=>{
    setDepartment(departments?.find(dp=>dp.name===record?.category))
    
  },[])
  // useEffect(() => {
  //   // 设置初始值
  //   if (form && record) {
  //     form.setFieldsValue({
  //       [`${record.category}${record.text}`]: {
  //         [dataIndex]: record[dataIndex] || ""
  //       }
  //     });
  //   }
  // }, [form, record, dataIndex]);
  const toggleEdit = () => {
    console.log("click");

    setEditing(!editing);
    //form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });
    console.log();
    
    console.log({[record?.category + record?.text]: {
      [dataIndex]: record[dataIndex] || ""
    }});
    
    // form.setFieldsValue({
    //   [record?.category + record?.text]: {
    //     [dataIndex]: record[dataIndex] || ""
    //   }
    // });
    form.setFieldValue([record?.category + record?.text, dataIndex], record[dataIndex] || "")
  };
  // const setValueToFormField=()=>{
  //   form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });

  // }

  const save = async () => {
      //setEditing(!editing);
      try{
        const values = await form.validateFields();
        console.log(record,'pppp')
        let internalValue={}
        Object.keys(values).forEach((key) => {
          // 检查是否存在一个对象,对象的key是record?.category+record?.text，因为form item name
          if (typeof values[key] === 'object') {
            internalValue={...values[key]}//ep:让{建筑设计人：{pm: XXX, pm_assistant,...}} to be {pm: XXX, pm_assistant,...}
            console.log(internalValue,key, values[key]);
          }
        });
        
        console.log({ ...record, ...internalValue});
        
        handleSave({ ...record, ...internalValue});//save 到table的dataSource
        toggleEdit();//save 到form上
      }catch(e){
        console.log('存错误');
        console.log(e);
      }
      
    
  };
  const onSelect = (data: string) => {
    const person:EmployeePublicOut[] = options.filter((value)=> value.id===parseInt(data))
    console.log(person);
    setEditing(false)
    setOptions([])
    form.setFieldValue([record?.category+record?.text, dataIndex], person[0].id)
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
   
  let childNode = children;
  let formName=[record?.category+record?.text, dataIndex]
   if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={formName}
        rules={[{ required: true, message: `${record?.text}不能为空` }]}
        
      >
        {record?.text==='设计人' ? 
          <AutoComplete
            ref={selectRef}
            onBlur={save}
            options={options.map((option)=>({
              value:option.id,
              label:(
                <Space size={1} align="end">
                  <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                  <Divider type="vertical" style={{width:'1px'}}/>
                  <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                  <Divider type="vertical" style={{width:'1px'}}/>
                  <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                </Space>
              )
            }))}
            onSelect={onSelect}
            onSearch={onSearch}
            allowClear={true}
            popupMatchSelectWidth={false}
          />
        
        :
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        }
        
      </Form.Item>
    ) : (
      <Form.Item
        style={{ margin: 0 }}
        name={formName}
        rules={[{ required: true, message: `${record?.text}不能为空` }]}
      >
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
      </Form.Item>
    );
  }
  // if (editable) {
  //   childNode = editing ? (
  //     <Form.Item
  //       style={{ margin: 0 }}
  //       name={formName}
  //       rules={[{ required: true, message: `${record?.text}不能为空` }]}
        
  //     >
  //       {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
  //       {record?.text==='设计人' ? 
  //         <AutoComplete
  //           ref={selectRef}
  //           onBlur={save}
  //           options={options.map((option)=>({
  //             value:option.value,
  //             label:(
  //               <div style={{ display: 'flex' }}>
  //                 <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
  //                 <div style={{ textAlign:'center',flex:'1 1 100px',borderLeft: '1px solid #000',borderRight: '1px solid #000'}}>{department?.name}</div>
  //                 <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
  //               </div>
  //             )
  //           }))}
  //           // style={{ width: 200 }}
  //           onSelect={onSelect}
  //           onSearch={onSearch}
  //           allowClear={true}
  //         />
        
  //       :
  //       <Input ref={inputRef} onPressEnter={save} onBlur={save} />
  //       }
        
  //     </Form.Item>
  //   ) : (
  //     <Form.Item
  //       style={{ margin: 0 }}
  //       name={formName}
  //       rules={[{ required: true, message: `${record?.text}不能为空` }]}
        
  //     >
  //     <div
  //       className="editable-cell-value-wrap"
  //       // style={{ width: "100%", minHeight: "20px", cursor:'pointer' }}
  //       //style={{ paddingInlineEnd: 24, border: '1px dashed transparent', transition: 'border 0.3s ease' }}
  //       onClick={toggleEdit}
  //     >
  //       {/* <Space>
  //         {editable ? <EditOutlined style={{color:'gray'}}/> : <></>}
  //         {children}
  //       </Space> */}
  //       {children}
        
  //     </div>
  //     </Form.Item>
  //   );
  // }
//   if (editable) {
//   childNode = (
//     <Form.Item
//       style={{ margin: 0 }}
//       name={formName}
//       rules={[{ required: true, message: `${record?.text}不能为空` }]}
//     >
//       {editing ? (
//         record?.text === '设计人' ? (
//           <AutoComplete
//             ref={selectRef}
//             onBlur={save}
//             options={options.map((option) => ({
//               value: option.value,
//               label: (
//                 <div style={{ display: 'flex' }}>
//                   <div style={{ textAlign: 'center', flex: '2 1 100px' }}>{option.name}</div>
//                   <div
//                     style={{
//                       textAlign: 'center',
//                       flex: '1 1 100px',
//                       borderLeft: '1px solid #000',
//                       borderRight: '1px solid #000',
//                     }}
//                   >
//                     {department?.name}
//                   </div>
//                   <div style={{ textAlign: 'center', flex: '1 1 100px' }}>
//                     {workLocations.find((wl) => wl.id === option.work_location_id)?.name}
//                   </div>
//                 </div>
//               ),
//             }))}
//             onSelect={onSelect}
//             onSearch={onSearch}
//             allowClear={true}
//           />
//         ) : (
//           <Input ref={inputRef} onPressEnter={save} onBlur={save} />
//         )
//       ) : (
//         <div
//           className="editable-cell-value-wrap"
//           onClick={toggleEdit}
//         >
//           {children}
//         </div>
//       )}
//     </Form.Item>
//   );
// }

  return <td {...restProps}>{childNode}</td>;
};



export const PayoutTable: React.FC = () => {
  
  const [formPayout] = Form.useForm();
  const [selectedProfileId, setSelectedProfileId] = useState<
    number | undefined
  >(undefined);
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );
  const [tableInit, setTableInit] = useState({})
  const [designChiefOptions,setDesignChiefOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [designAssistantOptions,setdesignAssistantOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [selectedProfileData, setSelectedProfileData] = useState<JobPayoutRatioProfilePublicOut | null>(null);
  const [togglePayoutTable, setTogglePayoutTable] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);

  
  const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
  const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing
  const [dataSource, setDataSource] = useState<DataType[]>([])
  // const [dataSource, setDataSource] = useState<DataType[]>([
  //   {
  //     key: "0",
  //     age: "32",
  //     category:'建筑',
  //     text:'设计人',
  //     pm: "韩乐",
  //     pm_assistant: 'you',
      
  //   },
  //   {
  //     key: "1",
  //     text:'产值',
  //     category:'建筑',
  //     age: "32",
  //     pm: "123",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "2",
  //     text:'设计人',
  //     category:'结构',
  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "3",
  //     text:'产值',
  //     category:'结构',
  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "4",
  //     text:'设计人',
  //     category:'给排水',

  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "5",
  //     text:'产值',
  //     category:'给排水',

  //     age: "32",
  //     pm: "",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "6",
  //     text:'设计人',
  //     category:'暖通',

  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "7",
  //     text:'产值',
  //     category:'暖通',

  //     age: "32",
  //     pm: "",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "8",
  //     text:'设计人',
  //     category:'强电',

  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "9",
  //     text:'产值',
  //     category:'强电',

  //     age: "32",
  //     pm: "",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "10",
  //     text:'设计人',
  //     category:'弱电',

  //     age: "32",
  //     pm: "韩乐",
  //     pm_assistant: 'you',
  //   },
  //   {
  //     key: "11",
  //     text:'产值',
  //     category:'弱电',

  //     age: "32",
  //     pm: "",
  //     pm_assistant: 'you',
  //   },
  // ]);

  useEffect(() => {
    
    // formPayout.setFieldsValue({
    //   archPM: dataSource[1].pm,//index 1 is arch's 产值
    //   archAssistant:dataSource[1].pm_assistant,
    //   structPM: dataSource[3].pm,
    //   structAssistant: dataSource[3].pm_assistant,

    // })
    console.log(formPayout.getFieldsValue(),'useEffect');
    
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
            hidden: false,
          },
        });
        if (error) {
          message.error("获取工比失败: " + error.detail);
        } else {
          const filteredProfiles = data.data.filter(
            (profile) => profile.id !== 99
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
  const onSelectDesignChief=(value:string,option:any)=>{
    setDesignChiefOptions([])
    
  }
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
  const handlePayoutFinish = async(fieldsValue: any)=>{
    try {
      
      const values = await formPayout.validateFields();
      console.log("表单提交时的值:", fieldsValue);
    console.log("表单提交时的值:", values);
    } catch (error) {
      console.log('表单提交错误');
      
    }
    

  }
  function calculatePayout(departmentValue: number, ratios: any) {
    return {
      pm: (departmentValue * ratios.pm_ratio / 100).toFixed(2),
      pm_assistant: (departmentValue * ratios.pm_assistant_ratio / 100).toFixed(2),
      designer: (departmentValue * ratios.designer_ratio / 100).toFixed(2),
      drafter: (departmentValue * ratios.drafter_ratio / 100).toFixed(2),
      post_service: (departmentValue * ratios.design_post_service_ratio / 100).toFixed(2),
      proofreader: (departmentValue * ratios.proofreader_ratio / 100).toFixed(2),
      reviewer: (departmentValue * ratios.reviewer_ratio / 100).toFixed(2),
      approver: (departmentValue * ratios.approver_ratio / 100).toFixed(2),
    };
  }
  function getPayoutData(category: string, text: string, department: any) {
    if (text === '设计人') {
      return {
        category,
        text,
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      };
    } else if (text === '产值') {
      return {
        category,
        text,
        pm: department.pm,
        pm_assistant: department.pm_assistant,
        designer: department.designer,
        drafter: department.drafter,
        post_service: department.post_service,
        proofreader: department.proofreader,
        reviewer: department.reviewer,
        approver: department.approver,
      };
    }
    // 默认返回空数据，但保持类型一致
    return {
      category: '',
      text: '',
      pm: 0,
      pm_assistant: 0,
      designer: 0,
      drafter: 0,
      post_service: 0,
      proofreader: 0,
      reviewer: 0,
      approver: 0,
    };
  }
  
  const generatePayout = async()=>{
    console.log("生成产值表...");
    setTogglePayoutTable(true)
    const [resProject,resDepartmentPayoutRatio] = await Promise.all([
      ProjectsService.readProject({
        path: {
          id: 1812
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
    console.log(resProject.data,"工程");
    
    //计算部门间payout
    const valueForPMTeam = resProject.data?.calculated_employee_payout * resDepartmentPayoutRatio.data.pm_ratio / 100//项目总负责及助理产值
    const valueForRestOfPM = resProject.data?.calculated_employee_payout * (100-resDepartmentPayoutRatio.data.pm_ratio) /100 //除项目总负责及助理剩余专业产值
    const valueArch = valueForRestOfPM * resDepartmentPayoutRatio.data.arch_ratio / 100 //建筑专业产值
    const valueStruct = valueForRestOfPM * resDepartmentPayoutRatio.data.struct_ratio / 100 //结构专业产值
    const valuePlumbing = valueForRestOfPM * resDepartmentPayoutRatio.data.plumbing_ratio / 100 //给排水专业产值
    const valueElectric = valueForRestOfPM * resDepartmentPayoutRatio.data.electrical_ratio / 100 //强电专业产值
    const valueHVAC = valueForRestOfPM * resDepartmentPayoutRatio.data.hvac_ratio / 100 //暖通专业产值
    const valueLowVoltage = valueForRestOfPM * resDepartmentPayoutRatio.data.low_voltage_ratio / 100 //弱电专业产值
    //具体职责payout
    let pm = (valueForPMTeam * selectedProfileData!.pm_ratio /100).toFixed(2)
    const pmAssistant = (valueForPMTeam * selectedProfileData!.pm_assistant_ratio /100).toFixed(2)

    const archPM = (valueArch * selectedProfileData!.arch_pm_ratio / 100).toFixed(2)
    const archAssistant = (valueArch * selectedProfileData!.arch_pm_assistant_ratio / 100).toFixed(2)
    const archDesigner= (valueArch * selectedProfileData!.arch_designer_ratio / 100).toFixed(2)
    const archDrafter= (valueArch * selectedProfileData!.arch_drafter_ratio / 100).toFixed(2)
    const archPostService= (valueArch * selectedProfileData!.arch_design_post_service_ratio / 100).toFixed(2)
    const archProofreader= (valueArch * selectedProfileData!.arch_proofreader_ratio / 100).toFixed(2)
    const archReviewer= (valueArch * selectedProfileData!.arch_reviewer_ratio / 100).toFixed(2)
    const archApprover= (valueArch * selectedProfileData!.arch_approver_ratio / 100).toFixed(2)

    const structPM = (valueStruct * selectedProfileData!.struct_pm_ratio / 100).toFixed(2)
    const structAssistant = (valueStruct * selectedProfileData!.struct_pm_assistant_ratio / 100).toFixed(2)
    const structDesigner = (valueStruct * selectedProfileData!.struct_designer_ratio / 100).toFixed(2)
    const structDrafter = (valueStruct * selectedProfileData!.struct_drafter_ratio / 100).toFixed(2)
    const structPostService = (valueStruct * selectedProfileData!.struct_design_post_service_ratio / 100).toFixed(2)
    const structProofreader = (valueStruct * selectedProfileData!.struct_proofreader_ratio / 100).toFixed(2)
    const structReviewer = (valueStruct * selectedProfileData!.struct_reviewer_ratio / 100).toFixed(2)
    const structApprover = (valueStruct * selectedProfileData!.struct_approver_ratio / 100).toFixed(2)

    const plumbingPM = (valuePlumbing * selectedProfileData!.plumbing_pm_ratio / 100).toFixed(2)
    const plumbingAssistant = (valuePlumbing * selectedProfileData!.plumbing_pm_assistant_ratio / 100).toFixed(2)
    const plumbingDesigner = (valuePlumbing * selectedProfileData!.plumbing_designer_ratio / 100).toFixed(2)
    const plumbingDrafter = (valuePlumbing * selectedProfileData!.plumbing_drafter_ratio / 100).toFixed(2)
    const plumbingPostService = (valuePlumbing * selectedProfileData!.plumbing_design_post_service_ratio / 100).toFixed(2)
    const plumbingProofreader = (valuePlumbing * selectedProfileData!.plumbing_proofreader_ratio / 100).toFixed(2)
    const plumbingReviewer = (valuePlumbing * selectedProfileData!.plumbing_reviewer_ratio / 100).toFixed(2)
    const plumbingApprover = (valuePlumbing * selectedProfileData!.plumbing_approver_ratio / 100).toFixed(2)

    const electricPM = (valueElectric * selectedProfileData!.electrical_pm_ratio / 100).toFixed(2)
    const electricAssistant = (valueElectric * selectedProfileData!.electrical_pm_assistant_ratio / 100).toFixed(2)
    const electricDesigner = (valueElectric * selectedProfileData!.electrical_designer_ratio / 100).toFixed(2)
    const electricDrafter = (valueElectric * selectedProfileData!.electrical_drafter_ratio / 100).toFixed(2)
    const electricPostService = (valueElectric * selectedProfileData!.electrical_design_post_service_ratio / 100).toFixed(2)
    const electricProofreader = (valueElectric * selectedProfileData!.electrical_proofreader_ratio / 100).toFixed(2)
    const electricReviewer = (valueElectric * selectedProfileData!.electrical_reviewer_ratio / 100).toFixed(2)
    const electricApprover = (valueElectric * selectedProfileData!.electrical_approver_ratio / 100).toFixed(2)

    const HVACPM = (valueHVAC * selectedProfileData!.hvac_pm_ratio / 100).toFixed(2)
    const HVACAssistant = (valueHVAC * selectedProfileData!.hvac_pm_assistant_ratio / 100).toFixed(2) 
    const HVACDesigner = (valueHVAC * selectedProfileData!.hvac_designer_ratio / 100).toFixed(2)
    const HVACDrafter = (valueHVAC * selectedProfileData!.hvac_drafter_ratio / 100).toFixed(2)
    const HVACPostService = (valueHVAC * selectedProfileData!.hvac_design_post_service_ratio / 100).toFixed(2)
    const HVACProofreader = (valueHVAC * selectedProfileData!.hvac_proofreader_ratio / 100).toFixed(2)
    const HVACReviewer = (valueHVAC * selectedProfileData!.hvac_reviewer_ratio / 100).toFixed(2)
    const HVACApprover = (valueHVAC * selectedProfileData!.hvac_approver_ratio / 100).toFixed(2)

    const lowVoltagePM = (valueLowVoltage * selectedProfileData!.low_voltage_pm_ratio / 100).toFixed(2)
    const lowVoltageAssistant = (valueLowVoltage * selectedProfileData!.low_voltage_pm_assistant_ratio / 100).toFixed(2)
    const lowVoltageDesigner = (valueLowVoltage * selectedProfileData!.low_voltage_designer_ratio / 100).toFixed(2)
    const lowVoltageDrafter = (valueLowVoltage * selectedProfileData!.low_voltage_drafter_ratio / 100).toFixed(2)
    const lowVoltagePostService = (valueLowVoltage * selectedProfileData!.low_voltage_design_post_service_ratio / 100).toFixed(2)
    const lowVoltageProofreader = (valueLowVoltage * selectedProfileData!.low_voltage_proofreader_ratio / 100).toFixed(2)
    const lowVoltageReviewer = (valueLowVoltage * selectedProfileData!.low_voltage_reviewer_ratio / 100).toFixed(2)
    const lowVoltageApprover = (valueLowVoltage * selectedProfileData!.low_voltage_approver_ratio / 100).toFixed(2)

    const inaccuracy = (resProject.data?.calculated_employee_payout - (Number(pm)+Number(pmAssistant)+
    Number(archPM)+Number(archAssistant)+Number(archDesigner)+Number(archDrafter)+Number(archPostService)+Number(archProofreader)+Number(archReviewer)+Number(archApprover)+
    Number(structPM)+Number(structAssistant)+Number(structDesigner)+Number(structDrafter)+Number(structPostService)+Number(structProofreader)+Number(structReviewer)+Number(structApprover)+
    Number(plumbingPM)+Number(plumbingAssistant)+Number(plumbingDesigner)+Number(plumbingDrafter)+Number(plumbingPostService)+Number(plumbingProofreader)+Number(plumbingReviewer)+Number(plumbingApprover)+
    Number(electricPM)+Number(electricAssistant)+Number(electricDesigner)+Number(electricDrafter)+Number(electricPostService)+Number(electricProofreader)+Number(electricReviewer)+Number(electricApprover)+
    Number(HVACPM)+Number(HVACAssistant)+Number(HVACDesigner)+Number(HVACDrafter)+Number(HVACPostService)+Number(HVACProofreader)+Number(HVACReviewer)+Number(HVACApprover)+
    Number(lowVoltagePM)+Number(lowVoltageAssistant)+Number(lowVoltageDesigner)+Number(lowVoltageDrafter)+Number(lowVoltagePostService)+Number(lowVoltageProofreader)+Number(lowVoltageReviewer)+Number(lowVoltageApprover)))
    
    console.log("不准确度: "+inaccuracy);
    pm = (Number(pm)+Number(inaccuracy)).toFixed(2)

    const fields={
      designChief:'',
      designChiefPayout: pm,
      designAssistant:'',
      designAssistantPayout: pmAssistant,
      建筑设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      建筑产值:{
        pm: archPM,
        pm_assistant: archAssistant,
        designer:archDesigner,
        drafter:archDrafter,
        post_service:archPostService,
        proofreader:archProofreader,
        reviewer:archReviewer,
        approver:archApprover,
      },
      结构设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      结构产值:{
        pm: structPM,
        pm_assistant: structAssistant,
        designer:structDesigner,
        drafter:structDrafter,
        post_service:structPostService,
        proofreader:structProofreader,
        reviewer:structReviewer,
        approver:structApprover,
      },
      给排水设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      给排水产值:{
        pm: plumbingPM,
        pm_assistant:plumbingAssistant,
        designer:plumbingDesigner,
        drafter:plumbingDrafter,
        post_service:plumbingPostService,
        proofreader:plumbingProofreader,
        reviewer:plumbingReviewer,
        approver:plumbingApprover,
      },
      暖通设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      暖通产值:{
        pm:HVACPM,
        pm_assistant:HVACAssistant,
        designer:HVACDesigner,
        drafter:HVACDrafter,
        post_service:HVACPostService,
        proofreader:HVACProofreader,
        reviewer:HVACReviewer,
        approver:HVACApprover,
      },
      强电设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      强电产值:{
        pm:electricPM,
        pm_assistant:electricAssistant,
        designer:electricDesigner,
        drafter:electricDrafter,
        post_service:electricPostService,
        proofreader:electricProofreader,
        reviewer:electricReviewer,
        approver:electricApprover,
      },
      弱电设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      弱电产值:{
        pm:lowVoltagePM,
        pm_assistant:lowVoltageAssistant,
        designer:lowVoltageDesigner,
        drafter:lowVoltageDrafter,
        post_service:lowVoltagePostService,
        proofreader:lowVoltageProofreader,
        reviewer:lowVoltageReviewer,
        approver:lowVoltageApprover,
      }
      
    }
    setTableInit(fields)
    setDataSource([
      {
        key:'1',
        category: '建筑',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'2',
        category: '建筑',
        text: '产值',
        pm: archPM,
        pm_assistant: archAssistant,
        designer: archDesigner,
        drafter: archDrafter,
        post_service: archPostService,
        proofreader: archProofreader,
        reviewer: archReviewer,
        approver: archApprover,
      },
      {
        key:'3',
        category: '结构',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'4',
        category: '结构',
        text: '产值',
        pm: structPM,
        pm_assistant: structAssistant,
        designer: structDesigner,
        drafter: structDrafter,
        post_service: structPostService,
        proofreader: structProofreader,
        reviewer: structReviewer,
        approver: structApprover,
      },
      {
        key:'5',
        category: '给排水',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'6',
        category: '给排水',
        text: '产值',
        pm: plumbingPM,
        pm_assistant: plumbingAssistant,
        designer: plumbingDesigner,
        drafter: plumbingDrafter,
        post_service: plumbingPostService,
        proofreader: plumbingProofreader,
        reviewer: plumbingReviewer,
        approver: plumbingApprover,
      },
      {
        key:'7',
        category: '暖通',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'8',
        category: '暖通',
        text: '产值',
        pm: HVACPM,
        pm_assistant: HVACAssistant,
        designer: HVACDesigner,
        drafter: HVACDrafter,
        post_service: HVACPostService,
        proofreader: HVACProofreader,
        reviewer: HVACReviewer,
        approver: HVACApprover,
      },
      {
        key:'9',
        category: '强电',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'10',
        category: '强电',
        text: '产值',
        pm: electricPM,
        pm_assistant: electricAssistant,
        designer: electricDesigner,
        drafter: electricDrafter,
        post_service: electricPostService,
        proofreader: electricProofreader,
        reviewer: electricReviewer,
        approver: electricApprover,
      },
      {
        key:'11',
        category: '弱电',
        text: '设计人',
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      },
      {
        key:'12',
        category: '弱电',
        text: '产值',
        pm: lowVoltagePM,
        pm_assistant: lowVoltageAssistant,
        designer: lowVoltageDesigner,
        drafter: lowVoltageDrafter,
        post_service: lowVoltagePostService,
        proofreader: lowVoltageProofreader,
        reviewer: lowVoltageReviewer,
        approver: lowVoltageApprover,
      },
    ])

    formPayout.setFieldsValue({
      designChief:'',
      designChiefPayout: pm,
      designAssistant:'',
      designAssistantPayout: pmAssistant,
      建筑设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      建筑产值:{
        pm: archPM,
        pm_assistant: archAssistant,
        designer:archDesigner,
        drafter:archDrafter,
        post_service:archPostService,
        proofreader:archProofreader,
        reviewer:archReviewer,
        approver:archApprover,
      },
      结构设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      结构产值:{
        pm: structPM,
        pm_assistant: structAssistant,
        designer:structDesigner,
        drafter:structDrafter,
        post_service:structPostService,
        proofreader:structProofreader,
        reviewer:structReviewer,
        approver:structApprover,
      },
      给排水设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      给排水产值:{
        pm: plumbingPM,
        pm_assistant:plumbingAssistant,
        designer:plumbingDesigner,
        drafter:plumbingDrafter,
        post_service:plumbingPostService,
        proofreader:plumbingProofreader,
        reviewer:plumbingReviewer,
        approver:plumbingApprover,
      },
      暖通设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      暖通产值:{
        pm:HVACPM,
        pm_assistant:HVACAssistant,
        designer:HVACDesigner,
        drafter:HVACDrafter,
        post_service:HVACPostService,
        proofreader:HVACProofreader,
        reviewer:HVACReviewer,
        approver:HVACApprover,
      },
      强电设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      强电产值:{
        pm:electricPM,
        pm_assistant:electricAssistant,
        designer:electricDesigner,
        drafter:electricDrafter,
        post_service:electricPostService,
        proofreader:electricProofreader,
        reviewer:electricReviewer,
        approver:electricApprover,
      },
      弱电设计人:{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      弱电产值:{
        pm:lowVoltagePM,
        pm_assistant:lowVoltageAssistant,
        designer:lowVoltageDesigner,
        drafter:lowVoltageDrafter,
        post_service:lowVoltagePostService,
        proofreader:lowVoltageProofreader,
        reviewer:lowVoltageReviewer,
        approver:lowVoltageApprover,
      }
      
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

  const handleSave = (row: any) => {
    console.log(row,'ooooooooooooo');
    
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    
    setDataSource(newData);
  };

  const components = {
    body: {
      // row: EditableRow,
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
              form: formPayout,
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

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const newDataSource = [...dataSource];

    // Update dataSource based on form values
    Object.entries(changedValues).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const category = key.includes('设计人') ? key.replace('设计人','') : key.replace('产值','');
        const text = key.includes('设计人') ? '设计人' : '产值';
        const index = newDataSource.findIndex(item => item.category === category && item.text === text);
        
        if (index !== -1) {
          newDataSource[index] = {
            ...newDataSource[index],
            ...value as DataType,
          };
        }
      }
    });

    // Update designChief and designAssistant separately
    const designChiefIndex = newDataSource.findIndex(item => item.category === '设计总负责' && item.text === '设计人');
    if (designChiefIndex !== -1) {
      newDataSource[designChiefIndex].pm = allValues.designChief || '';
    }

    const designAssistantIndex = newDataSource.findIndex(item => item.category === '设计总负责' && item.text === '设计人');
    if (designAssistantIndex !== -1) {
      newDataSource[designAssistantIndex].pm_assistant = allValues.designAssistant || '';
    }

    setDataSource(newDataSource);
  };


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
          
          <Form form={formPayout} onFinish={handlePayoutFinish} initialValues={tableInit} onValuesChange={handleFormValuesChange}>
          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(formPayout.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            
              <Row gutter={16}>
                <Col span={6}>
                <Form.Item label="设计总负责人" name="designChief">
                  <AutoComplete options={designChiefOptions} onSearch={onSearchDesignChief} onSelect={onSelectDesignChief} placeholder="input here"/>
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
              {/* <Form.List name=''>
                {(fields, operation) =>
                  <Table<DataType>
                  components={components}
                  rowClassName={() => "editable-row"}
                  bordered
                  dataSource={dataSource}
                  columns={columns as ColumnTypes}
                  pagination={false}
                />
                }
              </Form.List> */}
              <EditableContext.Provider value={formPayout}>
              
                <Table<DataType>
                  components={components}
                  rowClassName={() => "editable-row"}
                  bordered
                  dataSource={dataSource}
                  columns={columns as ColumnTypes}
                  pagination={false}
                />
              </EditableContext.Provider>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交产值表
                </Button>
                
              </Form.Item>
              
            </Space>
            
          </Form>
        }
            
      </Space>
      

    </div>
  );
};


