import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
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
  message,
  Tooltip,
  notification,
  Descriptions,
  Skeleton,
  Result,
  Space,
} from "antd";
import {
  ProjectTaskTypePublicOut,
  ProjectPublicOut,
  ProjectsService,
  BuildingStructureTypePublicOut,
  BuildingStructureTypesService,
  QualityRatioClassPublicOut,
  QualityRatioClassesService,
  ProjectTypePublicOut,
  ProjectClassesService,
  ProjectClassPublicOut,
  ProjectTaskTypesService,
  ProjectTypesService,
  BuildingTypesService,
  BuildingTypePublicOut,
  ProjectRateAdjustmentClassesService,
  DepartmentPayoutRatiosService,
  DepartmentPayoutRatioPublicOut,
  ProjectRateAdjustmentClassPublicOut,
  ProdValueCalcRatiosService,
  ProdValueCalcRatioPublicOut,
  WorkLocationsService,
  ProjectPayoutPublicOut,
  ProjectUpdateIn,
} from "../client";
import { PayoutTable } from "../components/PayoutTable";
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useInView } from 'react-intersection-observer';
const { Text } = Typography;

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
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [project, setProject] = useState<ProjectPublicOut>();
  const [loading, setLoading] = useState<boolean>(true);
  const [projectNotFound, setProjectNotFound] = useState<boolean>(false);
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
  const [projectPayout, setProjectPayout] = useState<ProjectPayoutPublicOut | null>(null);

  const [ratio, setRatio] = useState<number>(1);

  const [projectKey, setProjectKey] = useState(0);

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
        message.error("项目基本信息类获取败: "+resProjectType.error?.detail || resProjectClass.error?.detail || resBuildingType.error?.detail || resProjectTaskType.error?.detail || resBuildingStructureType.error?.detail || resProjectRateAdjustmentClass.error?.detail || resQualityRatioClass.error?.detail || resProdValCalcRatios.error?.detail || resDefaultProdValCalcRatios.error?.detail || resWorkLocations.error?.detail)
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
        //set default slider position and ratio
        setSilderValue(resDefaultProdValCalcRatios.data.ratio*100)
        setRatio(resDefaultProdValCalcRatios.data.ratio);
      }
    } catch (error) {
      message.error("项目基本信息类获取失败: "+ error);
      //console.error("Error fetching data:", error);
    } 
    if (id === 'new') {
      setLoading(false);
    }
    if (id && id !== 'new') {
      await fetchProjectDetail();
    } 
  };

  const fetchProjectDetail = async () => {
    const res = await ProjectsService.readProject({path: {id: Number(id)}})
    if (res.data){
      setProject(res.data)
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
      setProjectPayout(res.data.project_payout || null)
      const resDepartmentPayoutRatios =
      await DepartmentPayoutRatiosService.readDepartmentPayoutRatiosByProjectClassId(
        { path: { project_class_id: res.data.project_class_id } }
      );
      if(resDepartmentPayoutRatios.data){
        setDepartmentPayoutRatioRelatedToProjectClassId(resDepartmentPayoutRatios.data.data);
      } else {
        setDepartmentPayoutRatioRelatedToProjectClassId([]);
      }
      console.log(res.data.project_rate_adjustment_class_id)
    } else {
      console.log(res.error)
      setProjectNotFound(true)
    }
    setLoading(false);
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
        { path: { project_class_id: relatedProjectClassName!.id } }
      );
    if(res.data){
      setDepartmentPayoutRatioRelatedToProjectClassId(res.data.data);
      const currentProjectRateAdjustmentClassId = form.getFieldValue('projectRateAdjustmentClass')
      if (!res.data.data.find((value)=>value.project_rate_adjustment_class_id===currentProjectRateAdjustmentClassId)){
        form.setFieldValue('projectRateAdjustmentClass', undefined)
      }
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
    if(projectPayout?.contract_payment_payout_started){
      return true
    }
    const value = form.getFieldValue("projectContractValue") || 0;
    const issuedValue = value * ratio;
    form.setFieldsValue({ calculatedEmployeePayout: issuedValue.toFixed(2) });
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [segmentedValue, setSegmentedValue] = useState("");
  const [notificationApi, contextHolder] = notification.useNotification();
  const successMessage = (msg:string) => {
    notificationApi.success({
    type: 'success',
    message: msg,
    duration: 5,
    });
};
const errorMessage = (msg:string | undefined) => {
    notificationApi.error({
      type: 'error',
      message: msg || '未知错误',
      duration: 10,
    });
};
  const handleFormFinish = async(fieldsValue: any) => {
    console.log("表单提交时的值:", fieldsValue);
    console.log(fieldsValue['projectYear'].format('YYYY'));

    if (project){
      try {
        const newProject: ProjectUpdateIn = {
          project_code: fieldsValue['projectCode'],
          name: fieldsValue['projectName'],
          project_year: Number(fieldsValue['projectYear'].format('YYYY')),
          project_type_id: Number(fieldsValue['projectType']),
          building_type_id: Number(fieldsValue['buildingType']),
          project_task_type_id: Number(fieldsValue['projectTaskType']),
          project_class_id: Number(fieldsValue['projectClass']),
          building_structure_type_id: Number(fieldsValue['buildingStructureType']),
          project_rate_adjustment_class_id: Number(fieldsValue['projectRateAdjustmentClass']),
          quality_ratio_class_id: Number(fieldsValue['qualityRatioClass']),
          project_area: Number(fieldsValue['projectArea']),
          project_construction_cost: Number(fieldsValue['projectConstructionCost']),
          calculated_employee_payout: Number(fieldsValue['calculatedEmployeePayout']),
          project_contract_value: Number(fieldsValue['projectContractValue']),
        }
        const changedFields: ProjectUpdateIn = {}
        Object.keys(newProject).forEach((key) => {
          const typedKey = key as keyof ProjectUpdateIn;
          if (project[typedKey] !== newProject[typedKey]) {
            changedFields[typedKey] = newProject[typedKey];
          }
        });
        const res = await ProjectsService.updateProject({path: {id: project.id}, body: changedFields});
        if (res.data) {
          successMessage('更新成功')
          setProject(res.data)
          setProjectPayout(res.data.project_payout || null)
          setProjectKey(prevKey => prevKey + 1); // Increment the key to force re-render
        } else {
          errorMessage('更新失败: '+res.error.detail)
        }
      } catch (e) {
        errorMessage('更新失败，未知错误：'+e)
      }
    } else {
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
            setProject(res.data)
            setPageTitle("项目信息: "+res.data.name)
            setProjectPayout(res.data.project_payout || null)
            setProjectKey(prevKey => prevKey + 1); // Increment the key to force re-render
            navigate('/projects/'+res.data.id, {replace: true})
        }else{
            errorMessage('创建失败: '+res.error.detail)
        }
      }catch(e){
          errorMessage('创建失败，未知错误：'+e)
      }
    }

    
  };
  // 展开面板时更新状态
  const handleFocus = () => {
    setIsPanelOpen(true);
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
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const newRatio = parseFloat(inputValue) / parseFloat(form.getFieldValue("projectContractValue") || "1");
    if (!isNaN(newRatio) && newRatio > 0) {
      setRatio(newRatio);
      setSilderValue(newRatio * 100);
      setSegmentedValue(newRatio.toFixed(2));
    } else {
      setRatio(0);
      setSilderValue(0);
      setSegmentedValue('');
    }
  };

  const handleSegmentedChange = (value: string) => {
    const newRatio = parseFloat(value);
    setRatio(newRatio);
    setSilderValue(newRatio * 100);
    setSegmentedValue(value);
    const projectContractValue = form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({ calculatedEmployeePayout: (projectContractValue * newRatio).toFixed(2) });
  };

  const handleSlideronChange: InputNumberProps["onChange"] = (newValue) => {
    const value = newValue as number;
    setSilderValue(value);
    const newRatio = value / 100;
    setRatio(newRatio);
    setSegmentedValue(''); //unselect options in Segmented
    const projectContractValue = form.getFieldValue("projectContractValue") || 0;
    form.setFieldsValue({
      calculatedEmployeePayout: (projectContractValue * newRatio).toFixed(2),
    });
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(form.getFieldValue("projectYear"));
    console.log(dateString);
    form.setFieldValue('projectCode', dateString+'-')
    
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { ref: formWrapperRef, inView: isFormInView } = useInView({
    threshold: 0.1,
    rootMargin: '-10% 0px 0px 0px',
    initialInView: true,
  });

  useEffect(() => {
    setIsDrawerOpen(!isFormInView);
  }, [isFormInView]);

  if (loading) {
    return <Skeleton active />;
  }
  if (projectNotFound) {
    return <Result status="404" title={"项目ID "+ id +" 不存在"} subTitle="请返回上一页并重试。如果问题依旧存在，请联系管理员。" />;
  }

  return (
    <div
      id="my-drawer-container"
      style={{ overflow: "hidden", position: "relative" }}
    >
      {contextHolder}
      <h2 style={{ marginTop: 0 }}>{pageTitle}</h2>
      
      <Affix offsetTop={64}>
        <Drawer
          title="项目信息摘要"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          mask={false}
          maskClosable={false}
          autoFocus={false}
          placement="top"
          getContainer={false}
          height={'max-content'}
        >
          <Descriptions size="small">
            <Descriptions.Item label="项目名称">
              <Typography.Text ellipsis={{ tooltip: true }}>
                {form.getFieldValue('projectName')}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="项目年度">{form.getFieldValue('projectYear')?.format('YYYY')}</Descriptions.Item>
            <Descriptions.Item label="项目工号">{form.getFieldValue('projectCode')}</Descriptions.Item>
            <Descriptions.Item label="工程类型">
              <Typography.Text ellipsis={{ tooltip: true }}>
                {projectTypes.find((option)=>option.id===form.getFieldValue('projectType'))?.name}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="工程等级">{projectClasses.find((option)=>option.id===form.getFieldValue('projectClass'))?.name}</Descriptions.Item>
            {/* <Descriptions.Item label="民用建筑类别">{buildingTypes.find((option)=>option.id===form.getFieldValue('buildingType'))?.name}</Descriptions.Item>
            <Descriptions.Item label="工程项目类别">{projectTaskTypes.find((option)=>option.id===form.getFieldValue('projectTaskType'))?.name}</Descriptions.Item>
            <Descriptions.Item label="系数调整类别">{projectRateAdjustmentClasses.find((option)=>option.id===form.getFieldValue('projectRateAdjustmentClass'))?.name}</Descriptions.Item>
            <Descriptions.Item label="设计质量系数">{qualityRatioClasses.find((option)=>option.id===form.getFieldValue('qualityRatioClass'))?.name}</Descriptions.Item> */}
            {/* <Descriptions.Item label="结构形式">{buildingStructureTypes.find((option)=>option.id===form.getFieldValue('buildingStructureType'))?.name}</Descriptions.Item> */}
            <Descriptions.Item label="工程面积">{form.getFieldValue('projectArea')}</Descriptions.Item>
            <Descriptions.Item label="工程总造价">{form.getFieldValue('projectConstructionCost')}</Descriptions.Item>
            <Descriptions.Item label="施工图合同额">{form.getFieldValue('projectContractValue')}</Descriptions.Item>
            <Descriptions.Item label="下发产值">
              <Typography.Text strong style={{fontSize: '1.2em'}}>
                {form.getFieldValue('calculatedEmployeePayout')}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        </Drawer>
      </Affix>

      <Divider />

      <div ref={formWrapperRef}>
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
                <Select 
                  disabled={projectPayout?.contract_payment_payout_started ? true : false}
                  onChange={handleProjectTypeSelectChange} 
                  showSearch={projectTypes.length > 10}
                  optionFilterProp="label"
                  options = {projectTypes.map((option) => (
                    {
                      key: option.id,
                      value: option.id,
                      label: option.name
                    }
                  ))}
                  virtual={false}
                  popupMatchSelectWidth={false}
                >
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
                <Select disabled={projectPayout?.contract_payment_payout_started ? true : false}>
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
                <Select
                  disabled={projectPayout?.contract_payment_payout_started ? true : false}
                  options={departmentPayoutRatioRelatedToProjectClassId.map((option) => {
                    const pra = projectRateAdjustmentClasses.find(
                      (value) => value.id === option.project_rate_adjustment_class_id
                    );
                    return {
                      key: pra?.id,
                      value: pra?.id,
                      label: pra?.name
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设计质量系数" name="qualityRatioClass" rules={[{ required: true }]}>
                <Select disabled={projectPayout?.contract_payment_payout_started ? true : false}>
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
                <Select
                  disabled={projectPayout?.contract_payment_payout_started ? true : false}
                  showSearch
                  virtual={false}
                  popupMatchSelectWidth={false}
                  optionFilterProp="label"
                  options={buildingStructureTypes.map((option) => (
                    {
                      key: option.id,
                      value: option.id,
                      label: option.name
                    }
                  ))}
                  >
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
            <DecimalInput onChange={calculateIssuedValue} />
          </Form.Item>

          <Form.Item label="下发产值(元)" required>
            <Collapse 
              activeKey={isPanelOpen ? ["1"] : []}
              items={[{
                key:'1',
                label: (
                  <Form.Item label="下发产值(元)" name="calculatedEmployeePayout" noStyle rules={[{ required: true }]}>
                    <Input
                      disabled={projectPayout?.contract_payment_payout_started ? true : false}
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
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
                          min={10}
                          max={50}
                          step={0.1}
                          onChange={handleSlideronChange}
                          value={typeof silderValue === "number" ? silderValue : 0}
                          tooltip={{
                            formatter: (value) => `${value}%`,
                          }}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          style={{ margin: "0 16px" }}
                          value={silderValue}
                          onChange={handleSlideronChange}
                          formatter={(value) => `${Number(value).toFixed(2)}%`}
                        />
                      </Col>
                    </Row>
                  </div>
                ),
                showArrow:false,
              }]}
            >
            </Collapse>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
                {project ? "更新项目" : "提交项目"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Divider/>
      {project ? (
        <>
          <PayoutTable 
            key={projectKey} 
            project={project} 
            existing_project_payout={projectPayout}
          />
          <Divider />
        </>
      ) : null}

    </div>
  );
};

