import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  Button,
  Space,
  Typography,
  message,
  Table,
  Form,
  Popconfirm,
  Tooltip,
  Alert,
  Divider,
  Input,
  Tag,
} from "antd";
import {
  JobPayoutRatioProfilePublicOut,
  JobPayoutRatioProfilesService,
  JobPayoutRatioProfileCreateIn,
  JobPayoutRatioProfileUpdateIn,
} from "../../client";
import InputDirectPercent from "../../components/InputDirectPercent";
import { InfoCircleOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
const { Title } = Typography;

const JobPayoutRatioProfileSettings: React.FC = () => {
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProfileId, setSelectedProfileId] = useState<
    number | undefined
  >(undefined);
  const [selectedProfileData, setSelectedProfileData] =
    useState<JobPayoutRatioProfilePublicOut | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const errorsRef = useRef<{
    pm: string | null;
    departments: { [key: string]: string | null };
  }>({
    pm: null,
    departments: {},
  });
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [isNewProfilePopoverVisible, setIsNewProfilePopoverVisible] =
    useState(false);
  const [renameNewNameError, setRenameNewNameError] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchProfiles();
  }, []);

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
    } else {
      message.error("未找到所选配置文件");
    }
  };

  const handleNewProfile = (clone_target?: JobPayoutRatioProfilePublicOut) => {
    const newProfile: JobPayoutRatioProfilePublicOut = {
      id: -1,
      name: "新建配置",
      hidden: false,
      updated_at: new Date().toISOString(),
      is_in_use: false,
      pm_ratio: clone_target?.pm_ratio ?? 0,
      pm_assistant_ratio: clone_target?.pm_assistant_ratio ?? 0,
      arch_pm_ratio: clone_target?.arch_pm_ratio ?? 0,
      arch_pm_assistant_ratio: clone_target?.arch_pm_assistant_ratio ?? 0,
      arch_designer_ratio: clone_target?.arch_designer_ratio ?? 0,
      arch_drafter_ratio: clone_target?.arch_drafter_ratio ?? 0,
      arch_design_post_service_ratio:
        clone_target?.arch_design_post_service_ratio ?? 0,
      arch_proofreader_ratio: clone_target?.arch_proofreader_ratio ?? 0,
      arch_reviewer_ratio: clone_target?.arch_reviewer_ratio ?? 0,
      arch_approver_ratio: clone_target?.arch_approver_ratio ?? 0,
      struct_pm_ratio: clone_target?.struct_pm_ratio ?? 0,
      struct_pm_assistant_ratio: clone_target?.struct_pm_assistant_ratio ?? 0,
      struct_designer_ratio: clone_target?.struct_designer_ratio ?? 0,
      struct_drafter_ratio: clone_target?.struct_drafter_ratio ?? 0,
      struct_design_post_service_ratio:
        clone_target?.struct_design_post_service_ratio ?? 0,
      struct_proofreader_ratio: clone_target?.struct_proofreader_ratio ?? 0,
      struct_reviewer_ratio: clone_target?.struct_reviewer_ratio ?? 0,
      struct_approver_ratio: clone_target?.struct_approver_ratio ?? 0,
      plumbing_pm_ratio: clone_target?.plumbing_pm_ratio ?? 0,
      plumbing_pm_assistant_ratio:
        clone_target?.plumbing_pm_assistant_ratio ?? 0,
      plumbing_designer_ratio: clone_target?.plumbing_designer_ratio ?? 0,
      plumbing_drafter_ratio: clone_target?.plumbing_drafter_ratio ?? 0,
      plumbing_design_post_service_ratio:
        clone_target?.plumbing_design_post_service_ratio ?? 0,
      plumbing_proofreader_ratio: clone_target?.plumbing_proofreader_ratio ?? 0,
      plumbing_reviewer_ratio: clone_target?.plumbing_reviewer_ratio ?? 0,
      plumbing_approver_ratio: clone_target?.plumbing_approver_ratio ?? 0,
      electrical_pm_ratio: clone_target?.electrical_pm_ratio ?? 0,
      electrical_pm_assistant_ratio:
        clone_target?.electrical_pm_assistant_ratio ?? 0,
      electrical_designer_ratio: clone_target?.electrical_designer_ratio ?? 0,
      electrical_drafter_ratio: clone_target?.electrical_drafter_ratio ?? 0,
      electrical_design_post_service_ratio:
        clone_target?.electrical_design_post_service_ratio ?? 0,
      electrical_proofreader_ratio:
        clone_target?.electrical_proofreader_ratio ?? 0,
      electrical_reviewer_ratio: clone_target?.electrical_reviewer_ratio ?? 0,
      electrical_approver_ratio: clone_target?.electrical_approver_ratio ?? 0,
      hvac_pm_ratio: clone_target?.hvac_pm_ratio ?? 0,
      hvac_pm_assistant_ratio: clone_target?.hvac_pm_assistant_ratio ?? 0,
      hvac_designer_ratio: clone_target?.hvac_designer_ratio ?? 0,
      hvac_drafter_ratio: clone_target?.hvac_drafter_ratio ?? 0,
      hvac_design_post_service_ratio:
        clone_target?.hvac_design_post_service_ratio ?? 0,
      hvac_proofreader_ratio: clone_target?.hvac_proofreader_ratio ?? 0,
      hvac_reviewer_ratio: clone_target?.hvac_reviewer_ratio ?? 0,
      hvac_approver_ratio: clone_target?.hvac_approver_ratio ?? 0,
      low_voltage_pm_ratio: clone_target?.low_voltage_pm_ratio ?? 0,
      low_voltage_pm_assistant_ratio:
        clone_target?.low_voltage_pm_assistant_ratio ?? 0,
      low_voltage_designer_ratio: clone_target?.low_voltage_designer_ratio ?? 0,
      low_voltage_drafter_ratio: clone_target?.low_voltage_drafter_ratio ?? 0,
      low_voltage_design_post_service_ratio:
        clone_target?.low_voltage_design_post_service_ratio ?? 0,
      low_voltage_proofreader_ratio:
        clone_target?.low_voltage_proofreader_ratio ?? 0,
      low_voltage_reviewer_ratio: clone_target?.low_voltage_reviewer_ratio ?? 0,
      low_voltage_approver_ratio: clone_target?.low_voltage_approver_ratio ?? 0,
    };
    setProfiles([...profiles, newProfile]);
    setSelectedProfileId(-1);
    setSelectedProfileData(newProfile);
    setIsNewProfilePopoverVisible(false);
    handleEdit(newProfile);
  };

  const createNewProfile = async (name: string) => {
    try {
      const values = await form.validateFields();
      const newProfile: JobPayoutRatioProfileCreateIn = {
        name,
        ...values.pm,
        ...values.arch,
        ...values.struct,
        ...values.plumbing,
        ...values.electrical,
        ...values.hvac,
        ...values.low_voltage,
      };
      console.log("Creating new profile:", newProfile);
      const {error} = await JobPayoutRatioProfilesService.createJobPayoutRatioProfile({
        body: newProfile,
      });
      if (error) {
        message.error("创建模板失败: " + error.detail);
      } else {
        message.success("模板创建成功");
        setIsEditing(false);
        // Refresh profiles list
        await fetchProfiles();
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Failed to create new profile");
    }
  };

  const renameProfile = async (profileId: number, newName: string) => {
    // TODO: Implement API call to rename profile
    console.log("Renaming profile:", profileId, "to", newName);
    const {error} = await JobPayoutRatioProfilesService.updateJobPayoutRatioProfile({
      path: {
        id: profileId,
      },
      body: {
        name: newName,
      },
    });
    if (error) {
      message.error("更改模板名称失败: " + error.detail);
    } else {
      message.success("模板名称已更改");
    }
    // Refresh profiles list
    fetchProfiles();
  };

  const showNameModal = (initialName: string = "") => {
    setNewProfileName(initialName);
    setRenameNewNameError(null);
    setIsRenameModalVisible(true);
  };

  const handleRenameModalOk = () => {
    if (!newProfileName.trim()) {
      setRenameNewNameError("模板名称不能为空");
      return;
    }
    if (profiles.some((profile) => profile.name === newProfileName.trim())) {
      setRenameNewNameError("模板名称已存在");
      return;
    }
    setRenameNewNameError(null);
    setIsRenameModalVisible(false);
    if (selectedProfileId === -1) {
      // Create new profile
      createNewProfile(newProfileName.trim());
    } else {
      // Rename existing profile
      if (!selectedProfileId) {
        message.error("未找到选择的配置文件。请联系管理员");
        return;
      }
      renameProfile(selectedProfileId, newProfileName.trim());
    }
  };

  const handleReameModalCancel = () => {
    setIsRenameModalVisible(false);
  };

  const handleDelete = () => {
    // TODO: Implement profile deletion
    console.log("Delete profile:", selectedProfileId);
  };

  const handleHide = async () => {
    console.log("Toggle profile visibility:", selectedProfileId);
    try {
      const {error} = await JobPayoutRatioProfilesService.updateJobPayoutRatioProfile({
        path:{
          id: selectedProfileId!,
        },
        body: {
          hidden: !selectedProfileData?.hidden,
        },
      });
      if (error) {
        message.error("更改模板可见性失败: " + error.detail);
      } else {
        message.success("模板已" + (selectedProfileData?.hidden ? "显示" : "隐藏"));
      }
      setProfiles(prevProfiles =>
        prevProfiles.map(profile =>
          profile.id === selectedProfileId
            ? { ...profile, hidden: !profile.hidden }
            : profile
        )
      );
      setSelectedProfileData(prevData =>
        prevData ? { ...prevData, hidden: !prevData.hidden } : null
      );
    } catch (error) {
      message.error("更改模板可见性失败，未知错误: " + error);
      console.log(error);
    }
  };

  const profileDataToFormValues = (profileData: JobPayoutRatioProfilePublicOut) => {
    return {
      pm: {
        pm_ratio: profileData.pm_ratio,
        pm_assistant_ratio: profileData.pm_assistant_ratio,
      },
      arch: {
        pm_ratio: profileData.arch_pm_ratio,
        pm_assistant_ratio: profileData.arch_pm_assistant_ratio,
        designer_ratio: profileData.arch_designer_ratio,
        drafter_ratio: profileData.arch_drafter_ratio,
        design_post_service_ratio:
          profileData.arch_design_post_service_ratio,
        proofreader_ratio: profileData.arch_proofreader_ratio,
        reviewer_ratio: profileData.arch_reviewer_ratio,
        approver_ratio: profileData.arch_approver_ratio,
      },
      arch_payout: {
        pm_ratio: profileData.arch_pm_ratio,
        pm_assistant_ratio: profileData.arch_pm_assistant_ratio,
        designer_ratio: profileData.arch_designer_ratio,
        drafter_ratio: profileData.arch_drafter_ratio,
        design_post_service_ratio:
          profileData.arch_design_post_service_ratio,
        proofreader_ratio: profileData.arch_proofreader_ratio,
        reviewer_ratio: profileData.arch_reviewer_ratio,
        approver_ratio: profileData.arch_approver_ratio,
      },
      struct: {
        pm_ratio: profileData.struct_pm_ratio,
        pm_assistant_ratio: profileData.struct_pm_assistant_ratio,
        designer_ratio: profileData.struct_designer_ratio,
        drafter_ratio: profileData.struct_drafter_ratio,
        design_post_service_ratio:
          profileData.struct_design_post_service_ratio,
        proofreader_ratio: profileData.struct_proofreader_ratio,
        reviewer_ratio: profileData.struct_reviewer_ratio,
        approver_ratio: profileData.struct_approver_ratio,
      },
      plumbing: {
        pm_ratio: profileData.plumbing_pm_ratio,
        pm_assistant_ratio: profileData.plumbing_pm_assistant_ratio,
        designer_ratio: profileData.plumbing_designer_ratio,
        drafter_ratio: profileData.plumbing_drafter_ratio,
        design_post_service_ratio:
          profileData.plumbing_design_post_service_ratio,
        proofreader_ratio: profileData.plumbing_proofreader_ratio,
        reviewer_ratio: profileData.plumbing_reviewer_ratio,
        approver_ratio: profileData.plumbing_approver_ratio,
      },
      electrical: {
        pm_ratio: profileData.electrical_pm_ratio,
        pm_assistant_ratio: profileData.electrical_pm_assistant_ratio,
        designer_ratio: profileData.electrical_designer_ratio,
        drafter_ratio: profileData.electrical_drafter_ratio,
        design_post_service_ratio:
          profileData.electrical_design_post_service_ratio,
        proofreader_ratio: profileData.electrical_proofreader_ratio,
        reviewer_ratio: profileData.electrical_reviewer_ratio,
        approver_ratio: profileData.electrical_approver_ratio,
      },
      hvac: {
        pm_ratio: profileData.hvac_pm_ratio,
        pm_assistant_ratio: profileData.hvac_pm_assistant_ratio,
        designer_ratio: profileData.hvac_designer_ratio,
        drafter_ratio: profileData.hvac_drafter_ratio,
        design_post_service_ratio:
          profileData.hvac_design_post_service_ratio,
        proofreader_ratio: profileData.hvac_proofreader_ratio,
        reviewer_ratio: profileData.hvac_reviewer_ratio,
        approver_ratio: profileData.hvac_approver_ratio,
      },
      low_voltage: {
        pm_ratio: profileData.low_voltage_pm_ratio,
        pm_assistant_ratio:
          profileData.low_voltage_pm_assistant_ratio,
        designer_ratio: profileData.low_voltage_designer_ratio,
        drafter_ratio: profileData.low_voltage_drafter_ratio,
        design_post_service_ratio:
          profileData.low_voltage_design_post_service_ratio,
        proofreader_ratio: profileData.low_voltage_proofreader_ratio,
        reviewer_ratio: profileData.low_voltage_reviewer_ratio,
        approver_ratio: profileData.low_voltage_approver_ratio,
      }
    }
  };
        
  

  const handleEdit = (override_data?: JobPayoutRatioProfilePublicOut) => {
    setIsEditing(true);
    if (override_data) {
      const formValues = profileDataToFormValues(override_data);
      form.setFieldsValue(formValues);
    } else if (selectedProfileData) {
      const formValues = profileDataToFormValues(selectedProfileData);
      form.setFieldsValue(formValues);
    }
    validateForm();
  };

  const validatePMSum = () => {
    const pmValues = form.getFieldValue("pm");

    const pmRatio = Number(pmValues?.pm_ratio) || 0;
    const pmAssistantRatio = Number(pmValues?.pm_assistant_ratio) || 0;
    const sum = pmRatio + pmAssistantRatio;

    const isValid = Math.abs(sum - 100) <= 0.01 || sum === 0;
    errorsRef.current.pm = isValid
      ? null
      : "项目负责人和助理的比例之和必须为100% 或 0%";
    return isValid;
  };

  const validateDepartmentSum = (department: string) => {
    const departmentValues = form.getFieldValue(department);
    if (!departmentValues) {
      console.log(`No values found for department ${department}, assuming 0%`);
      return true;
    }

    const sum = Object.values(departmentValues).reduce(
      (acc: number, value: any) => acc + (Number(value) || 0),
      0
    );
    console.log(`Sum for department ${department}: ${sum}`);
    const isValid = Math.abs(sum - 100) <= 0.01 || sum === 0;
    errorsRef.current.departments[department] = isValid
      ? null
      : "比例之和须为100% 或 0%";
    return isValid;
  };

  const validateForm = () => {
    const allValues = form.getFieldsValue(true);
    console.log("All form values:", allValues);

    let hasErrors = false;

    if (!validatePMSum()) {
      errorsRef.current.pm = "项目负责人和助理的比例之和必须为100% 或 0%";
      hasErrors = true;
    } else {
      errorsRef.current.pm = null;
    }

    ["arch", "struct", "plumbing", "electrical", "hvac", "low_voltage"].forEach(
      (dept) => {
        if (!validateDepartmentSum(dept)) {
          errorsRef.current.departments[dept] = "比例之和须为100% 或 0%";
          hasErrors = true;
        } else {
          errorsRef.current.departments[dept] = null;
        }
      }
    );
    return !hasErrors;
  };

  const handleInputChange = (
    value: number,
    field: string,
    department: string
  ) => {
    form.setFieldsValue({ [department]: { [field]: value } });
    if (department === "pm") {
      validatePMSum();
    } else {
      validateDepartmentSum(department);
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      if (selectedProfileId === -1) {
        showNameModal();
      } else {
        try {
          const values = await form.validateFields();
          const updatedProfile: JobPayoutRatioProfileUpdateIn = {
            id: selectedProfileId!,
            name: selectedProfileData!.name,
            ...values.pm,
            ...values.arch,
            ...values.struct,
            ...values.plumbing,
            ...values.electrical,
            ...values.hvac,
            ...values.low_voltage,
          };
          // TODO: Implement API call to save changes
          console.log("Saving changes:", updatedProfile);
          setIsEditing(false);
          message.success("Changes saved successfully");
          // Refresh profiles list
          await fetchProfiles();
        } catch (error) {
          console.error("Validation failed:", error);
          message.error("Failed to save changes");
        }
      }
    } else {
      message.error("表单上存在错误，请更正后保存");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedProfileId === -1) {
      setSelectedProfileId(undefined);
      setSelectedProfileData(null);
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== -1)
      );
      form.resetFields();
    } else {
      form.setFieldsValue(selectedProfileData);
    }
  };

  const EditableCell: React.FC<any> = ({
    editing,
    dataIndex,
    record,
    children,
    ...restProps
  }) => {
    if (!editing) {
      return <td {...restProps}>{children}</td>;
    }

    const recordKey = record?.key || "";
    const fieldName =
      recordKey === "pm" ? ["pm", dataIndex] : [recordKey, dataIndex];

    const inputNode = (
      <Form.Item
        style={{ margin: 0 }}
        validateStatus={
          (recordKey === "pm" && errorsRef.current.pm) ||
          (recordKey && errorsRef.current.departments[recordKey])
            ? "error"
            : ""
        }
        help={
          (recordKey === "pm" && errorsRef.current.pm) ||
          (recordKey && errorsRef.current.departments[recordKey])
        }
      >
        <Form.Item
          name={fieldName}
          noStyle
          validateStatus={
            (recordKey === "pm" && errorsRef.current.pm) ||
            (recordKey && errorsRef.current.departments[recordKey])
              ? "error"
              : ""
          }
        >
          <InputDirectPercent
            step={0.5}
            min={0}
            max={100}
            style={{ width: "100%" }}
            onChange={(value) => {
              const numValue = parseFloat(value ? value.toString() : "0");
              handleInputChange(numValue, dataIndex, recordKey);
            }}
          />
        </Form.Item>
      </Form.Item>
    );

    return <td {...restProps}>{inputNode}</td>;
  };

  const pmColumns = [
    {
      title: "项目负责人",
      dataIndex: "pm_ratio",
      key: "pm_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "项目负责人助理",
      dataIndex: "pm_assistant_ratio",
      key: "pm_assistant_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
  ];

  const departmentColumns = [
    {
      title: "专业",
      dataIndex: "department",
      key: "department",
      fixed: "left" as const,
      width: 70,
    },
    {
      title: "专业负责人",
      dataIndex: "pm_ratio",
      key: "pm_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "专业负责人助理",
      dataIndex: "pm_assistant_ratio",
      key: "pm_assistant_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "设计人",
      dataIndex: "designer_ratio",
      key: "designer_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "制图人",
      dataIndex: "drafter_ratio",
      key: "drafter_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "后期服务",
      dataIndex: "design_post_service_ratio",
      key: "design_post_service_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "校对人",
      dataIndex: "proofreader_ratio",
      key: "proofreader_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "审核人",
      dataIndex: "reviewer_ratio",
      key: "reviewer_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
    {
      title: "审定人",
      dataIndex: "approver_ratio",
      key: "approver_ratio",
      editable: true,
      render: (value: number | null) => {
        if (value === null || value === undefined) {
          return "";
        }
        return `${Number(value).toFixed(2)}%`;
      },
    },
  ];

  const departmentNameMap = useMemo(() => ({
    pm: "项目管理",
    arch: "建筑",
    struct: "结构",
    plumbing: "给排水",
    electrical: "电气",
    hvac: "暖通",
    low_voltage: "弱电",
  }), []);

  const getDepartmentName = useCallback((key: keyof typeof departmentNameMap) => departmentNameMap[key] || key, [departmentNameMap]);

  const getDepartmentTableData = useCallback(() => {
    if (!selectedProfileData) return [];

    const departments = [
      "arch",
      "struct",
      "plumbing",
      "electrical",
      "hvac",
      "low_voltage",
    ];

    return departments.map((dept) => ({
      key: dept,
      department: getDepartmentName(dept as keyof typeof departmentNameMap),
      pm_ratio:
        selectedProfileData[
          `${dept}_pm_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      pm_assistant_ratio:
        selectedProfileData[
          `${dept}_pm_assistant_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      designer_ratio:
        selectedProfileData[
          `${dept}_designer_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      drafter_ratio:
        selectedProfileData[
          `${dept}_drafter_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      design_post_service_ratio:
        selectedProfileData[
          `${dept}_design_post_service_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      proofreader_ratio:
        selectedProfileData[
          `${dept}_proofreader_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      reviewer_ratio:
        selectedProfileData[
          `${dept}_reviewer_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      approver_ratio:
        selectedProfileData[
          `${dept}_approver_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
    }));
  }, [getDepartmentName, selectedProfileData]);

  const mergedPmColumns = pmColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: JobPayoutRatioProfilePublicOut) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing,
      }),
    };
  });

  const mergedDepartmentColumns = departmentColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: JobPayoutRatioProfilePublicOut) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing,
      }),
    };
  });

  // const hasErrors = () => {
  //   return Object.values(errorsRef.current.departments).some(
  //     (error) => error !== null
  //   );
  // };

  const handleNewProfileOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsNewProfilePopoverVisible(newOpen);
      return;
    }

    if (selectedProfileData) {
      // If a profile is selected, show Popconfirm
      setIsNewProfilePopoverVisible(true);
      return;
    }
    // If no profile is selected, create a new one from scratch
    handleNewProfile();
  };

  return (
    <div style={{ maxWidth: "1300px" }}>
      <Modal
        title={selectedProfileId === -1 ? "输入新分配模板名称" : "重命名模板"}
        open={isRenameModalVisible}
        onOk={handleRenameModalOk}
        onCancel={handleReameModalCancel}
      >
        <Form>
          <Form.Item
            validateStatus={renameNewNameError ? "error" : ""}
            help={renameNewNameError}
          >
            <Input
              value={newProfileName}
              onChange={(e) => {
                setNewProfileName(e.target.value);
                if (e.target.value.trim()) {
                  setRenameNewNameError(null);
                }
              }}
              placeholder="模板名称"
            />
          </Form.Item>
        </Form>
      </Modal>
      <h2>
        设计阶段产值系数
        <Tooltip title="设置各设计阶段之间工比，用来自动化产值计算。">
          <InfoCircleOutlined
            style={{ marginLeft: "8px", cursor: "pointer" }}
          />
        </Tooltip>
      </h2>
      <Alert
        message="修改此处的预设不会影响已计算的产值数据。"
        type="info"
        showIcon
      />
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Select
            value={selectedProfileId}
            onChange={handleProfileSelect}
            style={{ width: 300 }}
            disabled={loading || isEditing}
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
          <Popconfirm
            title="是否要复制当前选中的配置文件中的系数？"
            onOpenChange={handleNewProfileOpenChange}
            open={isNewProfilePopoverVisible}
            onConfirm={() => handleNewProfile(selectedProfileData!)}
            onCancel={() => handleNewProfile()}
            okText="是"
            cancelText="否"
          >
            <Button disabled={loading || isEditing} type="primary">
              新建
            </Button>
          </Popconfirm>
          <Button
            onClick={() => showNameModal(selectedProfileData?.name || "")}
            disabled={!selectedProfileId || isEditing}
          >
            重命名
          </Button>

          <Tooltip
            title={
              !selectedProfileData
                ? "未选择配置"
                : selectedProfileData?.is_in_use
                ? "无法删除正在使用的配置"
                : "删除选择的配置"
            }
          >
            <Button
              onClick={handleDelete}
              danger
              disabled={
                !selectedProfileId ||
                isEditing ||
                selectedProfileData?.is_in_use
              }
            >
              删除
            </Button>
          </Tooltip>

          <Tooltip
            title={
              !selectedProfileData
                ? "未选择配置"
                : "隐藏选择的配置。配置将不会在产值计算时显示"
            }
          >
            <Button
              onClick={handleHide}
              danger
              disabled={!selectedProfileId || isEditing}
            >
              {selectedProfileData?.hidden ? "显示模板" : "隐藏模板"}
            </Button>
          </Tooltip>
        </Space>

        {selectedProfileData && (
          <Form form={form} component={false}>
            <Title level={4}>{getDepartmentName("pm")}</Title>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedPmColumns}
              dataSource={[
                {
                  key: "pm",
                  department: getDepartmentName("pm"),
                  pm_ratio: selectedProfileData?.pm_ratio,
                  pm_assistant_ratio: selectedProfileData?.pm_assistant_ratio,
                },
              ]}
              pagination={false}
              size="small"
              scroll={{ x: 300 }}
              style={{ maxWidth: "300px" }}
            />
            <Title level={4} style={{ marginTop: "20px" }}>
              部门
            </Title>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedDepartmentColumns}
              dataSource={getDepartmentTableData()}
              pagination={false}
              size="small"
              scroll={{ x: 930 }}
            />
            <Space style={{ marginTop: 16 }}>
              {isEditing ? (
                <>
                  <Popconfirm
                    title="确定要保存更改吗？"
                    onConfirm={handleSave}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="primary"
                      // disabled={hasErrors()}
                    >
                      保存
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="所做更改将不会保存，确定要取消吗？"
                    onConfirm={handleCancel}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                    // disabled={hasErrors()}
                    >
                      取消
                    </Button>
                  </Popconfirm>
                </>
              ) : (
                <Tooltip
                  title={
                    selectedProfileData.is_in_use
                      ? "不允许编辑已在使用的配置文件"
                      : ""
                  }
                >
                  <Button
                    onClick={() => handleEdit(selectedProfileData)}
                    disabled={selectedProfileData.is_in_use}
                  >
                    编辑
                  </Button>
                </Tooltip>
              )}
            </Space>
          </Form>
        )}
      </Space>
    </div>
  );
};

export default JobPayoutRatioProfileSettings;
