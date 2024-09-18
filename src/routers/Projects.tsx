import { Button, Table, TableProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { ProjectTaskTypePublicOut, ProjectPublicOut, ProjectsData, ProjectsPublicOut, ProjectsService, ProjectTaskTypesPublicOut, BuildingStructureTypePublicOut, BuildingStructureTypesService, BuildingStructureTypesPublicOut, QualityRatioClassPublicOut, QualityRatioClassesPublicOut, QualityRatioClassesService, ProjectTypePublicOut, ProjectClassesService, ProjectClassesPublicOut, ProjectClassPublicOut, ProjectTaskTypesService, ProjectTypesPublicOut, ProjectTypesService } from '../client'
import { GetColumnNames } from '../helper'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
// type ProjectFullDetail = Omit<ProjectPublicOut, 'project_type_id', 'project_task_type_id'> & {
    
// 	project_task_types: Array<ProjectTaskTypePublicOut>;
// };
export const Projects = () => {
    const {user} = useAuth()
    const navigate = useNavigate();

    const [projects, setProjects] = useState<ProjectPublicOut[]>([])
    const [buildingStructureType, setBuildingStructureType] = useState<BuildingStructureTypePublicOut[]>([])
    const [qualityRatioClass, setQualityRatioClass] = useState<QualityRatioClassPublicOut[]>([])
    const [projectType, setProjectType] = useState<ProjectTypePublicOut[]>([])
    const [projectTaskType, setPProjectTaskType] = useState<ProjectTaskTypePublicOut[]>([])

    const [loading, setLoading] = useState<boolean>(false);
    const handleLoadingChange = (enable: boolean) => {
        setLoading(enable);
    };
    
    const getProjectPublicOutColumn = GetColumnNames<ProjectPublicOut>();
    //or use 
    //const getProjectPublicOutColumn = <T,> (name: keyof T)=> name //usage getProjectPublicOutColumn<ProjectPublicOut>('building_structure_type_id')
    
    const columns = [
        {
            title: 'ID', dataIndex: getProjectPublicOutColumn('id'),  
        },
        {
            title: '项目年度', dataIndex: getProjectPublicOutColumn('project_year'),  
        },
        {
            title: '项目工号', dataIndex: getProjectPublicOutColumn('project_code'), 
        },
        {
            title: '项目名称', dataIndex: getProjectPublicOutColumn('name'),
        },
        {
            title: '产值录入状态', dataIndex: getProjectPublicOutColumn('name'),
        },
        {
            title: '民用建筑类别', dataIndex: getProjectPublicOutColumn('project_task_type_id'), render:(id: number)=>getValueFromListByID(id, projectTaskType, 'name'),
        },
        {
            title: '设计质量系数', dataIndex: getProjectPublicOutColumn('quality_ratio_class_id'), render:(id: number)=>getValueFromListByID(id, qualityRatioClass, 'name'),
        },
        {
            title: '项目总造价',dataIndex: getProjectPublicOutColumn('project_construction_cost'),
        },
        {
            title: '施工图合同款', dataIndex: getProjectPublicOutColumn('project_contract_value'), 
        },
        {
            title: '施工图产值(元)',dataIndex: getProjectPublicOutColumn('project_deliverable_production_value'),
        },
        {
            title: '下发产值(元)',dataIndex: getProjectPublicOutColumn('calculated_employee_payout'),
        },
        {
            title: '项目录入时间',dataIndex: getProjectPublicOutColumn('date_added'),
        },
        {
            title: '项目修改时间',dataIndex: getProjectPublicOutColumn('date_modified'),
        },
        {
            title: '产值计算时间',dataIndex: getProjectPublicOutColumn('project_construction_cost'),//这个不知道
        },
        {
            title: '工程级别',dataIndex: getProjectPublicOutColumn('building_structure_type_id'), render:(id: number)=>getValueFromListByID(id, buildingStructureType, 'name'),
        },
        {
            title: '工程面积(平方米)',dataIndex: getProjectPublicOutColumn('project_area'),
        },
        {
            title: '工程类别',dataIndex: getProjectPublicOutColumn('project_type_id'), render:(id: number)=>getValueFromListByID(id, projectType, 'name'),
        },
        user?.is_superuser ? 
        {
            title: '操作', width: '10%',key: 'action',
            render: (row:any) => 
            {
            return (
            <span>
                <Typography.Link onClick={() => handleOpenDetail(row)} style={{ marginInlineEnd: 8 }}>
                    详情
                </Typography.Link>
                
            </span>
            ) 
        },
        }: {},
    ]
    const handleOpenDetail=(data:any)=>{
        console.log(data);
        
    }
    const getValueFromListByID =<T,>(id:number, list: T[], itemInList: keyof T) =>{
        const item = list.find(item => item[itemInList] === id);
        return item ? String(item[itemInList]) : 'Unknown';
    }

    const getNameById = <T,>(
        id: T[keyof T],
        list: T[],
        idCol: keyof T,
        nameCol: keyof T
      ): string => {
        const item = list.find(item => item[idCol] === id);
        return item ? String(item[nameCol]) : 'Unknown';
      };
    const fetchProjects = async () => {
        try {
            //show loading spinner on table
            handleLoadingChange(true)
            
            const [resProjects, resBuildingStructureType, resQualityRatioClass, resProjectType, resProjectTaskType]:[ProjectsPublicOut, BuildingStructureTypesPublicOut, QualityRatioClassesPublicOut, ProjectTypesPublicOut, ProjectTaskTypesPublicOut] = await Promise.all([
                ProjectsService.getAndFilterProjects(),
                BuildingStructureTypesService.readBuildingStructureTypes(),
                QualityRatioClassesService.readQualityRatioClasses(),
                ProjectTypesService.readProjectTypes(),
                ProjectTaskTypesService.readProjectTaskTypes(),
            ]);
            console.log(resProjects.data);
            
            
            setProjects(resProjects.data)
            setBuildingStructureType(resBuildingStructureType.data)
            setQualityRatioClass(resQualityRatioClass.data)
            setProjectType(resProjectType.data)
            setPProjectTaskType(resProjectTaskType.data)
            
        }catch(e){
            // Stop the loading spinner on table once the data is fetched
            console.error('Error fetching data:', e);
        }finally {
            // Stop the loading spinner on table once the data is fetched
            handleLoadingChange(false); 
        }
    }
    const handleTableChange: TableProps<ProjectPublicOut>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const showProjectDetail = () => {
        navigate('/projects-detail')
       
    }
    useEffect(()=>{
        fetchProjects()
    },[])

    return (
        <div>
            {user?.is_superuser &&
            <Button onClick={showProjectDetail} type="primary" style={{ marginBottom: 16 }}>
                添加
            </Button>
            }
            <Table   
                rowKey='id'
                loading={loading}
                columns={columns}
                dataSource={projects}
                onChange={handleTableChange} // Trigger data fetching when pagination changes
                pagination={{pageSize:13}}
                scroll={{ x:500 }}
            />
        </div>
    )
}
