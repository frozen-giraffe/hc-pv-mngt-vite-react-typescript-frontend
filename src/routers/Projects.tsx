import {
  Button,
  Divider,
  message,
  Popover,
  Space,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, FilePdfOutlined } from "@ant-design/icons";
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
} from "../client";
import { GetColumnNames } from "../helper";
import { useAuth } from "../context/AuthContext";
import { downloadReport } from "../utils/ReportFileDownload";
import ProjectListDownloadModal from "../components/ProjectListDownloadModal";
import ProjectReportModal from "../components/ProjectReportModal";
import CompanyReportModal from "../components/CompanyReportModal";
import ContractPaymentModal from "../components/ContractPaymentModal";

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
  const [pageSize, setPageSize] = useState(18);

  useEffect(() => {
    const search_current_page = searchParams.get("current_page");
    const search_page_size = searchParams.get("page_size");
    if (search_current_page) {
      setCurrentPage(parseInt(search_current_page));
    }
    if (search_page_size) {
      setPageSize(parseInt(search_page_size));
    }
    fetchProjects(currentPage, pageSize);
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    fetchStaticData();
  }, []);

  const fetchProjects = async (page: number, size: number) => {
    setLoading(true);
    try {
      const { data, error } = await ProjectsService.getAndFilterProjects({
        query: {
          skip: (page - 1) * size,
          limit: size,
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
      }
      if (resQualityRatioClass.data) {
        setQualityRatioClass(resQualityRatioClass.data.data);
      }
      if (resProjectType.data) {
        setProjectType(resProjectType.data.data);
      }
      if (resProjectTaskType.data) {
        setProjectTaskType(resProjectTaskType.data.data);
      }
    } catch (e) {
      console.error("Error fetching static data:", e);
    }
  };

  const handleTableChange: TableProps<ProjectPublicOut>["onChange"] = (
    pagination
  ) => {
    if (pagination.current && pagination.pageSize) {
      navigate(
        `/projects?current_page=${pagination.current}&page_size=${pagination.pageSize}`,
        { replace: true }
      );
    }
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
  //or use
  //const getProjectPublicOutColumn = <T,> (name: keyof T)=> name //usage getProjectPublicOutColumn<ProjectPublicOut>('building_structure_type_id')

  const columns = [
    {
      title: "ID",
      dataIndex: getProjectPublicOutColumn("id"),
      width: 50,
    },
    {
      title: "项目年度",
      dataIndex: getProjectPublicOutColumn("project_year"),
      width: 80,
    },
    {
      title: "项目工号",
      dataIndex: getProjectPublicOutColumn("project_code"),
      width: 100,
    },
    {
      title: "项目名称",
      dataIndex: getProjectPublicOutColumn("name"),
      width: 300,
    },
    {
      title: "民用建筑类别",
      dataIndex: getProjectPublicOutColumn("project_task_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, projectTaskType, "id", "name"),
      width: 120,
    },
    {
      title: "设计质量系数",
      dataIndex: getProjectPublicOutColumn("quality_ratio_class_id"),
      render: (id: number) =>
        getValueFromListByID(id, qualityRatioClass, "id", "name"),
      width: 100,
    },
    {
      title: "项目总造价",
      dataIndex: getProjectPublicOutColumn("project_construction_cost"),
      width: 105,
    },
    {
      title: "施工图合同款",
      dataIndex: getProjectPublicOutColumn("project_contract_value"),
      width: 120,
    },
    {
      title: "下发产值(元)",
      dataIndex: getProjectPublicOutColumn("calculated_employee_payout"),
      width: 100,
    },
    {
      title: "项目录入时间",
      dataIndex: getProjectPublicOutColumn("date_added"),
      width: 140,
      render: (date: string) => convertDateToYYYYMMDDHM(date),
    },
    {
      title: "项目修改时间",
      dataIndex: getProjectPublicOutColumn("date_modified"),
      width: 140,
      render: (date: string) => convertDateToYYYYMMDDHM(date),
    },
    {
      title: "产值计算时间",
      dataIndex: getProjectPublicOutColumn("project_construction_cost"),
      width: 120, //这个不知道
    },
    {
      title: "工程级别",
      dataIndex: getProjectPublicOutColumn("building_structure_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, buildingStructureType, "id", "name"),
      width: 180,
    },
    {
      title: "工程面积(平方米)",
      dataIndex: getProjectPublicOutColumn("project_area"),
      width: 130,
    },
    {
      title: "工程类别",
      dataIndex: getProjectPublicOutColumn("project_type_id"),
      render: (id: number) =>
        getValueFromListByID(id, projectType, "id", "name"),
      width: 200,
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
          </Space>
        )}
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
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
            showTotal: (total) => `共 ${total} 条记录`,
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
        onCancel={() => setIsContractPaymentModalVisible(false)}
        projectPayoutId={selectedProjectPayoutId!}
      />
    </div>
  );
};
