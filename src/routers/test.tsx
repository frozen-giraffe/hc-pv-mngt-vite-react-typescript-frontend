
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

// Define types for the API responses
type Employee = {
  id: number;
  name: string;
  gov_id: string | null;
  gender: string | null;
  department_id: number;
  work_location_id: number;
  employee_title_id: number;
  professional_title_id: number;
  employ_status_id: number;
  birth_date: string | null;
  initial: string;
  pinyin: string;
};

type Department = {
  id: number;
  name: string;
};

type ProfessionalTitle = {
  id: number;
  name: string;
};

type WorkLocation = {
  id: number;
  name: string;
};

type EmployeeTitle = {
  id: number;
  employee_name: string;
};

type EmployStatus = {
  id: number;
  name: string;
};

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [professionalTitles, setProfessionalTitles] = useState<ProfessionalTitle[]>([]);
  const [workLocations, setWorkLocations] = useState<WorkLocation[]>([]);
  const [employeeTitles, setEmployeeTitles] = useState<EmployeeTitle[]>([]);
  const [employStatuses, setEmployStatuses] = useState<EmployStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (fetching data logic remains the same)
  }, []);

  const getNameById = <T,>(
    id: T[keyof T],
    list: T[],
    idCol: keyof T,
    nameCol: keyof T
  ): string => {
    const item = list.find(item => item[idCol] === id);
    return item ? String(item[nameCol]) : 'Unknown';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department',
      render: (departmentId: number) => getNameById(departmentId, departments, Department['id'], Department['name']),
    },
    {
      title: 'Work Location',
      dataIndex: 'work_location_id',
      key: 'workLocation',
      render: (locationId: number) => getNameById(locationId, workLocations, WorkLocation['id'], WorkLocation['name']),
    },
    {
      title: 'Employee Title',
      dataIndex: 'employee_title_id',
      key: 'employeeTitle',
      render: (titleId: number) => getNameById(titleId, employeeTitles, EmployeeTitle['id'], EmployeeTitle['employee_name']),
    },
    {
      title: 'Professional Title',
      dataIndex: 'professional_title_id',
      key: 'professionalTitle',
      render: (titleId: number) => getNameById(titleId, professionalTitles, ProfessionalTitle['id'], ProfessionalTitle['name']),
    },
    {
      title: 'Employment Status',
      dataIndex: 'employ_status_id',
      key: 'employStatus',
      render: (statusId: number) => getNameById(statusId, employStatuses, EmployStatus['id'], EmployStatus['name']),
    },
    {
      title: 'Birth Date',
      dataIndex: 'birth_date',
      key: 'birthDate',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  return (
    <Table
      dataSource={employees}
      columns={columns}
      rowKey="id"
      loading={loading}
    />
  );
};

export default EmployeeTable;
