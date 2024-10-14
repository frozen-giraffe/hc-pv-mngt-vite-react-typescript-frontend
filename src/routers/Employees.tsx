import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { PlusOutlined, FilePdfOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import {
  DepartmentPublicOut,
  DepartmentsService,
  EmployeeCreateIn,
  EmployeePublicOut,
  EmployeeService,
  EmployeeStatusesService,
  EmployeeTitlePublicOut,
  EmployeeTitlesService,
  EmployeeUpdateIn,
  EmployStatusPublicOut,
  ProfessionalTitlePublicOut,
  ProfessionalTitlesService,
  ReportsService,
  WorkLocationPublicOut,
  WorkLocationsService,
} from "../client";
import { useAuth } from "../context/AuthContext";
import { ColumnsType } from "antd/es/table/interface";
import { downloadReport } from "../utils/ReportFileDownload";
import EmployeeReportModal from "../components/EmployeeReportModal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { EMPLOYEE_PAGE_DEFAULT_PAGE_SIZE } from "../client/const";
import { GetColumnNames } from "../helper";
import FilterDropdown from "../components/FilterDropdown";
import dayjs from "dayjs";
import { InfoCircleOutlined, FilterFilled, SortAscendingOutlined } from "@ant-design/icons";

type EmployeeQueryParams = NonNullable<
  Parameters<typeof EmployeeService.readEmployees>[0]
>["query"];

type EmployeeFullDetails = Omit<
  EmployeePublicOut,
  | "department_id"
  | "work_location_id"
  | "employee_title_id"
  | "professional_title_id"
  | "employ_status_id"
> & {
  key: string;
  department: Pick<DepartmentPublicOut, "name">;
  workLocation: Pick<WorkLocationPublicOut, "name">;
  employeeTitle: Pick<EmployeeTitlePublicOut, "name">;
  professionalTitle: Pick<ProfessionalTitlePublicOut, "name">;
  employmentStatus: Pick<EmployStatusPublicOut, "name">;
};

export const Employees: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState<EmployeeFullDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [departments, setDepartments] = useState<DepartmentPublicOut[]>([]);
  const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>(
    []
  );
  const [employeeTitles, setEmployeeTitles] = useState<
    EmployeeTitlePublicOut[]
  >([]);
  const [professionalTitles, setProfessionalTitles] = useState<
    ProfessionalTitlePublicOut[]
  >([]);
  const [employeeStatus, setEmloyeeStatus] = useState<EmployStatusPublicOut[]>(
    []
  );
  const [isEmployeeReportModalVisible, setIsEmployeeReportModalVisible] =
    useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(EMPLOYEE_PAGE_DEFAULT_PAGE_SIZE);

  const [filters, setFilters] = useState<Partial<EmployeeQueryParams>>({});
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isStaticDataLoaded, setIsStaticDataLoaded] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeFullDetails | null>(null);

  const getEmployeePublicOutColumn = GetColumnNames<EmployeePublicOut>();

  useEffect(() => {
    fetchStaticData();
  }, []);

  const fetchEmployees = useCallback(
    async (
      page: number,
      size: number,
      filters: Partial<EmployeeQueryParams>
    ) => {
      if (!isStaticDataLoaded) {
        console.log("Static data not loaded yet, skipping employee fetch");
        return;
      }

      try {
        setLoading(true);
        const responseEmployees = await EmployeeService.readEmployees({
          query: {
            skip: (page - 1) * size,
            limit: size,
            show_disabled: true,
            ...filters,
          },
        });

        if (responseEmployees.error) {
          message.error("获取员工失败: " + responseEmployees.error.detail);
          return;
        }

        if (responseEmployees.data) {
          const employeeFullDetails: EmployeeFullDetails[] =
            responseEmployees.data.data.map((employee) => ({
              ...employee,
              key: employee.id.toString(),
              department: departments.find(
                (dept) => dept.id === employee.department_id
              ) || { name: "Unknown" },
              workLocation: workLocations.find(
                (location) => location.id === employee.work_location_id
              ) || { name: "Unknown" },
              employeeTitle: employeeTitles.find(
                (title) => title.id === employee.employee_title_id
              ) || { name: "Unknown" },
              professionalTitle: professionalTitles.find(
                (profTitle) => profTitle.id === employee.professional_title_id
              ) || { name: "Unknown" },
              employmentStatus: employeeStatus.find(
                (status) => status.id === employee.employ_status_id
              ) || { name: "Unknown" },
            }));

          setEmployees(employeeFullDetails);
          setTotalEmployees(responseEmployees.data.count);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        message.error("获取员工数据失败，请重试");
      } finally {
        setLoading(false);
      }
    },
    [
      isStaticDataLoaded,
      departments,
      workLocations,
      employeeTitles,
      professionalTitles,
      employeeStatus,
    ]
  );

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
        if (
          key in
          {
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
          }
        ) {
          newFilters[key as keyof EmployeeQueryParams] = value;
        }
      }
      setFilters(newFilters);

      fetchEmployees(currentPage, pageSize, newFilters);
    }
  }, [searchParams, currentPage, pageSize, isStaticDataLoaded, fetchEmployees]);

  const getFilteredValue = (key: string): string[] | undefined => {
    const value = filters?.[key as keyof EmployeeQueryParams];
    return value ? [value] : undefined;
  };

  const getSortOrder = (key: string): "ascend" | "descend" | null => {
    const sort_by = filters?.sort_by;
    const sort_direction = filters?.sort_direction;
    if (sort_by === key) {
      return sort_direction === "asc" ? "ascend" : "descend";
    }
    return null;
  };

  const getDateRangeFilteredValue = (key: string): string[] | undefined => {
    const fromValue = filters?.[`${key}_from` as keyof EmployeeQueryParams];
    const toValue = filters?.[`${key}_to` as keyof EmployeeQueryParams];
    return fromValue || toValue
      ? ([fromValue, toValue].filter(Boolean) as string[])
      : undefined;
  };

  const showModal = (employee?: EmployeeFullDetails) => {
    if (employee) {
      setEditingEmployee(employee);
      form.setFieldsValue({
        ...employee,
        department: employee.department.name,
        workLocation: employee.workLocation.name,
        employeeTitle: employee.employeeTitle.name,
        professionalTitle: employee.professionalTitle.name,
        employmentStatus: employee.employmentStatus.name,
        birth_date: employee.birth_date ? new dayjs(employee.birth_date) : null,
      });
    } else {
      setEditingEmployee(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const handleAddOrUpdateEmployee = async (values: any) => {
    try {
      form.validateFields([
        "name",
        "department",
        "workLocation",
        "employeeTitle",
        "professionalTitle",
        "employmentStatus",
      ]);
      const employeeData: Partial<EmployeeCreateIn | EmployeeUpdateIn> = {
        name: values.name,
        gov_id: values.gov_id,
        gender: values.gender,
        department_id: values.department_id,
        work_location_id: values.work_location_id,
        employee_title_id: values.employee_title_id,
        professional_title_id: values.professional_title_id,
        employ_status_id: values.employ_status_id,
        birth_date: values.birth_date
          ? values.birth_date.format("YYYY-MM-DD")
          : undefined,
        initial: values.initial,
        pinyin: values.pinyin,
      };

      if (editingEmployee) {
        const changedData: Partial<EmployeeUpdateIn> = {};
        Object.keys(employeeData).forEach((key) => {
          const typedKey = key as keyof EmployeeUpdateIn;
          if (employeeData[typedKey] !== editingEmployee[typedKey]) {
            changedData[typedKey] = employeeData[typedKey] as any;
          }
        });
        // 如果姓名发生变化，且初始和拼音为空，删除以由后端生成
        if (changedData.name) {
          if (changedData.initial === "") {
            delete changedData.initial;
          }
          if (changedData.pinyin === "") {
            delete changedData.pinyin;
          }
        }

        const response = await EmployeeService.updateEmployee({
          path: {
            id: editingEmployee.id,
          },
          body: changedData,
        });
        if (response.data) {
          message.success("更新成功");
          handleModalCancel();
        } else {
          message.error("更新失败: " + response.error?.detail);
        }
      } else {
        const response = await EmployeeService.createEmployee({
          body: employeeData as EmployeeCreateIn,
        });
        if (response.data) {
          message.success("创建成功");
          handleModalCancel();
        } else {
          message.error("创建失败: " + response.error?.detail);
        }
      }

      fetchEmployees(currentPage, pageSize, filters);
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      message.error("操作失败，请重试");
    }
  };

  const columns: ColumnsType<EmployeeFullDetails> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 50,
      key: getEmployeePublicOutColumn("id"),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("id")),
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 100,
      key: getEmployeePublicOutColumn("name"),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("name")),
      filteredValue: getFilteredValue("name"),
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
      ),
    },
    {
      title: "性别",
      dataIndex: "gender",
      width: 50,
      key: getEmployeePublicOutColumn("gender"),
      onCell: () => ({ style: { minWidth: 500 } }),
    },
    {
      title: "身份证号",
      dataIndex: "gov_id",
      width: 100,
      key: getEmployeePublicOutColumn("gov_id"),
      filteredValue: getFilteredValue("gov_id"),
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
      ),
    },
    {
      title: "生日",
      dataIndex: "birth_date",
      width: 100,
      render: (text: string | null) =>
        text !== null && convertDateToYYYYMMDD(text),
      key: getEmployeePublicOutColumn("birth_date"),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("birth_date")),
      filteredValue: getDateRangeFilteredValue("birth_date"),
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
      ),
    },
    {
      title: "部门",
      dataIndex: ["department", "name"],
      width: 100,
      filters: departments.map((dept) => ({ text: dept.name, value: dept.id })),
      key: getEmployeePublicOutColumn("department_id"),
      filterMultiple: false,
      filteredValue: getFilteredValue(getEmployeePublicOutColumn("department_id")),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("department_id")),
    },
    {
      title: "工作地点",
      dataIndex: ["workLocation", "name"],
      width: 100,
      filters: workLocations.map((location) => ({
        text: location.name,
        value: location.id,
      })),
      key: getEmployeePublicOutColumn("work_location_id"),
      filteredValue: getFilteredValue(getEmployeePublicOutColumn("work_location_id")),
      filterMultiple: false,
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("work_location_id")),
    },
    {
      title: "职位",
      dataIndex: ["employeeTitle", "name"],
      width: 100,
      filters: employeeTitles.map((title) => ({
        text: title.name,
        value: title.id,
      })),
      key: getEmployeePublicOutColumn("employee_title_id"),
      filterMultiple: false,
      filteredValue: getFilteredValue(getEmployeePublicOutColumn("employee_title_id")),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("employee_title_id")),
    },
    {
      title: "职称",
      dataIndex: ["professionalTitle", "name"],
      width: 100,
      filters: professionalTitles.map((title) => ({
        text: title.name,
        value: title.id,
      })),
      key: getEmployeePublicOutColumn("professional_title_id"),
      filteredValue: getFilteredValue(getEmployeePublicOutColumn("professional_title_id")),
      filterMultiple: false,
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("professional_title_id")),
    },
    {
      title: "员工状态",
      dataIndex: ["employmentStatus", "name"],
      width: 100,
      filters: employeeStatus.map((status) => ({
        text: status.name,
        value: status.id,
      })),
      key: getEmployeePublicOutColumn("employ_status_id"),
      filterMultiple: false,
      filteredValue: getFilteredValue(getEmployeePublicOutColumn("employ_status_id")),
      sorter: true,
      sortOrder: getSortOrder(getEmployeePublicOutColumn("employ_status_id")),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: EmployeeFullDetails) => (
        <Space>
          <Typography.Link onClick={() => showModal(record)}>
            编辑
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setSelectedEmployeeId(record.id);
              setIsEmployeeReportModalVisible(true);
            }}
          >
            报告
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const fetchStaticData = async () => {
    try {
      const [
        responseDepartments,
        responseWorkLocations,
        responseEmployeeTitles,
        responseProfessionalTitles,
        responseEmployeeStatuses,
      ] = await Promise.all([
        DepartmentsService.readDepartments(),
        WorkLocationsService.readWorkLocations(),
        EmployeeTitlesService.readEmployeeTitles(),
        ProfessionalTitlesService.readProfessionalTitles(),
        EmployeeStatusesService.readEmployeeStatuses(),
      ]);

      if (responseDepartments.data)
        setDepartments(responseDepartments.data.data);
      if (responseWorkLocations.data)
        setWorkLocations(responseWorkLocations.data.data);
      if (responseEmployeeTitles.data)
        setEmployeeTitles(responseEmployeeTitles.data.data);
      if (responseProfessionalTitles.data)
        setProfessionalTitles(responseProfessionalTitles.data.data);
      if (responseEmployeeStatuses.data)
        setEmloyeeStatus(responseEmployeeStatuses.data.data);

      setIsStaticDataLoaded(true);
    } catch (error) {
      console.error("Error fetching static data:", error);
      message.error("加载静态数据失败，请刷新页面重试");
    }
  };

  const convertDateToYYYYMMDD = (dateStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const downloadEmployeeList = () => {
    try {
      messageApi.open({
        key: "downloadEmployeeList",
        type: "loading",
        content: "正在生成人员列表...",
        duration: 0,
      });
      ReportsService.getEmployeeListReport({ query: {} }).then((res) => {
        if (res.data) {
          messageApi.open({
            key: "downloadEmployeeList",
            type: "success",
            content: "人员列表生成成功，正在下载...",
            duration: 2,
          });
          downloadReport(res.data, res.response);
        } else {
          messageApi.open({
            key: "downloadEmployeeList",
            type: "error",
            content: "人员列表生成失败：" + res.error?.detail,
            duration: 10,
          });
        }
      });
    } catch (e) {
      messageApi.open({
        key: "downloadEmployeeList",
        type: "error",
        content: "人员列表生成失败，未知错误：" + e,
        duration: 10,
      });
    }
  };

  const handleTableChange: TableProps<EmployeeFullDetails>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const newFilters: Partial<EmployeeQueryParams> = { ...filters };

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
    if (sorter && !Array.isArray(sorter) && sorter.order) {
        newFilters["sort_by"] = sorter.field as string;
        newFilters["sort_direction"] = sorter.order === "ascend" ? "asc" : "desc";
    }
    setFilters(newFilters);

    const queryParams = new URLSearchParams();
    if (pagination.current) {
      queryParams.set("current_page", pagination.current.toString());
    }
    if (pagination.pageSize) {
      queryParams.set("page_size", pagination.pageSize.toString());
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

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (editingEmployee && newName !== editingEmployee.name) {
      form.setFieldsValue({
        initial: "",
        pinyin: "",
      });
    } else {
      form.setFieldsValue({
        initial: editingEmployee?.initial,
        pinyin: editingEmployee?.pinyin,
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        {user?.is_superuser && (
          <Space>
            <Button
              onClick={() => showModal()}
              type="primary"
              icon={<PlusOutlined />}
            >
              添加
            </Button>
            <Divider type="vertical" />
            <Button onClick={downloadEmployeeList} icon={<FilePdfOutlined />}>
              导出人员列表
            </Button>
          </Space>
        )}
        <Table
          rowKey="id"
          size="small"
          key={tableRefreshKey}
          loading={loading}
          columns={columns}
          dataSource={employees}
          onChange={handleTableChange}
          pagination={{
            position: ["topRight"],
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: ["10", "20", "50", "100"],
            total: totalEmployees,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) =>(
                <>
                    共 {total} 个员工
                    {filters && Object.keys(filters).length > 0 ? 
                    <>
                        <Divider type="vertical" /> 
                        <Space>
                            <Typography.Text style={{color: "grey"}} >已 <FilterFilled />过滤 / <SortAscendingOutlined />排序</Typography.Text>
                            <Button onClick={clearFilters} type="dashed" size="small">取消过滤/排序</Button>
                        </Space>
                        </> : null}
                </>
            )
          }}
          scroll={{ x: 500 }}
        />
      </Space>
      <Modal
        title={
          editingEmployee ? "编辑员工：" + editingEmployee.name : "添加新员工"
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={() => form.submit()}
        okText={editingEmployee ? "更新" : "添加"}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdateEmployee}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名!" }]}
          >
            <Input onChange={handleFormNameChange} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="gov_id" label="身份证号">
            <Input />
          </Form.Item>
          <Form.Item name="birth_date" label="生日">
            <DatePicker
              picker="date"
              style={{ width: "100%" }}
              defaultPickerValue={dayjs("1990-01-01")}
            />
          </Form.Item>
          <Form.Item
            name="department_id"
            label="部门"
            rules={[{ required: true, message: "请选择部门!" }]}
          >
            <Select>
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="work_location_id"
            label="工作地点"
            rules={[{ required: true, message: "请选择工作地点!" }]}
          >
            <Select>
              {workLocations.map((location) => (
                <Select.Option key={location.id} value={location.id}>
                  {location.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="employee_title_id"
            label="职位"
            rules={[{ required: true, message: "请选择职位!" }]}
          >
            <Select>
              {employeeTitles.map((title) => (
                <Select.Option key={title.id} value={title.id}>
                  {title.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="professional_title_id"
            label="职称"
            rules={[{ required: true, message: "请选择职称!" }]}
          >
            <Select>
              {professionalTitles.map((title) => (
                <Select.Option key={title.id} value={title.id}>
                  {title.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="employ_status_id"
            label="员工状态"
            rules={[{ required: true, message: "请选择员工状态!" }]}
          >
            <Select>
              {employeeStatus.map((status) => (
                <Select.Option key={status.id} value={status.id}>
                  {status.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Collapse
            size="small"
            items={[
              {
                key: "1",
                label: <span >高级设置</span>,
                children: (
                  <>
                    <Divider plain orientation="left" style={{ color: "grey", margin: "5px 0px" }}>
                      索引设置
                      <Tooltip title="下方数据用于系统内员工拼音/首字母搜索，可以自定义以获得更好的搜索体验">
                        <InfoCircleOutlined
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            color: "grey",
                          }}
                        />
                      </Tooltip>
                    </Divider>
                    <Form.Item name="initial" label="姓名首字母">
                      <Input placeholder="留空系统自动生成" />
                    </Form.Item>
                    <Form.Item name="pinyin" label="姓名拼音">
                      <Input placeholder="留空系统自动生成" />
                    </Form.Item>
                  </>
                ),
              },
            ]}
            bordered={false}
          />
        </Form>
      </Modal>
      <EmployeeReportModal
        visible={isEmployeeReportModalVisible}
        onCancel={() => setIsEmployeeReportModalVisible(false)}
        employeeId={selectedEmployeeId!}
        employeeName={
          employees.find((employee) => employee.id === selectedEmployeeId)
            ?.name ?? ""
        }
      />
    </div>
  );
};
