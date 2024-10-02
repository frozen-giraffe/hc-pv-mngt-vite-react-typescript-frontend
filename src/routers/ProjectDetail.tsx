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

//下发产值表相关数据
interface DataType {
    key: string;
    name: string;
    age: number;
    tel: string;
    phone: number;
    address: string;
    leftCell?: string;
    rightTopCell?: string;
rightBottomCell?:string;
  }
  
  // In the fifth row, other columns are merged into first column
  // by setting it's colSpan to be 0
  const sharedOnCell = (_: DataType, index?: number) => {
    if (index === 1) {
      return { colSpan: 0 };
    }
  
    return {};
  };
  
  const columnsTable: TableProps<DataType>['columns'] = [
    {
      title: '专业分类',
      dataIndex: 'key',
      rowScope: 'row',
      width:100,
      render: (text: string, record: any, index:number) => {
        const obj = {
          children: (
                  <div style={{ display: "flex" }}>
                    {/* Left cell (建筑) */}
                    <div style={{ width: "50px", display:'flex',justifyContent:'center', alignItems:'center',borderRight: "1px solid #f0f0f0" }}>
                    {record.leftCell}
                    </div>
                    {/* Right cell (split into top and bottom) */}
                    <div style={{ width: "100px", paddingLeft: "10px" }}>
                      <div style={{ borderBottom: "1px solid #f0f0f0", display:'flex',justifyContent:'center', alignItems:'center' }}>
                      {record.rightTopCell}
                      </div>
                      <div style={{display:'flex',justifyContent:'center', alignItems:'center'}}>{record.rightBottomCell}</div>
                    </div>
                  </div>
                ),
          props: {} as any,
        };

        // Merge the cells for every two rows
        if (index % 2 === 0) {
          obj.props.rowSpan = 2; // Merge two rows
        } else {
          obj.props.rowSpan = 0; // Hide the second row
        }

        return obj;
      },
      
    },
    {
      title:'施工图设计',
      dataIndex:'施工图设计',
      children:[
        {
          title:'专业负责人'
        },
        {
          title:'专业负责人助理'
        },
        {
          title:'设计',
        },
        {
          title:'施工图',
        },
        {
          title:'后期服务',
        },
        {
          title:'校对',
        },
        {
          title:'审核',
        },
        {
          title:'审定',
        },
        {
          title:'小计',
          render: (text: string, record: any, index:number) => {
            const obj = {
              children: text,
              props: {} as any,
            };
    
            // Merge the cells for every two rows
            if (index % 2 === 0) {
              obj.props.rowSpan = 2; // Merge two rows
            } else {
              obj.props.rowSpan = 0; // Hide the second row
            }
    
            return obj;
          },
        },
      ]
    },
  ];
  
  const tableData: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      age: 32,
      tel: '0571-22098909',
      phone: 18889898989,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      tel: '0571-22098333',
      phone: 18889898888,
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      age: 32,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'London No. 2 Lake Park',
    },
    {
      key: '5',
      name: 'Jake White',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park',
    },
    {
      key: '6',
      name: 'Jake White',
      leftCell: "建筑", // Left side of the first cell
      rightTopCell: "设计人", // Right side (top)
      rightBottomCell: "产值", // Right side (bottom)
      age: 18,
      tel: '0575-22098909',
      phone: 18900010002,
      address: 'Dublin No. 2 Lake Park',
    },
  ];
  

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
  const [prodValCalcRatios, setProdValCalcRatios] = useState<
    ProdValueCalcRatioPublicOut[]
  >([]);
  const [defaultProdValCalcRatio, setDefaultProdValCalcRatio] =
    useState<ProdValueCalcRatioPublicOut>();
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
      setProdValCalcRatios(resProdValCalcRatios.data);
      setDefaultProdValCalcRatio(redDefaultProdValCalcRatios);

      //set default option highlighted
      setSegmentedValue(redDefaultProdValCalcRatios.ratio.toString())
      //set default silder position
      setSilderValue(redDefaultProdValCalcRatios.ratio*100)
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

  const tableData1 = [
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
        const res = await ProjectsService.createProject({requestBody:{
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
        if(res){
            successMessage('创建成功')
        }else{
            errorMessage('创建失败')
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
      <h2 style={{ marginTop: 0 }}>新建工程</h2>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
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

        <Typography.Title level={5}>施工细节</Typography.Title>
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
          <Collapse activeKey={isPanelOpen ? ["1"] : []}>
            <Panel
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
            </Panel>
          </Collapse>
        </Form.Item>
        <Row justify='end'>
            <Form.Item>
            <Button type="primary" htmlType="submit">
                提交
            </Button>
            </Form.Item>
        </Row>
      </Form>

      <Divider />
      {/* 下发产值表 */}
      <Form>
        <Table<DataType> columns={columnsTable} dataSource={tableData} bordered />
      </Form>
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
