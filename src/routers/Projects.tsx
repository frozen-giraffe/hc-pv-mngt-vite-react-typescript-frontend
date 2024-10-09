import { Button, message, Popover, Space, Table, TableProps, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, FilePdfOutlined } from "@ant-design/icons";
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
  GetProjectListReportData,
  GetProjectListReportError,
} from "../client";
import { GetColumnNames } from "../helper";
import { useAuth } from "../context/AuthContext";
import { downloadReport, useDownloadReport } from "../utils/ReportFileDownload";
import { useNavigate } from "react-router-dom";
import ProjectListDownloadModal from '../components/ProjectListDownloadModal';
import ProjectReportModal from '../components/ProjectReportModal';
import CompanyReportModal from "../components/CompanyReportModal";
import ContractPaymentModal from '../components/ContractPaymentModal';
// type ProjectFullDetail = Omit<ProjectPublicOut, 'project_type_id', 'project_task_type_id'> & {

// 	project_task_types: Array<ProjectTaskTypePublicOut>;
// };
export const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tableHeight, setTableHeight] = useState(400); // Default height
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<ProjectPublicOut[]>([]);
  const [buildingStructureType, setBuildingStructureType] = useState<
    BuildingStructureTypePublicOut[]
  >([]);
  const [qualityRatioClass, setQualityRatioClass] = useState<
    QualityRatioClassPublicOut[]
  >([]);
  const [projectType, setProjectType] = useState<ProjectTypePublicOut[]>([]);
  const [projectTaskType, setPProjectTaskType] = useState<
    ProjectTaskTypePublicOut[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isProjectListDownloadModalVisible, setIsProjectListDownloadModalVisible] = useState(false);
  const [isProjectReportModalVisible, setIsProjectReportModalVisible] = useState(false);
  const [isCompanyReportModalVisible, setIsCompanyReportModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedProjectPayoutId, setSelectedProjectPayoutId] = useState<number | null>(null);
  const [isContractPaymentModalVisible, setIsContractPaymentModalVisible] = useState(false);
  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };
  const updateTableHeight = () => {
    if (scrollContainerRef.current) {
      const windowHeight = window.innerHeight;
      const containerTop =
        scrollContainerRef.current.getBoundingClientRect().top;
      const newHeight = windowHeight - containerTop - 20; // 20px for some bottom margin
      setTableHeight(newHeight);
    }
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
      render: (id: number) => getValueFromListByID(id, projectTaskType, "id",'name'),
      width: 120,
    },
    {
      title: "设计质量系数",
      dataIndex: getProjectPublicOutColumn("quality_ratio_class_id"),
      render: (id: number) =>
        getValueFromListByID(id, qualityRatioClass, "id",'name'),
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
        getValueFromListByID(id, buildingStructureType, "id",'name'),
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
      render: (id: number) => getValueFromListByID(id, projectType, "id",'name'),
      width: 200,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (row: ProjectPublicOut) => {
        return user?.is_superuser ?(
          <Space>
            <Typography.Link
              onClick={() => handleOpenDetail(row)}
              style={{ marginInlineEnd: 8 }}
            >
              详情
            </Typography.Link>
            <Popover
              title={row.project_payout === null ? "项目没有下发产值，无法生成报告" : ""}>
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
              title={row.project_payout === null ? "项目没有下发产值，无法录入回款" : ""}>
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

  const fetchProjects = async () => {
    try {
      //show loading spinner on table
      handleLoadingChange(true);

      const [
        resProjects,
        resBuildingStructureType,
        resQualityRatioClass,
        resProjectType,
        resProjectTaskType,
      ] = await Promise.all([
        ProjectsService.getAndFilterProjects(),
        BuildingStructureTypesService.readBuildingStructureTypes(),
        QualityRatioClassesService.readQualityRatioClasses(),
        ProjectTypesService.readProjectTypes(),
        ProjectTaskTypesService.readProjectTaskTypes(),
      ]);
      let loadError = false;
      if (resProjects.error) {
        message.error("获取项目失败: " + resProjects.error.detail);
        loadError = true;
        return;
      }
      if (resBuildingStructureType.error) {
        message.error("获取工程等级失败: " + resBuildingStructureType.error.detail);
        loadError = true;
        return;
      }
      if (resQualityRatioClass.error) {
        message.error("获取设计质量系数失败: " + resQualityRatioClass.error.detail);
        loadError = true;
        return;
      }
      if (resProjectType.error) {
        message.error("获取项目类型失败: " + resProjectType.error.detail);
        loadError = true;
        return;
      }
      if (resProjectTaskType.error) {
        message.error("获取项目类型失败: " + resProjectTaskType.error.detail);
        loadError = true;
        return;
      }
      if (loadError) {
        handleLoadingChange(false);
        return;
      }

      setProjects(resProjects.data.data);
      setBuildingStructureType(resBuildingStructureType.data.data);
      setQualityRatioClass(resQualityRatioClass.data.data);
      setProjectType(resProjectType.data.data);
      setPProjectTaskType(resProjectTaskType.data.data);
    } catch (e) {
      // Stop the loading spinner on table once the data is fetched
      console.error("Error fetching data:", e);
    } finally {
      // Stop the loading spinner on table once the data is fetched
      handleLoadingChange(false);
    }
  };
  const handleTableChange: TableProps<ProjectPublicOut>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
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
  useEffect(() => {
    fetchProjects();
    updateTableHeight(); // Initial height calculation
    window.addEventListener("resize", updateTableHeight);
    return () => window.removeEventListener("resize", updateTableHeight);
  }, []);

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
        type: 'loading',
        content: '正在导出项目列表...',
        duration: 5,
        onClose: () => {
          messageApi.open({
            key: "downloadProjectList",
            type: 'loading',
            content: '正在导出项目列表...数据较多，请耐心等待，且不要离开此页面',
            duration: 0,
          });
        }
      });
      ReportsService.getProjectListReport({ query: { project_year: project_year } }).then((res) => {
        if (res.data) {
          messageApi.open({
            key: "downloadProjectList",
            type: 'success',
            content: '项目列表导出成功，正在下载...',
            duration: 2,
          });
          downloadReport(res.data, res.response);
        } else {
          messageApi.open({
            key: "downloadProjectList",
            type: 'error',
            content: '获取项目列表失败：' + res.error?.detail,
            duration: 10,
          });
        }
      });
    } catch (e) {
      messageApi.open({
        key: "downloadProjectList",
        type: 'error',
        content: '获取项目列表失败，未知错误：' + e,
        duration: 10,
      });
    }
  };

  const showContractPaymentModal = (projectPayoutId: number) => {
    setSelectedProjectPayoutId(projectPayoutId);
    setIsContractPaymentModalVisible(true);
  };

  return (
    <div ref={scrollContainerRef}>
      {contextHolder}
      {user?.is_superuser && (
        <Space style={loading || projects.length === 0 ? { marginBottom: 16 } : { marginBottom: 16, position: 'absolute', zIndex: 1 }}>
          <Button
            onClick={showProjectDetail}
            type="primary"
          >
            <PlusOutlined />
            添加
          </Button>
          <Button
            onClick={showProjectListDownloadModal}
            icon={<FilePdfOutlined />}
          >
            导出项目列表
          </Button>
          <Button
            onClick={showCompanyReportModal}
            icon={<FilePdfOutlined />}
          >
            公司年度报告
          </Button>
        </Space>
      )}
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={projects}
        onChange={handleTableChange} // Trigger data fetching when pagination changes
        pagination={{ pageSize: 13, position: ["topRight"] }}
        scroll={{ x: "max-content" }}
        style={{ height: "100%" }}
        size="small"
      />
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