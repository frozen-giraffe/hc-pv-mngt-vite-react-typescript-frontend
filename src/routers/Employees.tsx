import React, { Key, useCallback, useEffect, useState } from 'react'
import { Button, Divider, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, Typography} from 'antd';
import { SearchOutlined, PlusOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableColumnType, TableProps } from 'antd';
import { DepartmentPublicOut, DepartmentsService, EmployeeCreateIn, EmployeeData, EmployeePublicOut, EmployeeService, EmployeeStatusesService, EmployeeTitlePublicOut, EmployeeTitlesService, EmployStatusPublicOut, ProfessionalTitlePublicOut, ProfessionalTitlesService, ReportsService, WorkLocationPublicOut, WorkLocationsService } from '../client';
import { useAuth } from '../context/AuthContext';
import { ColumnsType, FilterDropdownProps } from 'antd/es/table/interface';
import pinyin from 'chinese-to-pinyin';
import MySelectComponent from '../components/Dropdown';
import { downloadReport, useDownloadReport } from '../utils/ReportFileDownload';
import EmployeeReportModal from '../components/EmployeeReportModal';
import { useSearchParams, useNavigate } from "react-router-dom";
import { EMPLOYEE_PAGE_DEFAULT_PAGE_SIZE } from "../client/const";
import { GetColumnNames } from '../helper';
import FilterDropdown from '../components/FilterDropdown';

type EmployeeQueryParams = NonNullable<
  Parameters<typeof EmployeeService.readEmployees>[0]
>["query"];

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
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [employees, setEmployees] = useState<EmployeeFullDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing
    const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
    const [employeeTitles, setEmployeeTitles] = useState<EmployeeTitlePublicOut[]>([])//use for dropdown while editing
    const [professionalTitles, setProfessionalTitles] = useState<ProfessionalTitlePublicOut[]>([])//use for dropdown while editing
    const [employeeStatus, setEmloyeeStatus] = useState<EmployStatusPublicOut[]>([])//use for dropdown while editing
    const [isEmployeeReportModalVisible, setIsEmployeeReportModalVisible] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(EMPLOYEE_PAGE_DEFAULT_PAGE_SIZE);
    
    const [filters, setFilters] = useState<Partial<EmployeeQueryParams>>({});
    const [tableRefreshKey, setTableRefreshKey] = useState(0);


    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
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

    const [isStaticDataLoaded, setIsStaticDataLoaded] = useState(false);

    const getEmployeePublicOutColumn = GetColumnNames<EmployeePublicOut>();

    useEffect(() => {
        fetchStaticData();
    }, []);


    const fetchEmployees = useCallback(async (page: number, size: number, filters: Partial<EmployeeQueryParams>) => {
        if (!isStaticDataLoaded) {
            console.log("Static data not loaded yet, skipping employee fetch");
            return;
        }

        try {
            handleLoadingChange(true);
            const responseEmployees = await EmployeeService.readEmployees({
                query: {
                    skip: (page - 1) * size,
                    limit: size,
                    show_disabled: true,
                    ...filters,
                }
            });

            if (responseEmployees.error) {
                message.error("获取员工失败: " + responseEmployees.error.detail);
                return;
            }

            if (responseEmployees.data) {
                const employeeFullDetails: EmployeeFullDetails[] = responseEmployees.data.data.map(employee => ({
                    ...employee,
                    key: employee.id.toString(),
                    department: departments.find(dept => dept.id === employee.department_id) || { name: 'Unknown' },
                    workLocation: workLocations.find(location => location.id === employee.work_location_id) || { name: 'Unknown' },
                    employeeTitle: employeeTitles.find(title => title.id === employee.employee_title_id) || { name: 'Unknown' },
                    professionalTitle: professionalTitles.find(profTitle => profTitle.id === employee.professional_title_id) || { name: 'Unknown' },
                    employmentStatus: employeeStatus.find(status => status.id === employee.employ_status_id) || { name: 'Unknown' },
                }));

                setEmployees(employeeFullDetails);
                setTotalEmployees(responseEmployees.data.count);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            message.error("获取员工数据失败，请重试");
        } finally {
            handleLoadingChange(false);
        }
    }, [isStaticDataLoaded, departments, workLocations, employeeTitles, professionalTitles, employeeStatus]);


    useEffect(() => {
        if (isStaticDataLoaded) {
            const search_current_page = searchParams.get("current_page");
            const search_page_size = searchParams.get("page_size");
            if (search_current_page) {
                setCurrentPage(parseInt(search_current_page));
            }
            if (search_page_size) {
                setPageSize(parseInt(search_page_size));
            }

            const newFilters: Partial<EmployeeQueryParams> = {};
            for (const [key, value] of searchParams.entries()) {
                if (key in {
                    name: true,
                    gender: true,
                    gov_id: true,
                    department_id: true,
                    work_location_id: true,
                    employee_title_id: true,
                    employ_status_id: true,
                    professional_title_id: true,
                    birth_date_from: true,
                    birth_date_to: true,
                    sort_by: true,
                    sort_direction: true,
                }) {
                    newFilters[key as keyof EmployeeQueryParams] = value;
                }
            }
            setFilters(newFilters);

            fetchEmployees(currentPage, pageSize, newFilters);
        }
    }, [searchParams, currentPage, pageSize, isStaticDataLoaded, fetchEmployees]);

      // Add this function to get the filtered value for a specific filter
    const getFilteredValue = (key: string): string[] | undefined => {
        const value = filters?.[key as keyof EmployeeQueryParams];
        return value ? [value] : undefined;
    };

    // Add this function to get the filtered value for date range filters
    const getDateRangeFilteredValue = (key: string): string[] | undefined => {
        const fromValue = filters?.[`${key}_from` as keyof EmployeeQueryParams];
        const toValue = filters?.[`${key}_to` as keyof EmployeeQueryParams];
        return fromValue || toValue
        ? ([fromValue, toValue].filter(Boolean) as string[])
        : undefined;
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
            if(repsonseCreateEmployee.data){
                fetchEmployees(currentPage, pageSize, filters)
                successMessage('创建成功')
                handleModalCancel()
            }else{
                errorMessage('创建失败')
            }
            //   const newEmployee = { ...values }; // 处理输入的表单数据
            //   await EmployeeService.addEmployee(newEmployee); // 假设这是添加人员的 API 请求
            //   fetchEmployees(); // 更新人员列表
            //   setIsAddEmployeeModalVisible(false); // 关闭模态框
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
        setEditingKey(record.id);
        
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
            if(repsonseUpdateEmployee.data){
                successMessage('创建成功')
                fetchEmployees(currentPage, pageSize, filters)
            }else{
                errorMessage('创建失败：'+repsonseUpdateEmployee.error.detail)
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
    
    const columns: ColumnsType<EmployeeFullDetails> = [
        {
            title: 'ID', dataIndex: 'id',  editable: false, inputType: 'text',width: 50,
            key: getEmployeePublicOutColumn('id'),
            sorter: true,
        },
        {
            title: '姓名', dataIndex: 'name', editable: true, inputType: 'text', width: 100,
            key: getEmployeePublicOutColumn('name'),
            sorter: true,
            filteredValue: getFilteredValue('name'),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => (
                <FilterDropdown
                    type="input"
                    placeholder="模糊搜索姓名"
                    value={selectedKeys[0]}
                    onChange={setSelectedKeys}
                    onConfirm={() => confirm({ closeDropdown: true })}
                    onClear={clearFilters || (() => {})}
                />
            )
        },
        {
            title: '性别', dataIndex: 'gender',editable: true, inputType: 'text',width: 50,
            key: getEmployeePublicOutColumn('gender'),
            onCell: () => ({ style: { minWidth: 500 } }),
        },
        {
            title: '身份证号', dataIndex: 'gov_id', editable: false, inputType: 'text',width: 100,
            key: getEmployeePublicOutColumn('gov_id'),
            filteredValue: getFilteredValue('gov_id'),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => (
                <FilterDropdown
                    type="input"
                    placeholder="模糊搜索身份证号"
                    value={selectedKeys[0]}
                    onChange={setSelectedKeys}
                    onConfirm={() => confirm({ closeDropdown: true })}
                    onClear={clearFilters || (() => {})}
                />
            )
        },
        {
            title: '生日', dataIndex: 'birth_date', editable: true, inputType: 'text', width: 100,
            render:(text:string | null) => text!==null && convertDateToYYYYMMDD(text),
            key: getEmployeePublicOutColumn('birth_date'),
            sorter: true,
            filteredValue: getDateRangeFilteredValue('birth_date'),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }) => (
                <FilterDropdown
                    type="date_range"
                    placeholder={["开始日期", "结束日期"]}
                    value={selectedKeys}
                    onChange={(values) => {
                        setSelectedKeys([values[0], values[1]]);
                    }}
                    onConfirm={() => confirm({ closeDropdown: true })}
                    onClear={clearFilters || (() => {})}
                />
            )
        },
        {
            title: '部门', dataIndex: ['department', 'name'], editable: true, inputType: 'dropdown', options: departments,width: 100,
            filters: departments.map(dept => ({ text: dept.name, value: dept.id })),
            key: getEmployeePublicOutColumn('department_id'),
            filterMultiple: false,
            sorter: true,
        },
        {
            title: '工作地点',dataIndex: ['workLocation', 'name'],editable: true,inputType: 'dropdown',options: workLocations,width: 100,
            filters: workLocations.map(location => ({ text: location.name, value: location.id })),
            key: getEmployeePublicOutColumn('work_location_id'),
            filterMultiple: false,
            sorter: true,
        },
        {
            title: '职位',dataIndex: ['employeeTitle', 'name'],editable: true,inputType: 'dropdown',options: employeeTitles,width: 100,
            filters: employeeTitles.map(title => ({ text: title.name, value: title.id })),
            key: getEmployeePublicOutColumn('employee_title_id'),
            filterMultiple: false,
            sorter: true,
        },
        {
            title: '职称', dataIndex: ['professionalTitle', 'name'],editable: true,inputType: 'dropdown',options: professionalTitles,width: 100,
            filters: professionalTitles.map(title => ({ text: title.name, value: title.id })),
            key: getEmployeePublicOutColumn('professional_title_id'),
            filterMultiple: false,
            sorter: true,
        },
        {
            title: '员工状态',dataIndex: ['employmentStatus', 'name'],editable: true,inputType: 'dropdown',options: employeeStatus, width: 100,
            filters: employeeStatus.map(status => ({ text: status.name, value: status.id })),
            key: getEmployeePublicOutColumn('employ_status_id'),
            filterMultiple: false,
            sorter: true,
        },
        user?.is_superuser ? 
        {
            title: '操作',key: 'action', fixed: 'right', width: 100,
            render: (_:any, record:EmployeeFullDetails) => 
            {
            const editable = isEditing(record);
            return editable ? (
            <span>
                <Typography.Link onClick={() => handleEditSave(record)}>
                    保存
                </Typography.Link>
                <Typography.Link onClick={() => handleEditCancel()}>
                    取消
                </Typography.Link>
            </span>
            ) : (
            <span>
                <Space>
                    <Typography.Link disabled={false} onClick={() => handleEdit(record)}>
                        修改
                    </Typography.Link>
                    {/* <Popconfirm title="确定要删除这行吗?" onConfirm={() => handleDelete(record.id)} okText='是' cancelText='否'>
                        
                        <a>删除</a>
                    </Popconfirm> */}
                    <Typography.Link disabled={false} onClick={() => {
                        setSelectedEmployeeId(record.id);
                        setIsEmployeeReportModalVisible(true);
                    }}>
                        报告
                    </Typography.Link>
                </Space>
                
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
        inputNode = <MySelectComponent options={employeeStatus}/>

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
    const fetchStaticData = async () => {
        try {
            const [
                responseDepartments,
                responseWorkLocations,
                responseEmployeeTitles,
                responseProfessionalTitles,
                responseEmployeeStatuses
            ] = await Promise.all([
                DepartmentsService.readDepartments(),
                WorkLocationsService.readWorkLocations(),
                EmployeeTitlesService.readEmployeeTitles(),
                ProfessionalTitlesService.readProfessionalTitles(),
                EmployeeStatusesService.readEmployeeStatuses()
            ]);

            if (responseDepartments.data) setDepartments(responseDepartments.data.data);
            if (responseWorkLocations.data) setWorkLocations(responseWorkLocations.data.data);
            if (responseEmployeeTitles.data) setEmployeeTitles(responseEmployeeTitles.data.data);
            if (responseProfessionalTitles.data) setProfessionalTitles(responseProfessionalTitles.data.data);
            if (responseEmployeeStatuses.data) setEmloyeeStatus(responseEmployeeStatuses.data.data);

            setIsStaticDataLoaded(true);
        } catch (error) {
            console.error("Error fetching static data:", error);
            message.error("加载静态数据失败，请刷新页面重试");
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

    const downloadEmployeeList = () => {
        try{
            messageApi.open({
                key: "downloadEmployeeList",
                type: 'loading',
                content: '正在生成人员列表...',
                duration: 0,
            });
            ReportsService.getEmployeeListReport({ query: {} }).then((res) => {
            if (res.data) {
                messageApi.open({
                    key: "downloadEmployeeList",
                    type: 'success',
                    content: '人员列表生成成功，正在下载...',
                    duration: 2,
                });
                downloadReport(res.data, res.response);
            } else {
              messageApi.open({
                key: "downloadEmployeeList",
                type: 'error',
                content: '人员列表生成失败：' + res.error?.detail,
                duration: 10,
              });
            }
        });
        } catch (e) {
            messageApi.open({
                key: "downloadEmployeeList",
                type: 'error',
                content: '人员列表生成失败，未知错误：' + e,
                duration: 10,
              });
        }
    }

    const handleTableChange: TableProps<EmployeeFullDetails>["onChange"] = (
        pagination,
        filters,
        sorter
    ) => {
        const newFilters: Partial<EmployeeQueryParams> = {...filters};

        for (const [key, value] of Object.entries(filters)) {
            // handle date range filters
            if (["birth_date"].includes(key)) {
                if (Array.isArray(value) && value.length === 2) {
                    const [from, to] = value as [string, string];
                    newFilters["birth_date_from"] = from;
                    newFilters["birth_date_to"] = to;
                }
                delete newFilters[key as keyof EmployeeQueryParams];
            }
        }
        setFilters(newFilters);

        const queryParams = new URLSearchParams();
        if (pagination.current) {
            queryParams.set("current_page", pagination.current.toString());
        }
        if (pagination.pageSize) {
            queryParams.set("page_size", pagination.pageSize.toString());
        }
        // Add any other filters or sorting parameters here if needed
        if (sorter && !Array.isArray(sorter) && sorter.order) {
            queryParams.set("sort_by", sorter.field as string);
            queryParams.set("sort_direction", sorter.order === "ascend" ? "asc" : "desc");
        }
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.set(key, value.toString());
            }
        });

        navigate(`/employees?${queryParams.toString()}`, { replace: true });
    };

    const clearFilters = () => {
        setFilters({});
        setCurrentPage(1);
        navigate("/employees", { replace: true });
        fetchEmployees(1, pageSize, {});
        setTableRefreshKey(tableRefreshKey + 1);
      };

    return (
        <div>
            {contextHolder}
            <Space direction="vertical" style={{width: '100%'}}>

                {user?.is_superuser &&
                <Space>
                    <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>
                        添加
                    </Button>
                    <Divider type="vertical" />
                    <Button onClick={downloadEmployeeList} icon={<FilePdfOutlined />}>
                        导出人员列表
                    </Button>
                    <Divider type="vertical" />
                    {filters && Object.keys(filters).length > 0 && (
                        <Button onClick={clearFilters}>
                            清空过滤器
                        </Button>
                    )}
                </Space>
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
                        size='small'
                        key={tableRefreshKey}
                        loading={loading}
                        columns={mergedColumns}
                        dataSource={employees}
                        onChange={handleTableChange}
                        showSorterTooltip={{ target: 'sorter-icon' }}
                        pagination={{
                            position: ["topRight"],
                            current: currentPage,
                            pageSize: pageSize,
                            pageSizeOptions: ["10", "20", "50", "100"],
                            total: totalEmployees,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `共 ${total} 个员工 ${
                                filters && Object.keys(filters).length > 0 ? ", 已过滤" : ""
                            }`,
                        }}
                        scroll={{ x:500 }}
                    />
                </Form>
            
            </Space>
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
            <EmployeeReportModal
                visible={isEmployeeReportModalVisible}
                onCancel={() => setIsEmployeeReportModalVisible(false)}
                employeeId={selectedEmployeeId!}
                employeeName={employees.find(employee => employee.id === selectedEmployeeId)?.name ?? ''}
            />
        </div>
  )
}
