import { Button, Table, TableProps, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import {PlusOutlined} from '@ant-design/icons';
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
    const [tableHeight, setTableHeight] = useState(400); // Default height
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [projects, setProjects] = useState<ProjectPublicOut[]>([])
    const [buildingStructureType, setBuildingStructureType] = useState<BuildingStructureTypePublicOut[]>([])
    const [qualityRatioClass, setQualityRatioClass] = useState<QualityRatioClassPublicOut[]>([])
    const [projectType, setProjectType] = useState<ProjectTypePublicOut[]>([])
    const [projectTaskType, setPProjectTaskType] = useState<ProjectTaskTypePublicOut[]>([])

    const [loading, setLoading] = useState<boolean>(false);
    const handleLoadingChange = (enable: boolean) => {
        setLoading(enable);
    };
    const updateTableHeight = () => {
        if (scrollContainerRef.current) {
            const windowHeight = window.innerHeight;
            const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
            const newHeight = windowHeight - containerTop - 20; // 20px for some bottom margin
            setTableHeight(newHeight);
        }
    };
    const getProjectPublicOutColumn = GetColumnNames<ProjectPublicOut>();
    //or use 
    //const getProjectPublicOutColumn = <T,> (name: keyof T)=> name //usage getProjectPublicOutColumn<ProjectPublicOut>('building_structure_type_id')
    
    const columns = [
        {
            title: 'ID', dataIndex: getProjectPublicOutColumn('id'), width: 50,
        },
        {
            title: '项目年度', dataIndex: getProjectPublicOutColumn('project_year'), width: 100,
        },
        {
            title: '项目工号', dataIndex: getProjectPublicOutColumn('project_code'), width: 100,
        },
        {
            title: '项目名称', dataIndex: getProjectPublicOutColumn('name'), width: 200,
        },
        {
            title: '民用建筑类别', dataIndex: getProjectPublicOutColumn('project_task_type_id'), render:(id: number)=>getValueFromListByID(id, projectTaskType, 'name'),width: 120,
        },
        {
            title: '设计质量系数', dataIndex: getProjectPublicOutColumn('quality_ratio_class_id'), render:(id: number)=>getValueFromListByID(id, qualityRatioClass, 'name'),width: 120,
        },
        {
            title: '项目总造价',dataIndex: getProjectPublicOutColumn('project_construction_cost'),width: 105,
        },
        {
            title: '施工图合同款', dataIndex: getProjectPublicOutColumn('project_contract_value'), width: 120,
        },
        {
            title: '施工图产值(元)',dataIndex: getProjectPublicOutColumn('project_deliverable_production_value'),width: 130,
        },
        {
            title: '下发产值(元)',dataIndex: getProjectPublicOutColumn('calculated_employee_payout'),width: 120,
        },
        {
            title: '项目录入时间',dataIndex: getProjectPublicOutColumn('date_added'),width: 120,
            render:(date: string)=> convertDateToYYYYMMDDHM(date)
        },
        {
            title: '项目修改时间',dataIndex: getProjectPublicOutColumn('date_modified'),width: 120,
            render:(date: string)=> convertDateToYYYYMMDDHM(date)

        },
        {
            title: '产值计算时间',dataIndex: getProjectPublicOutColumn('project_construction_cost'), width: 120,//这个不知道
        },
        {
            title: '工程级别',dataIndex: getProjectPublicOutColumn('building_structure_type_id'), render:(id: number)=>getValueFromListByID(id, buildingStructureType, 'name'),width: 100,
        },
        {
            title: '工程面积(平方米)',dataIndex: getProjectPublicOutColumn('project_area'),width: 140,
        },
        {
            title: '工程类别',dataIndex: getProjectPublicOutColumn('project_type_id'), render:(id: number)=>getValueFromListByID(id, projectType, 'name'),width: 100,
        },
        user?.is_superuser ? 
        {
            title: '操作', key: 'action',width: 100, fixed:'right',
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
    const convertDateToYYYYMMDDHM = (dateStr: string) => {
        const date = new Date(dateStr);
        console.log(date);
        
        const formattedDate = date.toLocaleDateString('en-CA', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        // Get hours and minutes
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}`;
    };
    useEffect(()=>{
        fetchProjects()
        updateTableHeight(); // Initial height calculation
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
    },[])

    return (
        <div ref={scrollContainerRef}>
            {user?.is_superuser &&
            <Button onClick={showProjectDetail} type="primary" style={loading || projects.length===0 ? { marginBottom: 16} : { marginBottom: 16,position: 'absolute', zIndex:1}}>
                <PlusOutlined />
                添加
            </Button>
            }
            <Table   
                rowKey='id'
                loading={loading}
                columns={columns}
                dataSource={projects}
                onChange={handleTableChange} // Trigger data fetching when pagination changes
                pagination={{pageSize:13, position:['topRight']}}
                scroll={{ x: 'max-content'}}
                style={{ height: '100%' }}
            />
        </div>
    )
}
