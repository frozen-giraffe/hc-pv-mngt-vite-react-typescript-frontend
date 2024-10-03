import React, { useEffect, useState } from "react";
import { Select, Button, Space, Typography, message, Table } from "antd";
import {
  JobPayoutRatioProfilePublicOut,
  JobPayoutRatioProfilesService,
  JobPayoutRatioProfileCreateIn,
  JobPayoutRatioProfileUpdateIn,
  ApiError,
} from "../../client";

const { Option } = Select;
const { Title } = Typography;

const JobPayoutRatioProfileSettings: React.FC = () => {
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response =
        await JobPayoutRatioProfilesService.readJobPayoutRatioProfiles();
      const filteredProfiles = response.data.filter(profile => profile.id !== 1);
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
  const [selectedProfileId, setSelectedProfileId] = useState<number | undefined>(
    undefined
  );
  const [selectedProfileData, setSelectedProfileData] = useState<JobPayoutRatioProfilePublicOut | null>(null);

  const handleProfileSelect = async (profileId: number) => {
    setSelectedProfileId(profileId);
    try {
      const response = await JobPayoutRatioProfilesService.getJobPayoutRatioProfileById({ id: profileId });
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

  const pmColumns = [
    { title: '项目负责人', dataIndex: 'pm_ratio', key: 'pm_ratio', editable: true },
    { title: '项目负责人助理', dataIndex: 'pm_assistant_ratio', key: 'pm_assistant_ratio', editable: true },
  ];

  const mainColumns = [
    { title: '专业', dataIndex: 'department', key: 'department'},
    { title: '专业负责人', dataIndex: 'pm_ratio', key: 'pm_ratio' },
    { title: '专业负责人助理', dataIndex: 'pm_assistant_ratio', key: 'pm_assistant_ratio' },
    { title: '设计人', dataIndex: 'designer_ratio', key: 'designer_ratio' },
    { title: '制图人', dataIndex: 'drafter_ratio', key: 'drafter_ratio' },
    { title: '设计后服务', dataIndex: 'design_post_service_ratio', key: 'design_post_service_ratio' },
    { title: '校对人', dataIndex: 'proofreader_ratio', key: 'proofreader_ratio' },
    { title: '审核人', dataIndex: 'reviewer_ratio', key: 'reviewer_ratio' },
    { title: '批准人', dataIndex: 'approver_ratio', key: 'approver_ratio' },
  ];

  const getMainTableData = () => {
    if (!selectedProfileData) return [];

    const departments = ['arch', 'struct', 'plumbing', 'electrical', 'hvac', 'low_voltage'];
    return departments.map(dept => ({
      department: getDepartmentName(dept),
      pm_ratio: selectedProfileData[`${dept}_pm_ratio` as keyof JobPayoutRatioProfilePublicOut],
      pm_assistant_ratio: selectedProfileData[`${dept}_pm_assistant_ratio` as keyof JobPayoutRatioProfilePublicOut],
      designer_ratio: selectedProfileData[`${dept}_designer_ratio` as keyof JobPayoutRatioProfilePublicOut],
      drafter_ratio: selectedProfileData[`${dept}_drafter_ratio` as keyof JobPayoutRatioProfilePublicOut],
      design_post_service_ratio: selectedProfileData[`${dept}_design_post_service_ratio` as keyof JobPayoutRatioProfilePublicOut],
      proofreader_ratio: selectedProfileData[`${dept}_proofreader_ratio` as keyof JobPayoutRatioProfilePublicOut],
      reviewer_ratio: selectedProfileData[`${dept}_reviewer_ratio` as keyof JobPayoutRatioProfilePublicOut],
      approver_ratio: selectedProfileData[`${dept}_approver_ratio` as keyof JobPayoutRatioProfilePublicOut],
    }));
  };

  const getDepartmentName = (dept: string) => {
    const names = {
      arch: '建筑',
      struct: '结构',
      plumbing: '给排水',
      electrical: '电气',
      hvac: '暖通',
      low_voltage: '弱电',
    };
    return names[dept as keyof typeof names] || dept;
  };

  return (
    <div>
      <Title level={2}>设计阶段产值系数</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Select
            value={selectedProfileId}
            onChange={handleProfileSelect}
            style={{ width: 200 }}
            placeholder="选择配置文件"
          >
            {profiles.map((profile) => (
              <Option key={profile.id} value={profile.id} >
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
          <>
            <Table
              columns={pmColumns}
              dataSource={[{
                pm_ratio: selectedProfileData.pm_ratio,
                pm_assistant_ratio: selectedProfileData.pm_assistant_ratio,
              }]}
              pagination={false}
              size="small"
            />
            <Table
              columns={mainColumns}
              dataSource={getMainTableData()}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Space>
    </div>
  );
};

export default JobPayoutRatioProfileSettings;