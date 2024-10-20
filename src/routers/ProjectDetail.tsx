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
  FormInstance,
  message,
  TableProps,
  Tooltip,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import {
  ProjectTaskTypePublicOut,
  ProjectPublicOut,
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
  JobPayoutRatioProfilePublicOut,
  JobPayoutRatioProfilesService,
  WorkLocationPublicOut,
  WorkLocationsService,
} from "../client";
import MySelectComponent from "../components/Dropdown";
import { PayoutTable } from "../components/PayoutTable";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
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
  const [data, setData] = useState<ProjectPublicOut>();
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
  const [prodValCalcRatios, setProdValCalcRatios] = useState<
    ProdValueCalcRatioPublicOut[]
  >([]);
  const [defaultProdValCalcRatio, setDefaultProdValCalcRatio] =
    useState<ProdValueCalcRatioPublicOut>();

  const [
    departmentPayoutRatioRelatedToProjectClassId,
    setDepartmentPayoutRatioRelatedToProjectClassId,
  ] = useState<DepartmentPayoutRatioPublicOut[]>([]); //this one is based on which projectClass picked and project-class is based on which projectType picked
  const [pageTitle, setPageTitle] = useState("新建项目");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  
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
        resDefaultProdValCalcRatios,
        resWorkLocations,
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
        WorkLocationsService.readWorkLocations(),
        
      ]);
      if (resProjectType.error || resProjectClass.error || resBuildingType.error || resProjectTaskType.error || resBuildingStructureType.error || resProjectRateAdjustmentClass.error || resQualityRatioClass.error || resProdValCalcRatios.error || resDefaultProdValCalcRatios.error || resWorkLocations.error) {
        message.error("项目基本信息类获取失败: "+resProjectType.error?.detail || resProjectClass.error?.detail || resBuildingType.error?.detail || resProjectTaskType.error?.detail || resBuildingStructureType.error?.detail || resProjectRateAdjustmentClass.error?.detail || resQualityRatioClass.error?.detail || resProdValCalcRatios.error?.detail || resDefaultProdValCalcRatios.error?.detail || resWorkLocations.error?.detail)
      } else {
        setProjectTypes(resProjectType.data.data);
        setProjectClasses(resProjectClass.data.data);
        setBuildingTypes(resBuildingType.data.data);
        setPProjectTaskTypes(resProjectTaskType.data.data);
        setBuildingStructureTypes(resBuildingStructureType.data.data);
        setProjectRateAdjustmentClasses(resProjectRateAdjustmentClass.data.data);
        setQualityRatioClasses(resQualityRatioClass.data.data);
        setProdValCalcRatios(resProdValCalcRatios.data.data);
        setDefaultProdValCalcRatio(resDefaultProdValCalcRatios.data);
        //set default option highlighted
        setSegmentedValue(resDefaultProdValCalcRatios.data.ratio.toString())
        //set default silder position
        setSilderValue(resDefaultProdValCalcRatios.data.ratio*100)
      }
    } catch (error) {
      message.error("项目基本信息类获取失败: "+ error);
      //console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    if (searchParams.get('id')){
      fetchProjectDetail();
    }
  };

  const fetchProjectDetail = async () => {
    const res = await ProjectsService.readProject({path: {id: Number(searchParams.get('id'))}})
    if (res.data){
      setData(res.data)
      setPageTitle("项目信息: "+res.data.name)
      form.setFieldsValue({
        projectName: res.data.name,
        projectYear: dayjs(res.data.project_year+"-01-01"),
        projectCode: res.data.project_code,
        projectType: res.data.project_type_id,
        buildingType: res.data.building_type_id,
        projectTaskType: res.data.project_task_type_id,
        projectClass: res.data.project_class_id,
        buildingStructureType: res.data.building_structure_type_id,
        qualityRatioClass: res.data.quality_ratio_class_id,
        projectArea: res.data.project_area,
        projectConstructionCost: res.data.project_construction_cost,
        calculatedEmployeePayout: res.data.calculated_employee_payout,
        projectContractValue: res.data.project_contract_value,
        projectRateAdjustmentClass: res.data.project_rate_adjustment_class_id, 
      })
      console.log(res.data.project_rate_adjustment_class_id)
    }
  } 

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
        { path: { project_class_id: relatedProjectClassName!!.id } }
      );
    if(res.data){
      setDepartmentPayoutRatioRelatedToProjectClassId(res.data.data);
    } else {
      setDepartmentPayoutRatioRelatedToProjectClassId([]);
    }
    console.log(
      new Set(res.data?.data.map((value) => value.project_rate_adjustment_class_id) || [])
    );
    //console.log(res.data.map((value)=>value.project_rate_adjustment_class_id));
    // console.log(res);
    // console.log(projectRateAdjustmentClasses);
  };
  
  const calculateIssuedValue = () => {
    console.log("计算下发产值...");
    const preValue=form.getFieldValue('calculatedEmployeePayout')
    const value = form.getFieldValue("projectContractValue") || 0;
    const ratio = defaultProdValCalcRatio?.ratio || 1;
    const issuedValue = value * ratio; // 例如：下发产值为项目值的 80%
    if(preValue!==issuedValue.toFixed(2)){
        form.setFieldsValue({ calculatedEmployeePayout: issuedValue.toFixed(2) });
    }
    if(segmentedValue || silderValue){

    }else{
        
        form.setFieldsValue({ calculatedEmployeePayout: issuedValue.toFixed(2) });
    }
    
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [segmentedValue, setSegmentedValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
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
  const handleFormFinish = async(fieldsValue: any) => {
    console.log("表单提交时的值:", fieldsValue);
    console.log(fieldsValue['projectYear'].format('YYYY'));
    
    try{
        const res = await ProjectsService.createProject({body:{
            project_code: fieldsValue['projectCode'],
            name: fieldsValue['projectName'],
            project_year: fieldsValue['projectYear'].format('YYYY'),
            project_type_id: fieldsValue['projectType'],
            building_type_id: fieldsValue['buildingType'],
            project_task_type_id: fieldsValue['projectTaskType'],
            project_class_id: fieldsValue['projectClass'],
            building_structure_type_id: fieldsValue['buildingStructureType'],
            project_rate_adjustment_class_id: fieldsValue['projectRateAdjustmentClass'],
            quality_ratio_class_id: fieldsValue['qualityRatioClass'],
            project_area: fieldsValue['projectArea'],
            project_construction_cost: fieldsValue['projectConstructionCost'],
            calculated_employee_payout: fieldsValue['calculatedEmployeePayout'],
            project_contract_value: fieldsValue['projectContractValue'],
        }})
        if(res.data){
            successMessage('创建成功')
        }else{
            errorMessage('创建失败: '+res.error.detail)
        }
    }catch(e){
        errorMessage('创建失败')

    }
    
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
    console.log(value);
    setSilderValue(parseFloat(value)*100);
    
    setSegmentedValue(value);
    const projectContractValue = form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({ calculatedEmployeePayout: (projectContractValue*parseFloat(value)).toFixed(2) });
  };
  const handleSlideronChange: InputNumberProps["onChange"] = (newValue) => {
    const value = newValue as number;
    setSilderValue(value);
    setSegmentedValue('')//unselect options in Segmented
    const projectContractValue = form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({
      calculatedEmployeePayout: (projectContractValue * (value / 100)).toFixed(
        2
      ),
    });
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(form.getFieldValue("projectYear"));
    console.log(dateString);
    form.setFieldValue('projectCode', dateString+'-')
    
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
    <div
      ref={containerRef}
      id="my-drawer-container"
      style={{ overflow: "hidden", position: "relative" }}
    >
      <h2 style={{ marginTop: 0 }}>{pageTitle}</h2>
      
      <Affix offsetTop={0}>
        <Drawer
          title="Basic Drawer"
          onClose={onClose}
          open={open}
          mask={false}
          maskClosable={false}
          autoFocus={false}
          placement="top"
          getContainer={false}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </Affix>

      <Divider />

      <Form form={form} onFinish={handleFormFinish}>
        <Typography.Title level={5}>项目基本信息</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="项目名称" name="projectName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目年度" name="projectYear" rules={[{ required: true }]}>
              <DatePicker
                onChange={onChange}
                picker="year"
                style={{ width: "100%" }}
                placeholder=""
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="项目工号" name="projectCode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Typography.Title level={5}>工程信息</Typography.Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="工程类型" name="projectType" rules={[{ required: true }]}>
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
            <Form.Item label="工程等级" name="projectClass" rules={[{ required: true }]}>
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
            <Form.Item label="民用建筑类别" name="buildingType" rules={[{ required: true }]}>
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
            <Form.Item label="工程项目类别" name="projectTaskType" rules={[{ required: true }]}>
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
            <Form.Item label="系数调整类别" name="projectRateAdjustmentClass" rules={[{ required: true }]}>
              <Select>
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
            <Form.Item label="设计质量系数" name="qualityRatioClass" rules={[{ required: true }]}>
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
            <Form.Item label="结构形式" name="buildingStructureType" rules={[{ required: true }]}>
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
            <Form.Item label="工程面积(平方米)" name="projectArea" rules={[{ required: true }]}>
              <DecimalInput />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="工程总造价(元)" name="projectConstructionCost" rules={[{ required: true }]}>
              <DecimalInput />
            </Form.Item>
          </Col>
        </Row>

        

        <Divider />

        <Typography.Title level={5}>产值详情</Typography.Title>

        <Form.Item label="施工图合同额(元)" name="projectContractValue" rules={[{ required: true }]}>
          <DecimalInput onBlur={calculateIssuedValue} />
        </Form.Item>

        <Form.Item label="下发产值(元)" required>
          <Collapse 
            activeKey={isPanelOpen ? ["1"] : []}
            items={[{
              key:'1',
              label: (
                <Form.Item label="下发产值(元)" name="calculatedEmployeePayout" noStyle rules={[{ required: true }]}>
                  <Input
                    className="panel-header-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              ),
              children:(
                <div
                  className="panel-content"
                  onFocus={handleFocus} // Expand when any child gets focus
                  onBlur={handleBlur}   // Collapse when all children lose focus
                >
                  <Row align="middle" justify="start">
                    <Col>
                      <Text style={{ marginRight: 10 }}>预设百分比:</Text>
                    </Col>
                    <Col>
                      <Segmented
                        options={prodValCalcRatios.sort((a)=>a.default?-1:1).map((value) => ({
                          label: `${(value.ratio*100).toFixed(2)}%`,
                          value: `${value.ratio}`,
                          icon: <Tooltip title={(value.default? "(默认) ": "")+ value.name }><InfoCircleOutlined/></Tooltip>
                        }))}
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
              ),
              showArrow:false,
            }]}
                
          >
            {/* <Panel
              header={
                <Form.Item label="下发产值(元)" name="calculatedEmployeePayout" noStyle rules={[{ required: true }]}>
                  <Input
                    className="panel-header-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
                      options={prodValCalcRatios.map((value) => `${value.ratio}`)}
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
            </Panel> */}
          </Collapse>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
              提交项目
          </Button>
        </Form.Item>
      </Form>
      {/* 下发产值表 */}
      <Divider/>
      <h2 style={{ marginTop: 0 }}>下发产值表</h2>
      <PayoutTable></PayoutTable>
      <Divider />

      {/* 操作按钮 */}
      {/* <Row justify="end">
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
      </Button> */}
    </div>
  );
};
