import React, { useState, useEffect, useRef } from "react";
import {
  Descriptions,
  Statistic,
  Card,
  Row,
  Col,
  Table,
  Tabs,
  Button,
  Divider,
  Input,
  Typography,
  Form,
  Select,
  Collapse,
  Segmented,
  Slider,
  InputNumber,
  InputNumberProps,
  Drawer,
  Affix,
  DatePicker,
  DatePickerProps,
} from "antd";
import {
  ProjectTaskTypePublicOut,
  ProjectPublicOut,
  ProjectsData,
  ProjectsPublicOut,
  ProjectsService,
  ProjectTaskTypesPublicOut,
  BuildingStructureTypePublicOut,
  BuildingStructureTypesService,
  BuildingStructureTypesPublicOut,
  QualityRatioClassPublicOut,
  QualityRatioClassesPublicOut,
  QualityRatioClassesService,
  ProjectTypePublicOut,
  ProjectClassesService,
  ProjectClassesPublicOut,
  ProjectClassPublicOut,
  ProjectTaskTypesService,
  ProjectTypesPublicOut,
  ProjectTypesService,
  BuildingTypesPublicOut,
  BuildingTypesService,
  BuildingTypePublicOut,
  ProjectRateAdjustmentClassesPublicOut,
  ProjectRateAdjustmentClassesService,
  DepartmentPayoutRatiosService,
  DepartmentPayoutRatioPublicOut,
  ProjectRateAdjustmentClassPublicOut,
  ProdValueCalcRatiosPublicOut,
  ProdValueCalcRatiosService,
  ProdValueCalcRatioPublicOut,
} from "../client";
import MySelectComponent from "../components/Dropdown";

const { Text, Link } = Typography;

const { TabPane } = Tabs;
const { Panel } = Collapse;

const DecimalInput: React.FC<any> = ({
  value = "",
  onChange,
  onBlur,
  ...props
}) => {
  // 处理失去焦点事件，补全小数点
  const handleBlur = () => {
    if (!isNaN(parseFloat(value))) {
      const formattedValue = parseFloat(value).toFixed(2);
      onChange && onChange(formattedValue);
    }
    // 调用传递进来的 onBlur 逻辑（如计算 "下发产值"）
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <Input
      {...props}
      value={value}
      onBlur={handleBlur}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  );
};

export const ProjectDetail = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [silderValue, setSilderValue] = useState(1);

  const [projectTypes, setProjectTypes] = useState<ProjectTypePublicOut[]>([]);
  const [projectClasses, setProjectClasses] = useState<ProjectClassPublicOut[]>(
    []
  ); //this one based on which projectType picked
  const [buildingTypes, setBuildingTypes] = useState<BuildingTypePublicOut[]>(
    []
  ); //this one based on which projectType picked
  const [projectTaskTypes, setPProjectTaskTypes] = useState<
    ProjectTaskTypePublicOut[]
  >([]);
  const [buildingStructureTypes, setBuildingStructureTypes] = useState<
    BuildingStructureTypePublicOut[]
  >([]);
  const [projectRateAdjustmentClasses, setProjectRateAdjustmentClasses] =
    useState<ProjectRateAdjustmentClassPublicOut[]>([]);
  const [qualityRatioClasses, setQualityRatioClasses] = useState<
    QualityRatioClassPublicOut[]
  >([]);
  const [defaultQualityRatioClasses, setDefaultQualityRatioClasses] =
    useState<QualityRatioClassPublicOut>();
  const [
    departmentPayoutRatioRelatedToProjectClassId,
    setDepartmentPayoutRatioRelatedToProjectClassId,
  ] = useState<DepartmentPayoutRatioPublicOut[]>([]); //this one is based on which projectClass picked and project-class is based on which projectType picked

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        resProjectType,
        resProjectClass,
        resBuildingType,
        resProjectTaskType,
        resBuildingStructureType,
        resProjectRateAdjustmentClass,
        resQualityRatioClass,
        resProdValCalcRatios,
        redDefaultProdValCalcRatios,
      ]: [
        ProjectTypesPublicOut,
        BuildingStructureTypesPublicOut,
        ProjectClassesPublicOut,
        BuildingTypesPublicOut,
        ProjectTaskTypesPublicOut,
        ProjectRateAdjustmentClassesPublicOut,
        QualityRatioClassesPublicOut,
        ProdValueCalcRatiosPublicOut,
        ProdValueCalcRatioPublicOut
      ] = await Promise.all([
        ProjectTypesService.readProjectTypes(),
        ProjectClassesService.readProjectClasses(),
        BuildingTypesService.readBuildingTypes(),
        ProjectTaskTypesService.readProjectTaskTypes(),
        BuildingStructureTypesService.readBuildingStructureTypes(),
        ProjectRateAdjustmentClassesService.readProjectRateAdjustmentClasses(),
        QualityRatioClassesService.readQualityRatioClasses(),
        ProdValueCalcRatiosService.readProdValueCalcRatios(),
        ProdValueCalcRatiosService.readProdValueCalcRatiosDefault(),
      ]);

      setProjectTypes(resProjectType.data);
      setProjectClasses(resProjectClass.data);
      setBuildingTypes(resBuildingType.data);
      setPProjectTaskTypes(resProjectTaskType.data);
      setBuildingStructureTypes(resBuildingStructureType.data);
      setProjectRateAdjustmentClasses(resProjectRateAdjustmentClass.data);
      setQualityRatioClasses(resQualityRatioClass.data);
      setDefaultQualityRatioClasses(redDefaultProdValCalcRatios);

      console.log(resProdValCalcRatios.data);
      const res =
        await ProdValueCalcRatiosService.readProdValueCalcRatiosDefault();
      console.log(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 列表数据示例
  const columns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "数量", dataIndex: "quantity", key: "quantity" },
    { title: "状态", dataIndex: "status", key: "status" },
  ];

  const tableData = [
    { key: 1, name: "商品 A", quantity: 12, status: "正常" },
    { key: 2, name: "商品 B", quantity: 5, status: "缺货" },
  ];
  const handleProjectTypeSelectChange = async (value: number) => {
    const selected = projectTypes.find((option) => option.id === value) || null;
    const relatedProjectClassName = projectClasses.find(
      (value) => value.id === selected?.project_class_id
    );
    const relatedBuildingTyeName = buildingTypes.find(
      (value) => value.id === selected?.building_type_id
    );
    form.setFieldsValue({
      projectClass: relatedProjectClassName?.id,
      buildingType: relatedBuildingTyeName?.id,
    });

    //get departmentPayoutRatio related to projectClassId, and projectClassId based on which projectType picked
    const res =
      await DepartmentPayoutRatiosService.readDepartmentPayoutRatiosByProjectClassId(
        { projectClassId: relatedProjectClassName!!.id }
      );
    setDepartmentPayoutRatioRelatedToProjectClassId(res.data);
    console.log(
      new Set(res.data.map((value) => value.project_rate_adjustment_class_id))
    );
    //console.log(res.data.map((value)=>value.project_rate_adjustment_class_id));
    // console.log(res);
    // console.log(projectRateAdjustmentClasses);
  };
  const calculateIssuedValue = () => {
    console.log("计算下发产值...");

    const value = form.getFieldValue("projectContractValue") || 0;
    const ratio = defaultQualityRatioClasses?.ratio || 1;
    const issuedValue = value * ratio; // 例如：下发产值为项目值的 80%
    form.setFieldsValue({ calculatedEmployeePayout: issuedValue.toFixed(2) });
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [segmentedValue, setSegmentedValue] = useState("Option 1");

  const handleFormFinish = (values: any) => {
    console.log("表单提交时的值:", values);
  };
  // 展开面板时更新状态
  const handleFocus = () => {
    setIsPanelOpen(true);
    console.log(inputValue);
  };
  // Collapse panel after all children lose focus
  const handleBlur = () => {
    // Timeout to ensure panel collapses only when no other element has focus
    setTimeout(() => {
      if (!document.activeElement?.closest(".panel-content")) {
        setIsPanelOpen(false);
      }
    }, 100); // Add a small delay to check the focus state
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSegmentedChange = (value: string) => {
    setSegmentedValue(value);
    const projectContractValue =
      form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({ calculatedEmployeePayout: projectContractValue });
  };
  const handleSlideronChange: InputNumberProps["onChange"] = (newValue) => {
    const value = newValue as number;
    setSilderValue(value);
    const projectContractValue =
    form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({
      calculatedEmployeePayout: (projectContractValue * (value / 100)).toFixed(2),
    });
  };
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(form.getFieldValue("projectYear"));
    
  };

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div ref={containerRef} id="my-drawer-container" style={{overflow:"hidden", position:'relative'}}>
      <h2 style={{ marginTop: 0 }}>新建工程</h2>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Affix offsetTop={0}>
<Drawer title="Basic Drawer" onClose={onClose} open={open} mask={false} maskClosable={false} autoFocus={false} placement="top"
       getContainer={false}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      </Affix>
      
      <Divider />
    
      <Form form={form} onFinish={handleFormFinish} >
        <Typography.Title level={5}>项目基本信息</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="项目名称" name="1">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目年度" name="projectYear">
            <DatePicker onChange={onChange} picker="year" style={{width:'100%'}}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目工号" name="password">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Typography.Title level={5}>施工细节</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="工程类型" name="projectType">
              {/* {renderDropdown(projectTypes)} */}
              {/* <MySelectComponent options={projectTypes} handleChange={handleProjectTypeSelectChange}/> */}
              <Select onChange={handleProjectTypeSelectChange}>
                {projectTypes.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="工程等级" name="projectClass">
              <Select disabled={true}>
                {projectClasses.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="民用建筑类别" name="buildingType">
              <Select disabled={true}>
                {buildingTypes.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="工程项目类别" name="projectTaskType">
              <Select>
                {projectTaskTypes.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="系数调整类别" name="projectRateAdjustmentClass">
              <Select>
                {/* {projectRateAdjustmentClasses.map(option => (
                        <Select.Option key={option.id} value={option.id}>
                            {option.name}
                        </Select.Option>
                        ))} */}
                {departmentPayoutRatioRelatedToProjectClassId.map((option) => {
                  const pra: ProjectRateAdjustmentClassPublicOut | undefined =
                    projectRateAdjustmentClasses.find(
                      (value) =>
                        value.id === option.project_rate_adjustment_class_id
                    );
                  return (
                    <Select.Option key={pra?.id} value={pra?.id}>
                      {pra?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设计质量系数" name="qualityRatioClass">
              <Select>
                {qualityRatioClasses.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="结构形式" name="buildingStructureType">
              <Select>
                {buildingStructureTypes.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="工程面积（平方米）" name="projectArea">
              <DecimalInput />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="工程总造价（元）" name="projectConstructionCost">
              <DecimalInput />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item label="施工图合同额" name="projectContractValue">
          <DecimalInput onBlur={calculateIssuedValue} />
        </Form.Item>

        <Divider />

        <Typography.Title level={5}>产值详情</Typography.Title>

        <Form.Item label="产值录入状态" name="project_code">
          <Input />
        </Form.Item>

        <Form.Item label="下发产值(元)">
          <Collapse activeKey={isPanelOpen ? ["1"] : []}>
            <Panel
              header={
                <Form.Item name="calculatedEmployeePayout" noStyle>
                  <Input
                    className="panel-header-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="请输入标题"
                  />
                </Form.Item>
              }
              key="1"
              showArrow={false} // Hide the expand arrow icon
            >
              <div
                className="panel-content"
                onFocus={handleFocus} // Expand when any child gets focus
                onBlur={handleBlur} // Collapse when all children lose focus
              >
                <Row align="middle" justify="start">
                  <Col>
                    <Text style={{ marginRight: 10 }}>预设百分比:</Text>
                  </Col>
                  <Col>
                    <Segmented
                      options={["33%", "Option 2", "Option 3"]}
                      value={segmentedValue}
                      onChange={handleSegmentedChange}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      onChange={handleSlideronChange}
                      value={typeof silderValue === "number" ? silderValue : 0}
                      tooltip={{
                        formatter: (value) => `${value}%`, // Append % after value
                      }}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      style={{ margin: "0 16px" }}
                      value={silderValue}
                      onChange={handleSlideronChange}
                      formatter={(value) => `${value}%`}
                    />
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      {/* 顶部统计数据展示 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="项目总数" value={1128} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已完成任务" value={93} suffix="/ 100" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="进行中任务" value={21} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="参与人员" value={50} />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 详细信息展示 */}
      <Card title="项目信息" style={{ marginBottom: "20px" }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="项目名称">
            {data.projectName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="项目编号">
            {data.projectCode || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="负责人">
            {data.projectManager || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {data.createdAt || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {data.status || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="描述">
            {data.description || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      {/* 标签页，展示更多数据 */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="商品列表" key="1">
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
        <TabPane tab="其他信息" key="2">
          <p>这里可以展示其他信息，如图表、文件等。</p>
        </TabPane>
      </Tabs>

      <Divider />

      {/* 操作按钮 */}
      <Row justify="end">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
        <Button type="default" style={{ marginLeft: "10px" }}>
          返回
        </Button>
      </Row>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
    </div>
  );
};