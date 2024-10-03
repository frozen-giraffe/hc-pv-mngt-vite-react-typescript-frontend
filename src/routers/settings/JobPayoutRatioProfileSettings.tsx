import React, { useCallback, useEffect, useState } from "react";
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

  const handleProfileSelect = async (profileId: number) => {
    setSelectedProfileId(profileId);
    try {
      const response =
        await JobPayoutRatioProfilesService.getJobPayoutRatioProfileById({
          id: profileId,
        });
      setSelectedProfileData(response);
    } catch (error) {
      if (error instanceof ApiError) {
        message.error("获取工比详情失败: " + error.message);
      } else {
        message.error("获取工比详情失败: 未知错误");
      }
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
      console.log("Form Values:", formValues);
      form.setFieldsValue(formValues);
    }
  };

  const handleSave = async () => {
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
    const inputNode = (
      <InputDirectPercent
        step={0.01}
        min={0}
        max={100}
        style={{ width: "100%" }}
      />
    );

    let fieldName = dataIndex;
    if (record && record.department) {
      const deptMap: { [key: string]: string } = {
        项目管理: "pm",
        建筑: "arch",
        结构: "struct",
        给排水: "plumbing",
        电气: "electrical",
        暖通: "hvac",
        弱电: "low_voltage",
      };
      const deptKey = deptMap[record.department] || record.department;
      fieldName = [deptKey, dataIndex];
    }
    console.log("EditableCell fieldName:", fieldName, "record:", record);

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={fieldName}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const pmColumns = [
    {
      title: "项目负责人",
      dataIndex: "pm_ratio",
      key: "pm_ratio",
      editable: true,
    },
    {
      title: "项目负责人助理",
      dataIndex: "pm_assistant_ratio",
      key: "pm_assistant_ratio",
      editable: true,
    },
  ];

  const departmentColumns = [
    { title: "专业", dataIndex: "department", key: "department" },
    {
      title: "专业负责人",
      dataIndex: "pm_ratio",
      key: "pm_ratio",
      editable: true,
    },
    {
      title: "专业负责人助理",
      dataIndex: "pm_assistant_ratio",
      key: "pm_assistant_ratio",
      editable: true,
    },
    {
      title: "设计人",
      dataIndex: "designer_ratio",
      key: "designer_ratio",
      editable: true,
    },
    {
      title: "制图人",
      dataIndex: "drafter_ratio",
      key: "drafter_ratio",
      editable: true,
    },
    {
      title: "设计后服务",
      dataIndex: "design_post_service_ratio",
      key: "design_post_service_ratio",
      editable: true,
    },
    {
      title: "校对人",
      dataIndex: "proofreader_ratio",
      key: "proofreader_ratio",
      editable: true,
    },
    {
      title: "审核人",
      dataIndex: "reviewer_ratio",
      key: "reviewer_ratio",
      editable: true,
    },
    {
      title: "批准人",
      dataIndex: "approver_ratio",
      key: "approver_ratio",
      editable: true,
    },
  ];

  const getDepartmentTableData = useCallback(() => {
    if (!selectedProfileData) return [];

    const departments = [
      { key: "arch", name: "建筑" },
      { key: "struct", name: "结构" },
      { key: "plumbing", name: "给排水" },
      { key: "electrical", name: "电气" },
      { key: "hvac", name: "暖通" },
      { key: "low_voltage", name: "弱电" },
    ];

    return departments.map((dept) => ({
      key: dept.key,
      department: dept.name,
      pm_ratio:
        selectedProfileData[
          `${dept.key}_pm_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      pm_assistant_ratio:
        selectedProfileData[
          `${dept.key}_pm_assistant_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      designer_ratio:
        selectedProfileData[
          `${dept.key}_designer_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      drafter_ratio:
        selectedProfileData[
          `${dept.key}_drafter_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      design_post_service_ratio:
        selectedProfileData[
          `${dept.key}_design_post_service_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      proofreader_ratio:
        selectedProfileData[
          `${dept.key}_proofreader_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      reviewer_ratio:
        selectedProfileData[
          `${dept.key}_reviewer_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
      approver_ratio:
        selectedProfileData[
          `${dept.key}_approver_ratio` as keyof JobPayoutRatioProfilePublicOut
        ],
    }));
  }, [selectedProfileData]);


  const validateDepartmentSum = (department: string) => {
    const fields = [
      `${department}_pm_ratio`,
      `${department}_pm_assistant_ratio`,
      `${department}_designer_ratio`,
      `${department}_drafter_ratio`,
      `${department}_design_post_service_ratio`,
      `${department}_proofreader_ratio`,
      `${department}_reviewer_ratio`,
      `${department}_approver_ratio`,
    ];

    const sum = fields.reduce(
      (acc, field) => acc + (form.getFieldValue(field) || 0),
      0
    );
    return Math.abs(sum - 100) <= 0.01;
  };

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
          <Button onClick={handleNewProfile} disabled={loading}>
            新建
          </Button>
          <Button onClick={handleRename} disabled={!selectedProfileId}>
            重命名
          </Button>
          <Button onClick={handleDelete} danger disabled={!selectedProfileId}>
            删除
          </Button>
        </Space>

        {selectedProfileData && (
          <Form form={form} component={false}>
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
                  department: "pm",
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
                    <Button type="primary">保存</Button>
                  </Popconfirm>
                  <Button onClick={handleCancel}>取消</Button>
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
