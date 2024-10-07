import React, { Key, useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, Typography} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import { DepartmentPublicOut, DepartmentsService, EmployeeCreateIn, EmployeeData, EmployeePublicOut, EmployeeService, EmployeeStatusesService, EmployeeTitlePublicOut, EmployeeTitlesService, EmployStatusPublicOut, ProfessionalTitlePublicOut, ProfessionalTitlesService, WorkLocationPublicOut, WorkLocationsService } from '../client';
import { useAuth } from '../context/AuthContext';
import { FilterDropdownProps } from 'antd/es/table/interface';
import pinyin from 'chinese-to-pinyin';
import MySelectComponent from '../components/Dropdown';


type EmployeeFullDetails = Omit<EmployeePublicOut, 'department_id' | 'work_location_id' | 'employee_title_id' | 'professional_title_id' | 'employ_status_id'> & {
    key:string;
    department: Pick<DepartmentPublicOut,'name'>;
    workLocation: Pick<WorkLocationPublicOut, 'name'>;
    employeeTitle: Pick<EmployeeTitlePublicOut, 'name'>;
    professionalTitle: Pick<ProfessionalTitlePublicOut, 'name'>;
    employmentStatus: Pick<EmployStatusPublicOut, 'name'>;
};
// interface EditableColumnType<T> extends TableColumnsType<T>{
//     editable?: boolean;
//     inputType?: 'text' | 'number' | 'dropdown';
// }
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    editable?: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'dropdown';
    record: EmployeeFullDetails;
    index: number;
    options?: any[]; // dropdown options
}


const onChange: TableProps<EmployeeFullDetails>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

export const Employees: React.FC = () => {
    
    const {user} = useAuth()
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState<number | Key>('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [employees, setEmployees] = useState<EmployeeFullDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing
    const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
    const [employeeTitles, setEmployeeTitles] = useState<EmployeeTitlePublicOut[]>([])//use for dropdown while editing
    const [professionalTitles, setProfessionalTitles] = useState<ProfessionalTitlePublicOut[]>([])//use for dropdown while editing
    const [employeeStatus, setEmloyeeStatus] = useState<EmployStatusPublicOut[]>([])//use for dropdown while editing
    
    const [messageApi, contextHolder] = message.useMessage();
    
    const successMessage = (msg:string) => {
        messageApi.open({
        type: 'success',
        content: msg,
        });
    };
    const errorMessage = (msg:string) => {
        messageApi.open({
          type: 'error',
          content: msg,
        });
    };
    const isEditing = (record: EmployeeFullDetails) => record.id === editingKey;
    const showModal = () => {
        handleEditCancel()
        form.resetFields()
        setIsModalVisible(true);
    }
    const handleModalCancel = () => setIsModalVisible(false);
    const handleAddEmployee = async (values: any) => {
        try {
            console.log(values);
            form.validateFields(['name','department','workLocation','employeeTitle','professionalTitle','employmentStatus'])
            const requestBody:EmployeeData['CreateEmployee']={
                requestBody:{
                    name: values.name,
                    gov_id: null,
                    gender: values.gender,
                    department_id: departments.find(d => d.name===values.department)!!.id,
                    work_location_id: workLocations.find(d => d.name===values.workLocation)!!.id,
                    employee_title_id: employeeTitles.find(d => d.name===values.employeeTitle)!!.id,
                    professional_title_id: professionalTitles.find(d => d.name===values.professionalTitle)!!.id,
                    employ_status_id: employeeStatus.find(d => d.name===values.employmentStatus)!!.id,
                    birth_date: values.birth_date,
                }
            }
            console.log(requestBody);
            
            const repsonseCreateEmployee = await EmployeeService.createEmployee(requestBody)
            if(repsonseCreateEmployee){
                fetchEmployees()
                successMessage('创建成功')
                handleModalCancel()
            }else{
                errorMessage('创建失败')
            }
            //   const newEmployee = { ...values }; // 处理输入的表单数据
            //   await EmployeeService.addEmployee(newEmployee); // 假设这是添加人员的 API 请求
            //   fetchEmployees(); // 更新人员列表
            //   setIsModalVisible(false); // 关闭模态框
            //   form.resetFields(); // 重置表单
        } catch (error) {
           console.error('Error adding employee:', error);
         }
    };
    const handleEdit = (record: EmployeeFullDetails) => {
        //display data in edit input
        form.setFieldsValue({ 
            ...record,
        });
        setEditingKey(record.id!!);
        
    };
    const handleEditSave = async (data: EmployeeFullDetails) =>{
        console.log(data);
        try{
            await form.validateFields(['name']); // This line needs to be inside an async function

            const updatedData = await form.getFieldsValue();
            console.log(updatedData);
            const requestBody:EmployeeData['UpdateEmployee'] = {
                id:data.id,
                requestBody:{
                    name: updatedData.name,
                    gov_id:null,
                    gender:null,
                    department_id:departments.find(d => d.name===updatedData.department.name)!!.id,
                    work_location_id:workLocations.find(d => d.name===updatedData.workLocation.name)!!.id,
                    employee_title_id:employeeTitles.find(d => d.name===updatedData.employeeTitle.name)!!.id,
                    professional_title_id:professionalTitles.find(d => d.name===updatedData.professionalTitle.name)!!.id,
                    employ_status_id:employeeStatus.find(d => d.name===updatedData.employmentStatus.name)!!.id,
                    birth_date: updatedData.birth_date,
                    initial:pinyin(updatedData.name,{ keepRest: true, firstCharacter: true }),// 获取中文首字母时，保留未翻译的非中文字符
                    pinyin:pinyin(updatedData.name, {removeTone: true})
                }
            }
            console.log(requestBody.requestBody);
            console.log(pinyin(updatedData.name, {removeTone: true}));
            
            const repsonseUpdateEmployee = await EmployeeService.updateEmployee(requestBody)
            if(repsonseUpdateEmployee){
                successMessage('创建成功')
                setEmployees(prevEmployees => 
                    prevEmployees.map(emp => 
                        emp.id === data.id 
                        ? { ...emp, ...updatedData } // combining all properties of emp and updatedData. If both objects have properties with the same keys (like name or department), the values from updatedData will override the values from emp
                        : emp // Keep the other employees unchanged
                    )
                );
            }else{
                errorMessage('创建失败')
            }
            
        }catch (error) {
            console.error('Error saving data:', error);
            errorMessage('创建失败')
        }
        setEditingKey(null);

    }
    const handleEditCancel = () => {
        setEditingKey(null);
    };
    
    const handleLoadingChange = (enable: boolean) => {
        setLoading(enable);
    };

    // Delete function
    const handleDelete = async (id: number) => {
        console.log('Delete employee id:', id);
    };

    const handleSearch = (selectedKeys: React.Key[], confirm: FilterDropdownProps['confirm'], dataIndex: string) => {
        
        
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
    const handleReset = (clearFilters: (() => void)) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string): any => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0] as string}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
                >
                搜索
                </Button>
                <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                重置
                </Button>
            </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: string | number | boolean, record: EmployeeFullDetails) =>
            record['name'].toString().toLowerCase().includes((value as string).toLowerCase()),
        render: (text: string) =>
            searchedColumn === dataIndex ? (
            <span style={{ fontWeight: 'bold'}}>{text}</span>
            ) : (
            text
            ),
    });
    
    const columns = [
        {
            title: 'ID', dataIndex: 'id',  editable: false, inputType: 'text',width: 50,
        },
        {
            title: '姓名', dataIndex: 'name', editable: true, inputType: 'text', width: 100,
            filterSearch: true,...getColumnSearchProps('name'),
        },
        {
            title: '性别', dataIndex: 'gender',editable: true, inputType: 'text',width: 50,
            onCell: () => ({ style: { minWidth: 500 } }),
        },
        {
            title: '身份证号', dataIndex: 'gov_id', editable: false, inputType: 'text',width: 100,
        },
        {
            title: '生日', dataIndex: 'birth_date', editable: true, inputType: 'text', width: 100,
            render:(text:string | null) => text!==null && convertDateToYYYYMMDD(text)
            
        },
        {
            title: '部门', dataIndex: ['department', 'name'], editable: true, inputType: 'dropdown', options: departments,width: 100,
        },
        {
            title: '工作地点',dataIndex: ['workLocation', 'name'],editable: true,inputType: 'dropdown',options: workLocations,width: 100,
        },
        {
            title: '职位',dataIndex: ['employeeTitle', 'name'],editable: true,inputType: 'dropdown',options: employeeTitles,width: 100,
        },
        {
            title: '职称', dataIndex: ['professionalTitle', 'name'],editable: true,inputType: 'dropdown',options: professionalTitles,width: 100,
        },
        {
            title: '员工状态',dataIndex: ['employmentStatus', 'name'],editable: true,inputType: 'dropdown',options: employeeStatus, width: 100,
            filters: employeeStatus.map(status => ({ text: status.name, value: status.name })),
            //filteredValue: employeeStatus.map(status => status.name),//默认全部
            //filteredValue:[],
            filterSearch: true,
            onFilter: (value:any, record:EmployeeFullDetails) => {
                if (value === null) {
                    return true; // 当选择 "全部" 时，不过滤任何数据
                  }
                return record?.employmentStatus?.name === value;
            },
        },
        user?.is_superuser ? 
        {
            title: '操作',key: 'action', fixed: 'right', width: 100,
            render: (_:any, record:EmployeeFullDetails) => 
            {
            const editable = isEditing(record);
            return editable ? (
            <span>
                <Typography.Link onClick={() => handleEditSave(record)} style={{ marginInlineEnd: 8 }}>
                    保存
                </Typography.Link>
                <Typography.Link onClick={() => handleEditCancel()}>
                    取消
                </Typography.Link>
            </span>
            ) : (
            <span>
                <Typography.Link disabled={false} onClick={() => handleEdit(record)} style={{ marginInlineEnd: 8 }}>
                    修改
                </Typography.Link>
                {/* <Popconfirm title="确定要删除这行吗?" onConfirm={() => handleDelete(record.id)} okText='是' cancelText='否'>
                    
                    <a>删除</a>
                </Popconfirm> */}
            </span>
            );
        },
        }: {},
    ];
    const mergedColumns: TableColumnsType<EmployeeFullDetails> = columns.map((col) => {
        //if editable: true in columns, use original col
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: EmployeeFullDetails) => ({
            record,
            inputType: col.inputType || 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
            options: col.options, // 下拉框选项
            
          }),
        };
      });
    const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        options = [],
        ...restProps
      }) => {
        
        let inputNode = <Input />;
        if (inputType === 'dropdown') {
        inputNode =                         <MySelectComponent options={employeeStatus}/>

        } else if (inputType === 'number') {
            inputNode = <InputNumber />;
        }
        return (
          <td {...restProps}>
            {editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0}} rules={[
                    {required: true, message: `Please Input ${title}!`,},
                ]}>
                    {inputNode}
                </Form.Item>
            ) : (
              children
            )}
          </td>
        );
    };
    const fetchEmployees = async () => {
        try {
            //show loading spinner on table
            handleLoadingChange(true)
            // Fetch data from the service
            const responseEmployees = await EmployeeService.readEmployees({showDisabled: true, limit:300});
            const responseDepartments = await DepartmentsService.readDepartments();
            const responseWorkLocations= await WorkLocationsService.readWorkLocations();
            const responseEmployeeTitles= await EmployeeTitlesService.readEmployeeTitles();
            const responseProfessionalTitles = await ProfessionalTitlesService.readProfessionalTitles();
            const responseEmployeeStatuses = await EmployeeStatusesService.readEmployeeStatuses();
            
            console.log(responseEmployees,'ppppppp');
            
            const employeeFullDetails: EmployeeFullDetails[] = responseEmployees.data.map(employee => ({
                ...employee,
                key: employee.id.toString(),
                department: responseDepartments.data.find(dept => dept.id === employee.department_id)!,
                workLocation: responseWorkLocations.data.find(location => location.id === employee.work_location_id)!,
                employeeTitle: responseEmployeeTitles.data.find(title => title.id === employee.employee_title_id)!,
                professionalTitle: responseProfessionalTitles.data.find(profTitle => profTitle.id === employee.professional_title_id)!,
                employmentStatus: responseEmployeeStatuses.data.find(status => status.id === employee.employ_status_id)!,
            }));
            
            setEmployees(employeeFullDetails)
            setDepartments(responseDepartments.data)
            setWorkLocations(responseWorkLocations.data)
            setEmployeeTitles(responseEmployeeTitles.data)
            setProfessionalTitles(responseProfessionalTitles.data)
            setEmloyeeStatus(responseEmployeeStatuses.data)
            //.log(employeeFullDetails);
            
        } catch (error) {
          console.error("Error fetching employees and related data:", error);
        } finally {
            // Stop the loading spinner on table once the data is fetched
            handleLoadingChange(false); 
        }
      };
    const convertDateToYYYYMMDD = (dateStr:string) => {
        const date = new Date(dateStr); 
        const formattedDate = date.toLocaleDateString('en-CA', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    return formattedDate;
    };
    useEffect(()=>{
        fetchEmployees()
    },[])

    return (
        <div>
            {contextHolder}
            {user?.is_superuser &&
            <Button onClick={showModal} type="primary" style={loading || employees.length===0 ? { marginBottom: 16} : { marginBottom: 16,position: 'absolute', zIndex:1}}>
                <PlusOutlined />
                添加
            </Button>
            }
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                        cell: EditableCell,
                        },
                    }}
                    rowClassName="editable-row"
                    rowKey='id'
                    loading={loading}
                    columns={mergedColumns}
                    dataSource={employees}
                    onChange={onChange}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                    pagination={{pageSize:10, position:['topRight']}}
                    scroll={{ x:500 }}
                />
            </Form>
            <Modal
                title="添加新人员"
                open={isModalVisible}
                onCancel={handleModalCancel}
                onOk={() => form.submit()}
                okText="添加"
                cancelText="取消"
            >
                <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="性别" rules={[{ message: '请选择性别!' }]}>
                        <Select>
                            <Select.Option value="男">男</Select.Option>
                            <Select.Option value="女">女</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="birth_date" label="生日" rules={[{ message: '请输入生日!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="department" label="部门" rules={[{ required: true, message: '请选择部门!' }]}>
                    <MySelectComponent options={departments}/>

                    </Form.Item>
                    <Form.Item name="workLocation" label="工作地点" rules={[{ required: true, message: '请选择工作地点!' }]}>
                    <MySelectComponent options={workLocations}/>

                    </Form.Item>
                    <Form.Item name="employeeTitle" label="职位" rules={[{ required: true,message: '请选择职位!' }]}>
                    <MySelectComponent options={employeeTitles}/>

                    </Form.Item>
                    <Form.Item name="professionalTitle" label="职称" rules={[{ required: true,message: '请选择职称!' }]}>
                    <MySelectComponent options={professionalTitles}/>

                    </Form.Item>
                    <Form.Item name="employmentStatus" label="员工状态" rules={[{ required: true,message: '请选择员工状态!' }]}>
                        {/* {renderDropdown(employeeStatus)} */}
                        <MySelectComponent options={employeeStatus}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
  )
}
