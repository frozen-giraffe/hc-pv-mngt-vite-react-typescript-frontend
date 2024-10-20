import React, { useContext, useEffect, useRef, useState } from "react";
import type { AutoCompleteProps, GetRef, InputRef, TableProps } from "antd";
import {EditOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Col, Collapse, Divider, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import { DepartmentPayoutRatiosService, DepartmentPublicOut, DepartmentsService, EmployeePublicOut, EmployeeService, JobPayoutRatioProfilePublicOut, JobPayoutRatioProfilesService, ProjectsService, WorkLocationPublicOut, WorkLocationsService } from "../client";
import type { BaseSelectRef } from 'rc-select'; // Import the correct type
import { InfoCircleOutlined } from '@ant-design/icons';
import './PayoutTable.css'
import PayoutInput from "./PayoutInput";
//import type { FormInstance } from 'antd/es/form';
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);
const employeeCache: { [key: string]: EmployeePublicOut } = {};

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

// Add this custom validator function
const validateEmployee = (_, value, payoutValue) => {
  if (Number(payoutValue) !== 0 && (value === undefined || value === '')) {
    return Promise.reject(new Error('员工不能为空'));
  }
  return Promise.resolve();
};

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
  const [options, setOptions] = useState<(EmployeePublicOut & {value:number, label:string})[]>([])
  const selectRef  = useRef<BaseSelectRef>(null);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const [employeeName, setEmployeeName] = useState<string>('');
  
  useEffect(() => {
    if (editing) {
      record?.text === '设计人' ? selectRef.current?.focus() : inputRef.current?.focus();
    }
    
    // Set initial employee name when editing starts
    if (editing && record?.text === '设计人' && record[dataIndex]) {
      const employeeId = record[dataIndex];
      const employee = employeeCache[employeeId];
      if (employee) {
        setEmployeeName(employee.name);
      }
    }
  }, [editing, record, dataIndex]);
  
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
    form.setFieldValue([record?.category + record?.text, dataIndex], record[dataIndex] || "");
    
    // Set employee name when toggling edit mode
    if (record?.text === '设计人' && record[dataIndex]) {
      const employeeId = record[dataIndex];
      const employee = employeeCache[employeeId];
      if (employee) {
        setEmployeeName(employee.name);
      }
    }
  };
  // const setValueToFormField=()=>{
  //   form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });

  // }

  const save = async () => {
    try {
      // Validate only the current field
      await form.validateFields([[record?.category + record?.text, dataIndex]]);
      
      const values = form.getFieldsValue();
      let internalValue = {};
      
      // Extract the value for the current cell
      if (values[record?.category + record?.text]) {
        internalValue = { [dataIndex]: values[record?.category + record?.text][dataIndex] };
      }
      
      // If this is a 设计人 cell, store the employee object
      if (record.text === '设计人') {
        const employeeId = internalValue[dataIndex];
        if (employeeId && employeeCache[employeeId]) {
          internalValue[dataIndex] = employeeCache[employeeId];
        }
      }
      
      handleSave({ ...record, ...internalValue });
      toggleEdit();
    } catch (error) {
      // If there's an error, don't toggle edit mode
      console.log('存错误:', error);
    }
  };
  
  const onSelect = async (data: string) => {
    const person = options.find((value) => value.id === parseInt(data));
    if (person) {
      setEmployeeName(person.name);
      setEditing(false);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }

      form.setFieldValue([record?.category + record?.text, dataIndex], person.id);
    }
  };
  
  const onSearch = async(searchText:string) => {
    if(searchText === "") {
      setOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
        query: {
          department_id: department?.id
        }
      })
      if(response.data){
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => {
          // Add employee to cache
          employeeCache[employee.id.toString()] = employee;
          return {
            ...employee,
            label: employee.name,
            value: employee.id.toString()
          };
        });
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
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => 
              validateEmployee(
                _, 
                value, 
                getFieldValue([record?.category + '产值', dataIndex])
              )
          })
        ]}
      >
        {record?.text === '设计人' ? 
          <Select
            showSearch
            ref={selectRef}
            onBlur={save}
            filterOption={false}
            value={employeeName==='' ? undefined : employeeName}
            options={options.map((option) => ({
              key: option.id,
              value: option.id,
              label: (
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
            notFoundContent={employeeName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
            allowClear={true}
            popupMatchSelectWidth={false}
            placeholder={`模糊搜索员工`}
          />
        :
        <PayoutInput ref={inputRef} onPressEnter={save} onBlur={save} />
        }
      </Form.Item>
    ) : (
      <Form.Item
        style={{ margin: 0 }}
        name={formName}
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => 
              validateEmployee(
                _, 
                value, 
                getFieldValue([record?.category + '产值', dataIndex])
              )
          })
        ]}
      >
        <div
          className="editable-cell-value-wrap"
          onClick={toggleEdit}
        >
      {record.text === '设计人' && typeof children[1] === 'number'
        ? employeeCache[children[1]]?.name || children
        : children}
    </div>
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const { Text } = Typography;

export const PayoutTable: React.FC = () => {
  
  const [formPayout] = Form.useForm();
  const [selectedProfileId, setSelectedProfileId] = useState<
    number | undefined
  >(undefined);
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );
  const [tableInit, setTableInit] = useState({})
  const [PMOptions, setPMOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [selectedProfileData, setSelectedProfileData] = useState<JobPayoutRatioProfilePublicOut | null>(null);
  const [togglePayoutTable, setTogglePayoutTable] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<{ [key: string]: EmployeePublicOut }>({});
  const [inaccuracy, setInaccuracy] = useState<number>(0)
  const [isSumValid, setIsSumValid] = useState<boolean>(false)
  const [totalSum, setTotalSum] = useState<number>(0)
  const [pmOptions, setPmOptions] = useState<(EmployeePublicOut & {value: number, label: string})[]>([])
  const [pmAssistantOptions, setPmAssistantOptions] = useState<(EmployeePublicOut & {value: number, label: string})[]>([])
  const [pmName, setPmName] = useState<string>('');
  const [pmAssistantName, setPmAssistantName] = useState<string>('');
  
  const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
  const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing
  const [dataSource, setDataSource] = useState<DataType[]>([
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
      pm: '',
      pm_assistant: '',
      designer: '',
      drafter: '',
      post_service: '',
      proofreader: '',
      reviewer: '',
      approver: '',
    },
  ])

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
  const onSelectPM = (value: number, option: any) => {
    formPayout.setFieldValue('pm', value)
  }
  const onSearchPM = async (searchText: string) => {
    if (searchText === "") {
      setPMOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
      })
      if (response.error) {
        message.error("自动查询失败: " + response.error)
        return
      }
      const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => ({
        ...employee,
        label: employee.name,
        value: employee.id,
        key: employee.id,
      }));
      setPMOptions(formattedOptions)
    } catch (error) {
      message.error("自动查询失败: " + error)
    }
  }
  const handlePayoutFinish = async () => {
    try {
      const values = await formPayout.validateFields();
      console.log("表单提交时的值:", values);
      // Here you can proceed with submitting the form data
    } catch (error) {
      console.log('表单验证错误:', error);
    }
  };
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
    
    console.log("四舍五入后不准确度: "+inaccuracy);
    pm = (Number(pm)+Number(inaccuracy)).toFixed(2)
    setInaccuracy(inaccuracy)

    const fields={
      pm:'',
      pmPayout: pm,
      pmAssistant:'',
      pmAssistantPayout: pmAssistant,
      '建筑设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '建筑产值':{
        pm: archPM,
        pm_assistant: archAssistant,
        designer:archDesigner,
        drafter:archDrafter,
        post_service:archPostService,
        proofreader:archProofreader,
        reviewer:archReviewer,
        approver:archApprover,
      },
      '结构设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '结构产值':{
        pm: structPM,
        pm_assistant: structAssistant,
        designer:structDesigner,
        drafter:structDrafter,
        post_service:structPostService,
        proofreader:structProofreader,
        reviewer:structReviewer,
        approver:structApprover,
      },
      '给排水设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '给排水产值':{
        pm: plumbingPM,
        pm_assistant:plumbingAssistant,
        designer:plumbingDesigner,
        drafter:plumbingDrafter,
        post_service:plumbingPostService,
        proofreader:plumbingProofreader,
        reviewer:plumbingReviewer,
        approver:plumbingApprover,
      },
      '暖通设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '暖通产值':{
        pm:HVACPM,
        pm_assistant:HVACAssistant,
        designer:HVACDesigner,
        drafter:HVACDrafter,
        post_service:HVACPostService,
        proofreader:HVACProofreader,
        reviewer:HVACReviewer,
        approver:HVACApprover,
      },
      '强电设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '强电产值':{
        pm:electricPM,
        pm_assistant:electricAssistant,
        designer:electricDesigner,
        drafter:electricDrafter,
        post_service:electricPostService,
        proofreader:electricProofreader,
        reviewer:electricReviewer,
        approver:electricApprover,
      },
      '弱电设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '弱电产值':{
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
    const fieldsValue = {
      pm:'',
      pmPayout: pm,
      pmAssistant:'',
      pmAssistantPayout: pmAssistant,
      '建筑设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '建筑产值':{
        pm: archPM,
        pm_assistant: archAssistant,
        designer:archDesigner,
        drafter:archDrafter,
        post_service:archPostService,
        proofreader:archProofreader,
        reviewer:archReviewer,
        approver:archApprover,
      },
      '结构设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '结构产值':{
        pm: structPM,
        pm_assistant: structAssistant,
        designer:structDesigner,
        drafter:structDrafter,
        post_service:structPostService,
        proofreader:structProofreader,
        reviewer:structReviewer,
        approver:structApprover,
      },
      '给排水设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '给排水产值':{
        pm: plumbingPM,
        pm_assistant:plumbingAssistant,
        designer:plumbingDesigner,
        drafter:plumbingDrafter,
        post_service:plumbingPostService,
        proofreader:plumbingProofreader,
        reviewer:plumbingReviewer,
        approver:plumbingApprover,
      },
      '暖通设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '暖通产值':{
        pm:HVACPM,
        pm_assistant:HVACAssistant,
        designer:HVACDesigner,
        drafter:HVACDrafter,
        post_service:HVACPostService,
        proofreader:HVACProofreader,
        reviewer:HVACReviewer,
        approver:HVACApprover,
      },
      '强电设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '强电产值':{
        pm:electricPM,
        pm_assistant:electricAssistant,
        designer:electricDesigner,
        drafter:electricDrafter,
        post_service:electricPostService,
        proofreader:electricProofreader,
        reviewer:electricReviewer,
        approver:electricApprover,
      },
      '弱电设计人':{
        pm: '',
        pm_assistant: '',
        designer:'',
        drafter:'',
        post_service:'',
        proofreader:'',
        reviewer:'',
        approver:'',
      },
      '弱电产值':{
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
    formPayout.setFieldsValue(fieldsValue)
    handleFormValuesChange(fieldsValue,fieldsValue)
      
  }
  

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  // Modify the calculateRowSum function to accept a category
  const calculateRowSum = (category: string, formValues: any) => {
    const rowData = formValues[`${category}产值`] || {};
    const values = [
      rowData.pm,
      rowData.pm_assistant,
      rowData.designer,
      rowData.drafter,
      rowData.post_service,
      rowData.proofreader,
      rowData.reviewer,
      rowData.approver
    ];
    return values.reduce((sum, value) => sum + (Number(value) || 0), 0).toFixed(2);
  };

  // Modify the defaultColumns array
  const defaultColumns = [
    {
      title: "专业分类",
      dataIndex: "category",
      width: 60,
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
      width: 60,
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
      dataIndex: "subtotal",
      width: 100,
      render: (_, record, index) => {
        if (record.text === '产值') {
          const formValues = formPayout.getFieldsValue();
          return calculateRowSum(record.category, formValues);
        }
        return null;
      },
      onCell: (record: DataType, index: number) => {
        const cellProps = {} as any;
        if (index % 2 === 1) { // Display on '产值' rows
          cellProps.rowSpan = 1;
        } else {
          cellProps.rowSpan = 0;
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

    // Update form values
    const formValues = formPayout.getFieldsValue();
    formValues[`${row.category}${row.text}`] = row;
    formPayout.setFieldsValue(formValues);
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

  const [calculatedEmployeePayout, setCalculatedEmployeePayout] = useState<number>(0);

  // Add this function to calculate the total sum
  const calculateTotalSum = (formValues: any): number => {
    const departmentSums = ['建筑', '结构', '给排水', '暖通', '强电', '弱电'].reduce((sum, category) => {
      return sum + Number(calculateRowSum(category, formValues));
    }, 0);

    const pmPayout = Number(formValues.pmPayout) || 0;
    const pmAssistantPayout = Number(formValues.pmAssistantPayout) || 0;

    return departmentSums + pmPayout + pmAssistantPayout;
  };

  // Modify the handleFormValuesChange function
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const newDataSource = [...dataSource];
  
    Object.entries(changedValues).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const category = key.includes('设计人') ? key.replace('设计人','') : key.replace('产值','');
        const text = key.includes('设计人') ? '设计人' : '产值';
        const index = newDataSource.findIndex(item => item.category === category && item.text === text);
        
        if (index !== -1) {
          newDataSource[index] = {
            ...newDataSource[index],
            ...value,
          };
        }
      }
    });

    // Update pm and pmAssistant separately
    const pmIndex = newDataSource.findIndex(item => item.category === '项目负责' && item.text === '设计人');
    if (pmIndex !== -1) {
      newDataSource[pmIndex].pm = allValues.pm ? parseInt(allValues.pm, 10) : '';
    }
  
    const pmAssistantIndex = newDataSource.findIndex(item => item.category === '项目负责' && item.text === '设计人');
    if (pmAssistantIndex !== -1) {
      newDataSource[pmAssistantIndex].pm_assistant = allValues.pmAssistant ? parseInt(allValues.pmAssistant, 10) : '';
    }
  
    setDataSource(newDataSource);

    // Calculate and update the total sum
    const totalSum = calculateTotalSum(allValues);
    setTotalSum(totalSum);

    // Check if the total sum matches the calculated employee payout
    setIsSumValid(Math.abs(totalSum - calculatedEmployeePayout) < 0.001);
  };

  // Add this effect to update the calculated employee payout when the project data is fetched
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await ProjectsService.readProject({
          path: { id: 1812 } // Replace with the actual project ID
        });
        if (response.data) {
          setCalculatedEmployeePayout(response.data.calculated_employee_payout);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, []);

  const onSelectPm = async (data: string) => {
    const person = pmOptions.find((value) => value.id === parseInt(data));
    if (person) {
      setPmName(person.name);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setPmOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }
      formPayout.setFieldValue('pm', person.id);
    }
  };

  const onSearchPm = async (searchText: string) => {
    if (searchText === "") {
      setPmOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        }
      })
      if (response.data) {
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,
          label: employee.name,
          value: employee.id
        }));
        setPmOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSelectPmAssistant = async (data: string) => {
    const person = pmAssistantOptions.find((value) => value.id === parseInt(data));
    if (person) {
      setPmAssistantName(person.name);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setPmAssistantOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }
      formPayout.setFieldValue('pmAssistant', person.id);
    }
  };

  const onSearchPmAssistant = async (searchText: string) => {
    if (searchText === "") {
      setPmAssistantOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        }
      })
      if (response.data) {
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,
          label: employee.name,
          value: employee.id
        }));
        setPmAssistantOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
    }
  }

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
                  <Form.Item label="项目负责人" name="pm"  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value) => 
                        validateEmployee(
                          _, 
                          value, 
                          getFieldValue('pmPayout')
                        )
                      })
                    ]}>
                    <Select
                      showSearch
                      filterOption={false}
                      value={pmName === '' ? undefined : pmName}
                      options={pmOptions.map((option) => ({
                        key: option.id,
                        value: option.id,
                        label: (
                          <Space size={1} align="end">
                            <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                          </Space>
                        )
                      }))}
                      onSelect={onSelectPm}
                      onSearch={onSearchPm}
                      notFoundContent={pmName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
                      allowClear={true}
                      popupMatchSelectWidth={false}
                      placeholder={`模糊搜索员工`}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item 
                  label={
                    <>
                      项目负责人产值
                      {Math.abs(inaccuracy) > 0.01 && (
                        <Tooltip title={`四舍五入后与下发产值的差（${inaccuracy.toFixed(2)}）已计入项目负责人产值，如项目无项目负责人，请手动更改`}>
                          <InfoCircleOutlined style={{ marginLeft: '4px', color: 'orange' }}/>
                        </Tooltip>
                      )}
                    </>
                  } 
                  name='pmPayout'>
                  <Input></Input>
                </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="项目负责人助理" name='pmAssistant'  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value) => 
                        validateEmployee(
                          _, 
                          value, 
                          getFieldValue('pmAssistantPayout')
                        )
                      })
                    ]}>
                    <Select
                      showSearch
                      filterOption={false}
                      value={pmAssistantName === '' ? undefined : pmAssistantName}
                      options={pmAssistantOptions.map((option) => ({
                        key: option.id,
                        value: option.id,
                        label: (
                          <Space size={1} align="end">
                            <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                          </Space>
                        )
                      }))}
                      onSelect={onSelectPmAssistant}
                      onSearch={onSearchPmAssistant}
                      notFoundContent={pmAssistantName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
                      allowClear={true}
                      popupMatchSelectWidth={false}
                      placeholder={`模糊搜索员工`}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>

                  <Form.Item label="项目负责人助理产值" name='pmAssistantPayout'>
                    
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
                  size="small"
                />
              </EditableContext.Provider>
              
              {/* Add the 总计 field */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text strong style={{ marginRight: '10px' }}>总计:</Text>
                <Text 
                  strong 
                  style={{ 
                    fontSize: '18px', 
                    color: isSumValid ? 'inherit' : 'red' 
                  }}
                >
                  {calculateTotalSum(formPayout.getFieldsValue()).toFixed(2)}
                </Text>
                {!isSumValid && (
                  <Text type="danger" style={{ marginLeft: '10px' }}>
                    总计与下发产值不符
                  </Text>
                )}
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
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


