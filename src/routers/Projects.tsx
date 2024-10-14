import {
  Button,
  Divider,
  message,
  Popover,
  Space,
  Table,
  TableProps,
  Typography,
  Input,
  DatePicker,
  Modal,
  Checkbox,
  Select,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, FilePdfOutlined, MinusOutlined } from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ProjectTaskTypePublicOut,
  ProjectPublicOut,
  ProjectsService,
  BuildingStructureTypePublicOut,
  BuildingStructureTypesService,
  QualityRatioClassPublicOut,
  QualityRatioClassesService,
  ProjectTypePublicOut,
  ProjectTaskTypesService,
  ProjectTypesService,
  ReportsService,
  ProjectPayoutPublicOut,
} from "../client";
import { GetColumnNames } from "../helper";
import { useAuth } from "../context/AuthContext";
import { downloadReport } from "../utils/ReportFileDownload";
import ProjectListDownloadModal from "../components/ProjectListDownloadModal";
import ProjectReportModal from "../components/ProjectReportModal";
import CompanyReportModal from "../components/CompanyReportModal";
import ContractPaymentModal from "../components/ContractPaymentModal";
import { ColumnsType } from "antd/es/table";
import FloatNumberCellRender from '../components/FloatNumberCellRender';
import { PROJECT_TABLE_SHOWN_COLUMNS_KEY, PROJECT_PAGE_DEFAULT_PAGE_SIZE } from "../client/const";
import FilterDropdown from "../components/FilterDropdown";

// Add this type alias using the correct type from ProjectsService
type ProjectQueryParams = NonNullable<
  Parameters<typeof ProjectsService.getAndFilterProjects>[0]
>["query"];

export const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ProjectPublicOut[]>([]);
  const [buildingStructureType, setBuildingStructureType] = useState<
    BuildingStructureTypePublicOut[]
  >([]);
  const [qualityRatioClass, setQualityRatioClass] = useState<
    QualityRatioClassPublicOut[]
  >([]);
  const [projectType, setProjectType] = useState<ProjectTypePublicOut[]>([]);
  const [projectTaskType, setProjectTaskType] = useState<
    ProjectTaskTypePublicOut[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [
    isProjectListDownloadModalVisible,
    setIsProjectListDownloadModalVisible,
  ] = useState(false);
  const [isProjectReportModalVisible, setIsProjectReportModalVisible] =
    useState(false);
  const [isCompanyReportModalVisible, setIsCompanyReportModalVisible] =
    useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedProjectPayoutId, setSelectedProjectPayoutId] = useState<
    number | null
  >(null);
  const [isContractPaymentModalVisible, setIsContractPaymentModalVisible] =
    useState(false);

  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PROJECT_PAGE_DEFAULT_PAGE_SIZE);

  const [filters, setFilters] = useState<Partial<ProjectQueryParams>>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const [isStaticDataLoaded, setIsStaticDataLoaded] = useState(false);

  useEffect(() => {
    fetchStaticData();
  }, []);

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

      // Parse filters from URL
      const newFilters: Partial<ProjectQueryParams> = {};
      searchParams.forEach((value, key) => {
        // Check if the key is a valid filter
        if (
          key in
          {
            building_structure_type_id: true,
            building_type_id: true,
            calculated_employee_payout_max: true,
            calculated_employee_payout_min: true,
            date_added_from: true,
            date_added_to: true,
            date_modified_from: true,
            date_modified_to: true,
            id: true,
            name: true,
            project_area_max: true,
            project_area_min: true,
            project_class_id: true,
            project_code: true,
            project_year: true,
            project_construction_cost_max: true,
            project_construction_cost_min: true,
            project_contract_value_max: true,
            project_contract_value_min: true,
            project_rate_adjustment_class_id: true,
            project_task_type_id: true,
            project_type_id: true,
            quality_ratio_class_id: true,
            sort_by: true,
            sort_direction: true,
          }
        ) {
          newFilters[key as keyof ProjectQueryParams] = value;
        }
      });
      setFilters(newFilters);

      fetchProjects(currentPage, pageSize, newFilters);
    }
  }, [searchParams, currentPage, pageSize, isStaticDataLoaded]);

  useEffect(() => {
    const savedColumns = localStorage.getItem(PROJECT_TABLE_SHOWN_COLUMNS_KEY);
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    } else {
      // If no saved preferences, show all columns by default
      setSelectedColumns(columns.map((col) => col.key as string));
    }
  }, []);

  const fetchStaticData = async () => {
    try {
      const [
        resBuildingStructureType,
        resQualityRatioClass,
        resProjectType,
        resProjectTaskType,
      ] = await Promise.all([
        BuildingStructureTypesService.readBuildingStructureTypes(),
        QualityRatioClassesService.readQualityRatioClasses(),
        ProjectTypesService.readProjectTypes(),
        ProjectTaskTypesService.readProjectTaskTypes(),
      ]);

      if (resBuildingStructureType.data) {
        setBuildingStructureType(resBuildingStructureType.data.data);
      } else {
        message.error("获取结构形式失败: " + resBuildingStructureType.error.detail);
      }
      if (resQualityRatioClass.data) {
        setQualityRatioClass(resQualityRatioClass.data.data);
      } else {
        message.error("获取设计质量系数失败: " + resQualityRatioClass.error.detail);
      }
      if (resProjectType.data) {
        setProjectType(resProjectType.data.data);
      } else {
        message.error("获取工程类型失败: " + resProjectType.error.detail);
      }
      if (resProjectTaskType.data) {
        setProjectTaskType(resProjectTaskType.data.data);
      } else {
        message.error("获取工程项目类型失败: " + resProjectTaskType.error.detail);
      }

      setIsStaticDataLoaded(true);
    } catch (e) {
      console.error("Error fetching static data:", e);
      message.error("加载静态数据失败，请刷新页面重试");
    }
  };

  const fetchProjects = async (
    page: number,
    size: number,
    currentFilters: Partial<ProjectQueryParams>
  ) => {
    if (!isStaticDataLoaded) {
      console.log("Static data not loaded yet, skipping project fetch");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await ProjectsService.getAndFilterProjects({
        query: {
          skip: (page - 1) * size,
          limit: size,
          ...currentFilters,
        },
      });
      if (error) {
        message.error("获取项目失败: " + error.detail);
      } else if (data) {
        setProjects(data.data);
        setTotalProjects(data.count);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange: TableProps<ProjectPublicOut>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const newFilters: Partial<ProjectQueryParams> = { ...filters };
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length === 2) {
        if (key === "date_added" || key === "date_modified") {
          // Handle date range filters
          const [from, to] = value;
          if (from) {
            newFilters[`${key}_from` as keyof ProjectQueryParams] =
              from as string;
          }
          if (to) {
            newFilters[`${key}_to` as keyof ProjectQueryParams] = to as string;
          }
        } else {
          // Handle numeric range filters
          const [min, max] = value;
          if (min) {
            newFilters[`${key}_min` as keyof ProjectQueryParams] =
              min as string;
          }
          if (max) {
            newFilters[`${key}_max` as keyof ProjectQueryParams] =
              max as string;
          }
        }
        delete newFilters[key as keyof ProjectQueryParams];
      } else if (value) {
        newFilters[key as keyof ProjectQueryParams] = value[0] as string;
      } else {
        delete newFilters[key as keyof ProjectQueryParams];
      }
    });

    // Handle sorting
    if (sorter && !Array.isArray(sorter) && sorter.order) {
      newFilters.sort_by = sorter.field as string;
      newFilters.sort_direction = sorter.order === "ascend" ? "asc" : "desc";
    } else {
      delete newFilters.sort_by;
      delete newFilters.sort_direction;
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

    navigate(`/projects?${queryParams.toString()}`, { replace: true });
  };

  const handleOpenDetail = (data: any) => {
    console.log(data);
  };
  const getValueFromListByID = <T,>(
    id: number,
    list: T[],
    item1InList: keyof T,

    item2InList: keyof T
  ) => {
    const item = list.find((item) => item[item1InList] === id);
    return item ? String(item[item2InList]) : "Unknown";
  };

  const getNameById = <T,>(
    id: T[keyof T],
    list: T[],
    idCol: keyof T,
    nameCol: keyof T
  ): string => {
    const item = list.find((item) => item[idCol] === id);
    return item ? String(item[nameCol]) : "Unknown";
  };

  const showProjectDetail = () => {
    navigate("/projects-detail");
  };
  const convertDateToYYYYMMDDHM = (dateStr: string) => {
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // Get hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const showProjectListDownloadModal = () => {
    setIsProjectListDownloadModalVisible(true);
  };
  const showCompanyReportModal = () => {
    setIsCompanyReportModalVisible(true);
  };

  const downloadProjectList = (project_year: number | null) => {
    try {
      messageApi.open({
        key: "downloadProjectList",
        type: "loading",
        content: "正在导出项目列表...",
        duration: 5,
        onClose: () => {
          messageApi.open({
            key: "downloadProjectList",
            type: "loading",
            content:
              "正在导出项目列表...数据较多，请耐心等待，且不要离开此页面",
            duration: 0,
          });
        },
      });
      ReportsService.getProjectListReport({
        query: { project_year: project_year },
      }).then((res) => {
        if (res.data) {
          messageApi.open({
            key: "downloadProjectList",
            type: "success",
            content: "项目列表导出成功，正在下载...",
            duration: 2,
          });
          downloadReport(res.data, res.response);
        } else {
          messageApi.open({
            key: "downloadProjectList",
            type: "error",
            content: "获取项目列表失败：" + res.error?.detail,
            duration: 10,
          });
        }
      });
    } catch (e) {
      messageApi.open({
        key: "downloadProjectList",
        type: "error",
        content: "获取项目列表失败，未知错误：" + e,
        duration: 10,
      });
    }
  };

  const showContractPaymentModal = (projectPayoutId: number) => {
    setSelectedProjectPayoutId(projectPayoutId);
    setIsContractPaymentModalVisible(true);
  };

  const getProjectPublicOutColumn = GetColumnNames<ProjectPublicOut>();
  const getProjectPayoutPublicOutColumn =
    GetColumnNames<ProjectPayoutPublicOut>();
  //or use
  //const getProjectPublicOutColumn = <T,> (name: keyof T)=> name //usage getProjectPublicOutColumn<ProjectPublicOut>('building_structure_type_id')

  // Add this function to get the filtered value for a specific filter
  const getFilteredValue = (key: string): string[] | undefined => {
    const value = filters?.[key as keyof ProjectQueryParams];
    return value ? [value] : undefined;
  };

  // Add this function to get the filtered value for range filters
  const getRangeFilteredValue = (key: string): string[] | undefined => {
    const minValue = filters?.[`${key}_min` as keyof ProjectQueryParams];
    const maxValue = filters?.[`${key}_max` as keyof ProjectQueryParams];
    return minValue || maxValue
      ? ([minValue, maxValue].filter(Boolean) as string[])
      : undefined;
  };

  // Add this function to get the filtered value for date range filters
  const getDateRangeFilteredValue = (key: string): string[] | undefined => {
    const fromValue = filters?.[`${key}_from` as keyof ProjectQueryParams];
    const toValue = filters?.[`${key}_to` as keyof ProjectQueryParams];
    return fromValue || toValue
      ? ([fromValue, toValue].filter(Boolean) as string[])
      : undefined;
  };

  const columns: ColumnsType<ProjectPublicOut> = [
    {
      title: "ID",
      dataIndex: getProjectPublicOutColumn("id"),
      key: getProjectPublicOutColumn("id"),
      width: 60,
      sorter: true,
    },
    {
      title: "年度",
      dataIndex: getProjectPublicOutColumn("project_year"),
      key: getProjectPublicOutColumn("project_year"),
      width: 90,
      sorter: true,
      filteredValue: getFilteredValue("project_year"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="year"
          placeholder="选择年份"
          value={selectedKeys[0]}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "项目工号",
      dataIndex: getProjectPublicOutColumn("project_code"),
      key: getProjectPublicOutColumn("project_code"),
      width: 120,
      filteredValue: getFilteredValue("project_code"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="input"
          placeholder="模糊搜索项目工号"
          value={selectedKeys[0]}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "项目名称",
      dataIndex: getProjectPublicOutColumn("name"),
      key: getProjectPublicOutColumn("name"),
      width: 300,
      filteredValue: getFilteredValue("name"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="input"
          placeholder="模糊搜索项目名称"
          value={selectedKeys[0]}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "工程项目类别",
      dataIndex: getProjectPublicOutColumn("project_task_type_id"),
      key: getProjectPublicOutColumn("project_task_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, projectTaskType, "id", "name"),
      width: 120,
      filteredValue: getFilteredValue("project_task_type_id"),
      filters: projectTaskType.map((type) => ({
        text: type.name,
        value: type.id,
      })),
      filterMultiple: false,
      filterSearch: true,
    },
    {
      title: "设计质量系数",
      dataIndex: getProjectPublicOutColumn("quality_ratio_class_id"),
      key: getProjectPublicOutColumn("quality_ratio_class_id"),
      render: (id: number) =>
        getValueFromListByID(id, qualityRatioClass, "id", "name"),
      width: 100,
      filteredValue: getFilteredValue("quality_ratio_class_id"),
      filters: qualityRatioClass.map((type) => ({
        text: type.name,
        value: type.id,
      })),
      filterMultiple: false,
    },
    {
      title: "总造价(元)",
      dataIndex: getProjectPublicOutColumn("project_construction_cost"),
      key: getProjectPublicOutColumn("project_construction_cost"),
      width: 110,
      sorter: true,
      render: (value: number) => <FloatNumberCellRender value={value} />,
      filteredValue: getRangeFilteredValue("project_construction_cost"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="number_range"
          placeholder={["最小值", "最大值"]}
          value={selectedKeys}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "合同额(元)",
      dataIndex: getProjectPublicOutColumn("project_contract_value"),
      key: getProjectPublicOutColumn("project_contract_value"),
      width: 120,
      sorter: true,
      render: (value: number) => <FloatNumberCellRender value={value} />,
      filteredValue: getRangeFilteredValue("project_contract_value"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="number_range"
          placeholder={["最小值", "最大值"]}
          value={selectedKeys}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "下发产值(元)",
      dataIndex: getProjectPublicOutColumn("calculated_employee_payout"),
      key: getProjectPublicOutColumn("calculated_employee_payout"),
      width: 100,
      sorter: true,
      render: (value: number) => <FloatNumberCellRender value={value} />,
      filteredValue: getRangeFilteredValue("calculated_employee_payout"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="number_range"
          placeholder={["最小值", "最大值"]}
          value={selectedKeys}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "项目录入时间",
      dataIndex: getProjectPublicOutColumn("date_added"),
      key: getProjectPublicOutColumn("date_added"),
      width: 140,
      render: (date: string) => convertDateToYYYYMMDDHM(date),
      sorter: true,
      filteredValue: getDateRangeFilteredValue("date_added"),
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
      title: "项目修改时间",
      dataIndex: getProjectPublicOutColumn("date_modified"),
      key: getProjectPublicOutColumn("date_modified"),
      width: 140,
      render: (date: string) => convertDateToYYYYMMDDHM(date),
      sorter: true,
      filteredValue: getDateRangeFilteredValue("date_modified"),
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
    // {
    //   title: "产值计算时间",
    //   dataIndex:
    //     "project_payout." +
    //     getProjectPayoutPublicOutColumn("calculation_updated_at"),
    //   key: getProjectPayoutPublicOutColumn("calculation_updated_at"),
    //   width: 140, //这个不知道
    // },
    {
      title: "结构形式",
      dataIndex: getProjectPublicOutColumn("building_structure_type_id"),
      key: getProjectPublicOutColumn("building_structure_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, buildingStructureType, "id", "name"),
      width: 180,
      filteredValue: getFilteredValue("building_structure_type_id"),
      filters: buildingStructureType.map((type) => ({
        text: type.name,
        value: type.id,
      })),
      filterMultiple: false,
      filterSearch: true,
    },
    {
      title: "工程面积(平方米)",
      dataIndex: getProjectPublicOutColumn("project_area"),
      key: getProjectPublicOutColumn("project_area"),
      width: 120,
      sorter: true,
      render: (value: number) => <FloatNumberCellRender value={value}/>,
      filteredValue: getRangeFilteredValue("project_area"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          type="number_range"
          placeholder={["最小值", "最大值"]}
          value={selectedKeys}
          onChange={setSelectedKeys}
          onConfirm={() => confirm({ closeDropdown: true })}
          onClear={clearFilters || (() => {})}
        />
      ),
    },
    {
      title: "工程类型",
      dataIndex: getProjectPublicOutColumn("project_type_id"),
      key: getProjectPublicOutColumn("project_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, projectType, "id", "name"),
      width: 200,
      filteredValue: getFilteredValue("project_type_id"),
      filters: projectType.map((type) => ({ text: type.name, value: type.id })),
      filterMultiple: false,
      filterSearch: true,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (row: ProjectPublicOut) => {
        return user?.is_superuser ? (
          <Space>
            <Typography.Link
              onClick={() => handleOpenDetail(row)}
              style={{ marginInlineEnd: 8 }}
            >
              详情
            </Typography.Link>
            <Popover
              title={
                row.project_payout === null
                  ? "项目没有下发产值，无法生成报告"
                  : ""
              }
            >
              <Typography.Link
                onClick={() => {
                  setSelectedProjectId(row.id);
                  setIsProjectReportModalVisible(true);
                }}
                disabled={row.project_payout === null}
              >
                报告
              </Typography.Link>
            </Popover>
            <Popover
              title={
                row.project_payout === null
                  ? "项目没有下发产值，无法录入回款"
                  : ""
              }
            >
              <Typography.Link
                onClick={() => showContractPaymentModal(row.project_payout!.id)}
                disabled={row.project_payout === null}
              >
                回款
              </Typography.Link>
            </Popover>
          </Space>
        ) : (
          <></>
        );
      },
    },
  ];

  const visibleColumns = columns.filter((col) =>
    selectedColumns.includes(col.key as string)
  );

  const handleColumnChange = (selected: string[]) => {
    if (selected.length === 0) {
      selected.push("id");
      selected.push("action");
    }
    setSelectedColumns(selected);
    localStorage.setItem(
      PROJECT_TABLE_SHOWN_COLUMNS_KEY,
      JSON.stringify(selected)
    );
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    navigate("/projects", { replace: true });
    fetchProjects(1, pageSize, {});
    setTableRefreshKey(tableRefreshKey + 1);
  };

  return (
    <div ref={scrollContainerRef}>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        {user?.is_superuser && (
          <Space wrap>
            <Button onClick={showProjectDetail} type="primary">
              <PlusOutlined />
              添加
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={showProjectListDownloadModal}
              icon={<FilePdfOutlined />}
            >
              导出项目列表
            </Button>
            <Button onClick={showCompanyReportModal} icon={<FilePdfOutlined />}>
              公司年度报告
            </Button>
            <Divider type="vertical" />
            <p>显示列：</p>
            <Select
              mode="multiple"
              style={{ width: "300px" }}
              placeholder="选择显示的列"
              value={selectedColumns}
              onChange={handleColumnChange}
              options={columns.map((col) => ({
                label: col.title,
                value: col.key as string,
                disabled: col.key === "id" || col.key === "action",
              }))}
              allowClear={true}
              onClear={() => handleColumnChange([])}
              maxTagCount="responsive"
              dropdownRender={(menu) => {
                return (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px", width: "100%" }}>
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          handleColumnChange(
                            columns.map((col) => col.key as string)
                          )
                        }
                      >
                        全选
                      </Button>
                      <Button
                        type="text"
                        icon={<MinusOutlined />}
                        onClick={() => handleColumnChange([])}
                      >
                        全不选
                      </Button>
                    </Space>
                  </>
                );
              }}
            />
            {filters && Object.keys(filters).length > 0 && (
              <Button onClick={clearFilters}>清空过滤器</Button>
            )}
          </Space>
        )}
        <Table
          bordered
          key={tableRefreshKey}
          rowKey="id"
          loading={loading}
          columns={visibleColumns}
          dataSource={projects}
          onChange={handleTableChange}
          pagination={{
            position: ["topRight"],
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: ["10", "18", "25", "50", "100"],
            total: totalProjects,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) =>
              `共 ${total} 个工程 ${
                filters && Object.keys(filters).length > 0 ? ", 已过滤" : ""
              }`,
          }}
          scroll={{ x: "max-content" }}
          style={{ height: "100%" }}
          size="small"
        />
      </Space>
      <ProjectListDownloadModal
        visible={isProjectListDownloadModalVisible}
        onCancel={() => setIsProjectListDownloadModalVisible(false)}
        onDownload={(year) => {
          downloadProjectList(year);
          setIsProjectListDownloadModalVisible(false);
        }}
      />
      <ProjectReportModal
        visible={isProjectReportModalVisible}
        onCancel={() => setIsProjectReportModalVisible(false)}
        projectId={selectedProjectId!}
      />
      <CompanyReportModal
        visible={isCompanyReportModalVisible}
        onCancel={() => setIsCompanyReportModalVisible(false)}
      />
      <ContractPaymentModal
        visible={isContractPaymentModalVisible}
        onCancel={() => {
          setIsContractPaymentModalVisible(false);
          setSelectedProjectPayoutId(null);
        }}
        projectPayoutId={selectedProjectPayoutId!}
      />
    </div>
  );
};