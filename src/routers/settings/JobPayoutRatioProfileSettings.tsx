import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  Button,
  Space,
  Typography,
  message,
  Table,
  Form,
  Popconfirm,
} from "antd";
import {
  JobPayoutRatioProfilePublicOut,
  JobPayoutRatioProfilesService,
  JobPayoutRatioProfileCreateIn,
  JobPayoutRatioProfileUpdateIn,
  ApiError,
} from "../../client";
import InputDirectPercent from "../../components/InputDirectPercent";

const { Option } = Select;
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


  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response =
        await JobPayoutRatioProfilesService.readJobPayoutRatioProfiles();
      const filteredProfiles = response.data.filter(
        (profile) => profile.id !== 1
      );
      setProfiles(filteredProfiles);
      setLoading(false);
    } catch (error) {
      if (error instanceof ApiError) {
        message.error("获取工比失败: " + error.message);
      } else {
        message.error("获取工比失败: 未知错误");
      }
    }
  };
  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    const selectedProfile = profiles.find(profile => profile.id === profileId);
    if (selectedProfile) {
      setSelectedProfileData(selectedProfile);
    } else {
      message.error("未找到所选配置文件");
    }
  };

  const handleNewProfile = () => {
    // TODO: Implement new profile creation
    console.log("Create new profile");
  };

  const handleRename = () => {
    // TODO: Implement profile renaming
    console.log("Rename profile:", selectedProfileId);
  };

  const handleDelete = () => {
    // TODO: Implement profile deletion
    console.log("Delete profile:", selectedProfileId);
  };
  const handleEdit = () => {
    setIsEditing(true);
    if (selectedProfileData) {
      const formValues = {
        pm: {
          pm_ratio: selectedProfileData.pm_ratio,
          pm_assistant_ratio: selectedProfileData.pm_assistant_ratio,
        },
        arch: {
          pm_ratio: selectedProfileData.arch_pm_ratio,
          pm_assistant_ratio: selectedProfileData.arch_pm_assistant_ratio,
          designer_ratio: selectedProfileData.arch_designer_ratio,
          drafter_ratio: selectedProfileData.arch_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.arch_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.arch_proofreader_ratio,
          reviewer_ratio: selectedProfileData.arch_reviewer_ratio,
          approver_ratio: selectedProfileData.arch_approver_ratio,
        },
        struct: {
          pm_ratio: selectedProfileData.struct_pm_ratio,
          pm_assistant_ratio: selectedProfileData.struct_pm_assistant_ratio,
          designer_ratio: selectedProfileData.struct_designer_ratio,
          drafter_ratio: selectedProfileData.struct_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.struct_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.struct_proofreader_ratio,
          reviewer_ratio: selectedProfileData.struct_reviewer_ratio,
          approver_ratio: selectedProfileData.struct_approver_ratio,
        },
        plumbing: {
          pm_ratio: selectedProfileData.plumbing_pm_ratio,
          pm_assistant_ratio: selectedProfileData.plumbing_pm_assistant_ratio,
          designer_ratio: selectedProfileData.plumbing_designer_ratio,
          drafter_ratio: selectedProfileData.plumbing_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.plumbing_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.plumbing_proofreader_ratio,
          reviewer_ratio: selectedProfileData.plumbing_reviewer_ratio,
          approver_ratio: selectedProfileData.plumbing_approver_ratio,
        },
        electrical: {
          pm_ratio: selectedProfileData.electrical_pm_ratio,
          pm_assistant_ratio: selectedProfileData.electrical_pm_assistant_ratio,
          designer_ratio: selectedProfileData.electrical_designer_ratio,
          drafter_ratio: selectedProfileData.electrical_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.electrical_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.electrical_proofreader_ratio,
          reviewer_ratio: selectedProfileData.electrical_reviewer_ratio,
          approver_ratio: selectedProfileData.electrical_approver_ratio,
        },
        hvac: {
          pm_ratio: selectedProfileData.hvac_pm_ratio,
          pm_assistant_ratio: selectedProfileData.hvac_pm_assistant_ratio,
          designer_ratio: selectedProfileData.hvac_designer_ratio,
          drafter_ratio: selectedProfileData.hvac_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.hvac_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.hvac_proofreader_ratio,
          reviewer_ratio: selectedProfileData.hvac_reviewer_ratio,
          approver_ratio: selectedProfileData.hvac_approver_ratio,
        },
        low_voltage: {
          pm_ratio: selectedProfileData.low_voltage_pm_ratio,
          pm_assistant_ratio:
            selectedProfileData.low_voltage_pm_assistant_ratio,
          designer_ratio: selectedProfileData.low_voltage_designer_ratio,
          drafter_ratio: selectedProfileData.low_voltage_drafter_ratio,
          design_post_service_ratio:
            selectedProfileData.low_voltage_design_post_service_ratio,
          proofreader_ratio: selectedProfileData.low_voltage_proofreader_ratio,
          reviewer_ratio: selectedProfileData.low_voltage_reviewer_ratio,
          approver_ratio: selectedProfileData.low_voltage_approver_ratio,
        },
      };
      form.setFieldsValue(formValues);
    }
    validateForm();
  };

  const validatePMSum = () => {
    const pmValues = form.getFieldValue("pm");

    const pmRatio = Number(pmValues?.pm_ratio) || 0;
    const pmAssistantRatio = Number(pmValues?.pm_assistant_ratio) || 0;
    const sum = pmRatio + pmAssistantRatio;

    const isValid = Math.abs(sum - 100) <= 0.01;
    errorsRef.current.pm = isValid
      ? null
      : "项目负责人和助理的比例之和必须为100%";
    return isValid;
  };

  const validateDepartmentSum = (department: string) => {
    const departmentValues = form.getFieldValue(department);
    if (!departmentValues) {
      console.log(`No values found for department ${department}`);
      return false;
    }

    const sum = Object.values(departmentValues).reduce(
      (acc: number, value: any) => acc + (Number(value) || 0),
      0
    );
    console.log(`Sum for department ${department}: ${sum}`);
    const isValid = Math.abs(sum - 100) <= 0.01;
    errorsRef.current.departments[department] = isValid
      ? null
      : "比例之和须为100%";
    return isValid;
  };

  const validateForm = () => {
    const allValues = form.getFieldsValue(true);
    console.log("All form values:", allValues);

    let hasErrors = false;

    if (!validatePMSum()) {
      errorsRef.current.pm = "项目负责人和助理的比例之和必须为100%";
      hasErrors = true;
    } else {
      errorsRef.current.pm = null;
    }

    ["arch", "struct", "plumbing", "electrical", "hvac", "low_voltage"].forEach(
      (dept) => {
        if (!validateDepartmentSum(dept)) {
          errorsRef.current.departments[dept] =
            "比例之和须为100%";
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
      try {
        const values = await form.validateFields();
        const updatedProfile: JobPayoutRatioProfileUpdateIn = {
          id: selectedProfileId!,
          name: selectedProfileData!.name,
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
      } catch (error) {
        console.error("Validation failed:", error);
      }
    } else {
      message.error("表单上存在错误，请更正后保存");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(selectedProfileData);
  };

  const EditableCell: React.FC<any> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
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
        <Form.Item name={fieldName} noStyle
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
              const numValue = parseFloat(value);
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
      title: "设计后服务",
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
      title: "批准人",
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

  const departmentNameMap: { [key: string]: string } = {
    pm: "项目管理",
    arch: "建筑",
    struct: "结构",
    plumbing: "给排水",
    electrical: "电气",
    hvac: "暖通",
    low_voltage: "弱电",
  };

  const getDepartmentName = (key: string) => departmentNameMap[key] || key;

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
      department: getDepartmentName(dept),
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
      onCell: (record: any) => ({
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
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing,
      }),
    };
  });

  const hasErrors = () => {
    return Object.values(errorsRef.current.departments).some(
      (error) => error !== null
    );
  };

  return (
    <div>
      <Title level={2}>设计阶段产值系数</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Select
            value={selectedProfileId}
            onChange={handleProfileSelect}
            style={{ width: 200 }}
            placeholder="选择配置文件"
          >
            {profiles.map((profile) => (
              <Option key={profile.id} value={profile.id}>
                {profile.name}
              </Option>
            ))}
          </Select>
          <Button onClick={handleNewProfile} disabled={loading || isEditing}>
            新建
          </Button>
          <Button onClick={handleRename} disabled={!selectedProfileId || isEditing}>
            重命名
          </Button>
          <Button onClick={handleDelete} danger disabled={!selectedProfileId || isEditing}>
            删除
          </Button>
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
            />
            <Title level={4} style={{ marginTop: "20px" }}>
              专业部门
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
              scroll={{ x: 1000 }}
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
                    <Button type="primary" 
                    // disabled={hasErrors()}
                    >
                      保存
                    </Button>
                  </Popconfirm><Popconfirm
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
                <Button onClick={handleEdit}>编辑</Button>
              )}
            </Space>
          </Form>
        )}
      </Space>
    </div>
  );
};

export default JobPayoutRatioProfileSettings;
