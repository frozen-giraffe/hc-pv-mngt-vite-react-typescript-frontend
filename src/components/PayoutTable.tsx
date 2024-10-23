import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import { Button, Col, Divider, Form, Input, message, Row, Select, Space, Table, Tag, Tooltip, Typography, notification, Skeleton } from "antd";
import { DepartmentPayoutRatiosService, DepartmentPublicOut, DepartmentsService, EmployeePublicOut, EmployeeService, JobPayoutRatioProfilePublicOut, JobPayoutRatioProfilesService, WorkLocationPublicOut, WorkLocationsService, ProjectPayoutPublicOut, ProjectPublicOut, ProjectPayoutCreateIn, ProjectPayoutsService, ProjectPayoutUpdateIn, ProjectPayoutUpdateInSchema } from "../client";
import type { BaseSelectRef } from 'rc-select'; // Import the correct type
import { InfoCircleOutlined } from '@ant-design/icons';
import './PayoutTable.css'
import PayoutInput from "./PayoutInput";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);
const employeeCache: { [key: string]: EmployeePublicOut } = {};
const { Text } = Typography;

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  text: string;
  category: string;
}

interface EditableRowProps {
  index: number;
  form: any;
}

interface DataType {
  key:string
  category: string;
  text: string;
  pm: string | number
  pm_assistant: string | number
  designer: string | number
  drafter: string | number
  post_service: string | number
  proofreader: string | number
  reviewer: string | number
  approver: string | number
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  rowIndex: number;
  columnIndex: number;
  departments: DepartmentPublicOut[];
  workLocations: WorkLocationPublicOut[];
  form:any
  handleSave: (record: Item) => void;
  existing_project_payout: ProjectPayoutPublicOut | null;
}

// Add this custom validator function
const validateEmployee = (_, value, payoutValue) => {
  if (Number(payoutValue) !== 0 && (value === undefined || value === '')) {
    return Promise.reject(new Error('员工不能为空'));
  }
  return Promise.resolve();
};

const projectPayoutToDataSource = (project_payout: ProjectPayoutPublicOut | null) => {
  return([
    {
      key:'1',
      category: '建筑',
      text: '设计人',
      pm: project_payout?.arch_pm_id !== null ? project_payout?.arch_pm_id : '',
      pm_assistant: project_payout?.arch_pm_assistant_id !== null ? project_payout?.arch_pm_assistant_id : '',
      designer: project_payout?.arch_designer_id !== null ? project_payout?.arch_designer_id : '',
      drafter: project_payout?.arch_drafter_id !== null ? project_payout?.arch_drafter_id : '',
      post_service: project_payout?.arch_design_post_service_id !== null ? project_payout?.arch_design_post_service_id : '',
      proofreader: project_payout?.arch_proofreader_id !== null ? project_payout?.arch_proofreader_id : '',
      reviewer: project_payout?.arch_reviewer_id !== null ? project_payout?.arch_reviewer_id : '',
      approver: project_payout?.arch_approver_id !== null ? project_payout?.arch_approver_id : '',
    },
    {
      key:'2',
      category: '建筑',
      text: '产值',
      pm: project_payout?.arch_pm_payout !== null ? project_payout?.arch_pm_payout : '',
      pm_assistant: project_payout?.arch_pm_assistant_payout !== null ? project_payout?.arch_pm_assistant_payout : '',
      designer: project_payout?.arch_designer_payout !== null ? project_payout?.arch_designer_payout : '',
      drafter: project_payout?.arch_drafter_payout !== null ? project_payout?.arch_drafter_payout : '',
      post_service: project_payout?.arch_design_post_service_payout !== null ? project_payout?.arch_design_post_service_payout : '',
      proofreader: project_payout?.arch_proofreader_payout !== null ? project_payout?.arch_proofreader_payout : '',
      reviewer: project_payout?.arch_reviewer_payout !== null ? project_payout?.arch_reviewer_payout : '',
      approver: project_payout?.arch_approver_payout !== null ? project_payout?.arch_approver_payout : '',
    },
    {
      key:'3',
      category: '结构',
      text: '设计人',
      pm: project_payout?.struct_pm_id !== null ? project_payout?.struct_pm_id : '',
      pm_assistant: project_payout?.struct_pm_assistant_id !== null ? project_payout?.struct_pm_assistant_id : '',
      designer: project_payout?.struct_designer_id !== null ? project_payout?.struct_designer_id : '',
      drafter: project_payout?.struct_drafter_id !== null ? project_payout?.struct_drafter_id : '',
      post_service: project_payout?.struct_design_post_service_id !== null ? project_payout?.struct_design_post_service_id : '',
      proofreader: project_payout?.struct_proofreader_id !== null ? project_payout?.struct_proofreader_id : '',
      reviewer: project_payout?.struct_reviewer_id !== null ? project_payout?.struct_reviewer_id : '',
      approver: project_payout?.struct_approver_id !== null ? project_payout?.struct_approver_id : '',
    },
    {
      key:'4',
      category: '结构',
      text: '产值',
      pm: project_payout?.struct_pm_payout !== null ? project_payout?.struct_pm_payout : '',
      pm_assistant: project_payout?.struct_pm_assistant_payout !== null ? project_payout?.struct_pm_assistant_payout : '',
      designer: project_payout?.struct_designer_payout !== null ? project_payout?.struct_designer_payout : '',
      drafter: project_payout?.struct_drafter_payout !== null ? project_payout?.struct_drafter_payout : '',
      post_service: project_payout?.struct_design_post_service_payout !== null ? project_payout?.struct_design_post_service_payout : '',
      proofreader: project_payout?.struct_proofreader_payout !== null ? project_payout?.struct_proofreader_payout : '',
      reviewer: project_payout?.struct_reviewer_payout !== null ? project_payout?.struct_reviewer_payout : '',
      approver: project_payout?.struct_approver_payout !== null ? project_payout?.struct_approver_payout : '',
    },
    {
      key:'5',
      category: '给排水',
      text: '设计人',
      pm: project_payout?.plumbing_pm_id !== null ? project_payout?.plumbing_pm_id : '',
      pm_assistant: project_payout?.plumbing_pm_assistant_id !== null ? project_payout?.plumbing_pm_assistant_id : '',
      designer: project_payout?.plumbing_designer_id !== null ? project_payout?.plumbing_designer_id : '',
      drafter: project_payout?.plumbing_drafter_id !== null ? project_payout?.plumbing_drafter_id : '',
      post_service: project_payout?.plumbing_design_post_service_id !== null ? project_payout?.plumbing_design_post_service_id : '',
      proofreader: project_payout?.plumbing_proofreader_id !== null ? project_payout?.plumbing_proofreader_id : '',
      reviewer: project_payout?.plumbing_reviewer_id !== null ? project_payout?.plumbing_reviewer_id : '',
      approver: project_payout?.plumbing_approver_id !== null ? project_payout?.plumbing_approver_id : '',
    },
    {
      key:'6',
      category: '给排水',
      text: '产值',
      pm: project_payout?.plumbing_pm_payout !== null ? project_payout?.plumbing_pm_payout : '',
      pm_assistant: project_payout?.plumbing_pm_assistant_payout !== null ? project_payout?.plumbing_pm_assistant_payout : '',
      designer: project_payout?.plumbing_designer_payout !== null ? project_payout?.plumbing_designer_payout : '',
      drafter: project_payout?.plumbing_drafter_payout !== null ? project_payout?.plumbing_drafter_payout : '',
      post_service: project_payout?.plumbing_design_post_service_payout !== null ? project_payout?.plumbing_design_post_service_payout : '',
      proofreader: project_payout?.plumbing_proofreader_payout !== null ? project_payout?.plumbing_proofreader_payout : '',
      reviewer: project_payout?.plumbing_reviewer_payout !== null ? project_payout?.plumbing_reviewer_payout : '',
      approver: project_payout?.plumbing_approver_payout !== null ? project_payout?.plumbing_approver_payout : '',
    },
    {
      key:'7',
      category: '暖通',
      text: '设计人',
      pm: project_payout?.hvac_pm_id !== null ? project_payout?.hvac_pm_id : '',
      pm_assistant: project_payout?.hvac_pm_assistant_id !== null ? project_payout?.hvac_pm_assistant_id : '',
      designer: project_payout?.hvac_designer_id !== null ? project_payout?.hvac_designer_id : '',
      drafter: project_payout?.hvac_drafter_id !== null ? project_payout?.hvac_drafter_id : '',
      post_service: project_payout?.hvac_design_post_service_id !== null ? project_payout?.hvac_design_post_service_id : '',
      proofreader: project_payout?.hvac_proofreader_id !== null ? project_payout?.hvac_proofreader_id : '',
      reviewer: project_payout?.hvac_reviewer_id !== null ? project_payout?.hvac_reviewer_id : '',
      approver: project_payout?.hvac_approver_id !== null ? project_payout?.hvac_approver_id : '',
    },
    {
      key:'8',
      category: '暖通',
      text: '产值',
      pm: project_payout?.hvac_pm_payout !== null ? project_payout?.hvac_pm_payout : '',
      pm_assistant: project_payout?.hvac_pm_assistant_payout !== null ? project_payout?.hvac_pm_assistant_payout : '',
      designer: project_payout?.hvac_designer_payout !== null ? project_payout?.hvac_designer_payout : '',
      drafter: project_payout?.hvac_drafter_payout !== null ? project_payout?.hvac_drafter_payout : '',
      post_service: project_payout?.hvac_design_post_service_payout !== null ? project_payout?.hvac_design_post_service_payout : '',
      proofreader: project_payout?.hvac_proofreader_payout !== null ? project_payout?.hvac_proofreader_payout : '',
      reviewer: project_payout?.hvac_reviewer_payout !== null ? project_payout?.hvac_reviewer_payout : '',
      approver: project_payout?.hvac_approver_payout !== null ? project_payout?.hvac_approver_payout : '',
    },
    {
      key:'9',
      category: '强电',
      text: '设计人',
      pm: project_payout?.electrical_pm_id !== null ? project_payout?.electrical_pm_id : '',
      pm_assistant: project_payout?.electrical_pm_assistant_id !== null ? project_payout?.electrical_pm_assistant_id : '',
      designer: project_payout?.electrical_designer_id !== null ? project_payout?.electrical_designer_id : '',
      drafter: project_payout?.electrical_drafter_id !== null ? project_payout?.electrical_drafter_id : '',
      post_service: project_payout?.electrical_design_post_service_id !== null ? project_payout?.electrical_design_post_service_id : '',
      proofreader: project_payout?.electrical_proofreader_id !== null ? project_payout?.electrical_proofreader_id : '',
      reviewer: project_payout?.electrical_reviewer_id !== null ? project_payout?.electrical_reviewer_id : '',
      approver: project_payout?.electrical_approver_id !== null ? project_payout?.electrical_approver_id : '',
    },
    {
      key:'10',
      category: '强电',
      text: '产值',
      pm: project_payout?.electrical_pm_payout !== null ? project_payout?.electrical_pm_payout : '',
      pm_assistant: project_payout?.electrical_pm_assistant_payout !== null ? project_payout?.electrical_pm_assistant_payout : '',
      designer: project_payout?.electrical_designer_payout !== null ? project_payout?.electrical_designer_payout : '',
      drafter: project_payout?.electrical_drafter_payout !== null ? project_payout?.electrical_drafter_payout : '',
      post_service: project_payout?.electrical_design_post_service_payout !== null ? project_payout?.electrical_design_post_service_payout : '',
      proofreader: project_payout?.electrical_proofreader_payout !== null ? project_payout?.electrical_proofreader_payout : '',
      reviewer: project_payout?.electrical_reviewer_payout !== null ? project_payout?.electrical_reviewer_payout : '',
      approver: project_payout?.electrical_approver_payout !== null ? project_payout?.electrical_approver_payout : '',
    },
    {
      key:'11',
      category: '弱电',
      text: '设计人',
      pm: project_payout?.low_voltage_pm_id !== null ? project_payout?.low_voltage_pm_id : '',
      pm_assistant: project_payout?.low_voltage_pm_assistant_id !== null ? project_payout?.low_voltage_pm_assistant_id : '',
      designer: project_payout?.low_voltage_designer_id !== null ? project_payout?.low_voltage_designer_id : '',
      drafter: project_payout?.low_voltage_drafter_id !== null ? project_payout?.low_voltage_drafter_id : '',
      post_service: project_payout?.low_voltage_design_post_service_id !== null ? project_payout?.low_voltage_design_post_service_id : '',
      proofreader: project_payout?.low_voltage_proofreader_id !== null ? project_payout?.low_voltage_proofreader_id : '',
      reviewer: project_payout?.low_voltage_reviewer_id !== null ? project_payout?.low_voltage_reviewer_id : '',
      approver: project_payout?.low_voltage_approver_id !== null ? project_payout?.low_voltage_approver_id : '',
    },
    {
      key:'12',
      category: '弱电',
      text: '产值',
      pm: project_payout?.low_voltage_pm_payout !== null ? project_payout?.low_voltage_pm_payout : '',
      pm_assistant: project_payout?.low_voltage_pm_assistant_payout !== null ? project_payout?.low_voltage_pm_assistant_payout : '',
      designer: project_payout?.low_voltage_designer_payout !== null ? project_payout?.low_voltage_designer_payout : '',
      drafter: project_payout?.low_voltage_drafter_payout !== null ? project_payout?.low_voltage_drafter_payout : '',
      post_service: project_payout?.low_voltage_design_post_service_payout !== null ? project_payout?.low_voltage_design_post_service_payout : '',
      proofreader: project_payout?.low_voltage_proofreader_payout !== null ? project_payout?.low_voltage_proofreader_payout : '',
      reviewer: project_payout?.low_voltage_reviewer_payout !== null ? project_payout?.low_voltage_reviewer_payout : '',
      approver: project_payout?.low_voltage_approver_payout !== null ? project_payout?.low_voltage_approver_payout : '',
    },
  ])
}

const projectPayoutToFormData = (project_payout: ProjectPayoutPublicOut | null) => {
  return {
    pm: project_payout?.pm_id !== null ? project_payout?.pm_id : '',
    pmPayout: project_payout?.pm_payout !== null ? project_payout?.pm_payout : '',
    pmAssistant: project_payout?.pm_assistant_id !== null ? project_payout?.pm_assistant_id : '',
    pmAssistantPayout: project_payout?.pm_assistant_payout !== null ? project_payout?.pm_assistant_payout : '',
    建筑设计人:{
      pm: project_payout?.arch_pm_id !== null ? project_payout?.arch_pm_id : '',
      pm_assistant: project_payout?.arch_pm_assistant_id !== null ? project_payout?.arch_pm_assistant_id : '',
      designer: project_payout?.arch_designer_id !== null ? project_payout?.arch_designer_id : '',
      drafter: project_payout?.arch_drafter_id !== null ? project_payout?.arch_drafter_id : '',
      post_service: project_payout?.arch_design_post_service_id !== null ? project_payout?.arch_design_post_service_id : '',
      proofreader: project_payout?.arch_proofreader_id !== null ? project_payout?.arch_proofreader_id : '',
      reviewer: project_payout?.arch_reviewer_id !== null ? project_payout?.arch_reviewer_id : '',
      approver: project_payout?.arch_approver_id !== null ? project_payout?.arch_approver_id : '',
    },
    建筑产值:{
      pm: project_payout?.arch_pm_payout !== null ? project_payout?.arch_pm_payout : '',
      pm_assistant: project_payout?.arch_pm_assistant_payout !== null ? project_payout?.arch_pm_assistant_payout : '',
      designer: project_payout?.arch_designer_payout !== null ? project_payout?.arch_designer_payout : '',
      drafter: project_payout?.arch_drafter_payout !== null ? project_payout?.arch_drafter_payout : '',
      post_service: project_payout?.arch_design_post_service_payout !== null ? project_payout?.arch_design_post_service_payout : '',
      proofreader: project_payout?.arch_proofreader_payout !== null ? project_payout?.arch_proofreader_payout : '',
      reviewer: project_payout?.arch_reviewer_payout !== null ? project_payout?.arch_reviewer_payout : '',
      approver: project_payout?.arch_approver_payout !== null ? project_payout?.arch_approver_payout : '',
    },
    结构设计人:{
      pm: project_payout?.struct_pm_id !== null ? project_payout?.struct_pm_id : '',
      pm_assistant: project_payout?.struct_pm_assistant_id !== null ? project_payout?.struct_pm_assistant_id : '',
      designer: project_payout?.struct_designer_id !== null ? project_payout?.struct_designer_id : '',
      drafter: project_payout?.struct_drafter_id !== null ? project_payout?.struct_drafter_id : '',
      post_service: project_payout?.struct_design_post_service_id !== null ? project_payout?.struct_design_post_service_id : '',
      proofreader: project_payout?.struct_proofreader_id !== null ? project_payout?.struct_proofreader_id : '',
      reviewer: project_payout?.struct_reviewer_id !== null ? project_payout?.struct_reviewer_id : '',
      approver: project_payout?.struct_approver_id !== null ? project_payout?.struct_approver_id : '',
    },
    结构产值:{
      pm: project_payout?.struct_pm_payout !== null ? project_payout?.struct_pm_payout : '',
      pm_assistant: project_payout?.struct_pm_assistant_payout !== null ? project_payout?.struct_pm_assistant_payout : '',
      designer: project_payout?.struct_designer_payout !== null ? project_payout?.struct_designer_payout : '',
      drafter: project_payout?.struct_drafter_payout !== null ? project_payout?.struct_drafter_payout : '',
      post_service: project_payout?.struct_design_post_service_payout !== null ? project_payout?.struct_design_post_service_payout : '',
      proofreader: project_payout?.struct_proofreader_payout !== null ? project_payout?.struct_proofreader_payout : '',
      reviewer: project_payout?.struct_reviewer_payout !== null ? project_payout?.struct_reviewer_payout : '',
      approver: project_payout?.struct_approver_payout !== null ? project_payout?.struct_approver_payout : '',
    },
    给排水设计人:{
      pm: project_payout?.plumbing_pm_id !== null ? project_payout?.plumbing_pm_id : '',
      pm_assistant: project_payout?.plumbing_pm_assistant_id !== null ? project_payout?.plumbing_pm_assistant_id : '',
      designer: project_payout?.plumbing_designer_id !== null ? project_payout?.plumbing_designer_id : '',
      drafter: project_payout?.plumbing_drafter_id !== null ? project_payout?.plumbing_drafter_id : '',
      post_service: project_payout?.plumbing_design_post_service_id !== null ? project_payout?.plumbing_design_post_service_id : '',
      proofreader: project_payout?.plumbing_proofreader_id !== null ? project_payout?.plumbing_proofreader_id : '',
      reviewer: project_payout?.plumbing_reviewer_id !== null ? project_payout?.plumbing_reviewer_id : '',
      approver: project_payout?.plumbing_approver_id !== null ? project_payout?.plumbing_approver_id : '',
    },
    给排水产值:{
      pm: project_payout?.plumbing_pm_payout !== null ? project_payout?.plumbing_pm_payout : '',
      pm_assistant: project_payout?.plumbing_pm_assistant_payout !== null ? project_payout?.plumbing_pm_assistant_payout : '',
      designer: project_payout?.plumbing_designer_payout !== null ? project_payout?.plumbing_designer_payout : '',
      drafter: project_payout?.plumbing_drafter_payout !== null ? project_payout?.plumbing_drafter_payout : '',
      post_service: project_payout?.plumbing_design_post_service_payout !== null ? project_payout?.plumbing_design_post_service_payout : '',
      proofreader: project_payout?.plumbing_proofreader_payout !== null ? project_payout?.plumbing_proofreader_payout : '',
      reviewer: project_payout?.plumbing_reviewer_payout !== null ? project_payout?.plumbing_reviewer_payout : '',
      approver: project_payout?.plumbing_approver_payout !== null ? project_payout?.plumbing_approver_payout : '',
    },
    暖通设计人:{
      pm: project_payout?.hvac_pm_id !== null ? project_payout?.hvac_pm_id : '',
      pm_assistant: project_payout?.hvac_pm_assistant_id !== null ? project_payout?.hvac_pm_assistant_id : '',
      designer: project_payout?.hvac_designer_id !== null ? project_payout?.hvac_designer_id : '',
      drafter: project_payout?.hvac_drafter_id !== null ? project_payout?.hvac_drafter_id : '',
      post_service: project_payout?.hvac_design_post_service_id !== null ? project_payout?.hvac_design_post_service_id : '',
      proofreader: project_payout?.hvac_proofreader_id !== null ? project_payout?.hvac_proofreader_id : '',
      reviewer: project_payout?.hvac_reviewer_id !== null ? project_payout?.hvac_reviewer_id : '',
      approver: project_payout?.hvac_approver_id !== null ? project_payout?.hvac_approver_id : '',
    },
    暖通产值:{
      pm: project_payout?.hvac_pm_payout !== null ? project_payout?.hvac_pm_payout : '',
      pm_assistant: project_payout?.hvac_pm_assistant_payout !== null ? project_payout?.hvac_pm_assistant_payout : '',
      designer: project_payout?.hvac_designer_payout !== null ? project_payout?.hvac_designer_payout : '',
      drafter: project_payout?.hvac_drafter_payout !== null ? project_payout?.hvac_drafter_payout : '',
      post_service: project_payout?.hvac_design_post_service_payout !== null ? project_payout?.hvac_design_post_service_payout : '',
      proofreader: project_payout?.hvac_proofreader_payout !== null ? project_payout?.hvac_proofreader_payout : '',
      reviewer: project_payout?.hvac_reviewer_payout !== null ? project_payout?.hvac_reviewer_payout : '',
      approver: project_payout?.hvac_approver_payout !== null ? project_payout?.hvac_approver_payout : '',
    },
    强电设计人:{
      pm: project_payout?.electrical_pm_id !== null ? project_payout?.electrical_pm_id : '',
      pm_assistant: project_payout?.electrical_pm_assistant_id !== null ? project_payout?.electrical_pm_assistant_id : '',
      designer: project_payout?.electrical_designer_id !== null ? project_payout?.electrical_designer_id : '',
      drafter: project_payout?.electrical_drafter_id !== null ? project_payout?.electrical_drafter_id : '',
      post_service: project_payout?.electrical_design_post_service_id !== null ? project_payout?.electrical_design_post_service_id : '',
      proofreader: project_payout?.electrical_proofreader_id !== null ? project_payout?.electrical_proofreader_id : '',
      reviewer: project_payout?.electrical_reviewer_id !== null ? project_payout?.electrical_reviewer_id : '',
      approver: project_payout?.electrical_approver_id !== null ? project_payout?.electrical_approver_id : '',
    },
    强电产值:{
      pm: project_payout?.electrical_pm_payout !== null ? project_payout?.electrical_pm_payout : '',
      pm_assistant: project_payout?.electrical_pm_assistant_payout !== null ? project_payout?.electrical_pm_assistant_payout : '',
      designer: project_payout?.electrical_designer_payout !== null ? project_payout?.electrical_designer_payout : '',
      drafter: project_payout?.electrical_drafter_payout !== null ? project_payout?.electrical_drafter_payout : '',
      post_service: project_payout?.electrical_design_post_service_payout !== null ? project_payout?.electrical_design_post_service_payout : '',
      proofreader: project_payout?.electrical_proofreader_payout !== null ? project_payout?.electrical_proofreader_payout : '',
      reviewer: project_payout?.electrical_reviewer_payout !== null ? project_payout?.electrical_reviewer_payout : '',
      approver: project_payout?.electrical_approver_payout !== null ? project_payout?.electrical_approver_payout : '',
    },
    弱电设计人:{
      pm: project_payout?.low_voltage_pm_id !== null ? project_payout?.low_voltage_pm_id : '',
      pm_assistant: project_payout?.low_voltage_pm_assistant_id !== null ? project_payout?.low_voltage_pm_assistant_id : '',
      designer: project_payout?.low_voltage_designer_id !== null ? project_payout?.low_voltage_designer_id : '',
      drafter: project_payout?.low_voltage_drafter_id !== null ? project_payout?.low_voltage_drafter_id : '',
      post_service: project_payout?.low_voltage_design_post_service_id !== null ? project_payout?.low_voltage_design_post_service_id : '',
      proofreader: project_payout?.low_voltage_proofreader_id !== null ? project_payout?.low_voltage_proofreader_id : '',
      reviewer: project_payout?.low_voltage_reviewer_id !== null ? project_payout?.low_voltage_reviewer_id : '',
      approver: project_payout?.low_voltage_approver_id !== null ? project_payout?.low_voltage_approver_id : '',
    },
    弱电产值:{
      pm: project_payout?.low_voltage_pm_payout !== null ? project_payout?.low_voltage_pm_payout : '',
      pm_assistant: project_payout?.low_voltage_pm_assistant_payout !== null ? project_payout?.low_voltage_pm_assistant_payout : '',
      designer: project_payout?.low_voltage_designer_payout !== null ? project_payout?.low_voltage_designer_payout : '',
      drafter: project_payout?.low_voltage_drafter_payout !== null ? project_payout?.low_voltage_drafter_payout : '',
      post_service: project_payout?.low_voltage_design_post_service_payout !== null ? project_payout?.low_voltage_design_post_service_payout : '',
      proofreader: project_payout?.low_voltage_proofreader_payout !== null ? project_payout?.low_voltage_proofreader_payout : '',
      reviewer: project_payout?.low_voltage_reviewer_payout !== null ? project_payout?.low_voltage_reviewer_payout : '',
      approver: project_payout?.low_voltage_approver_payout !== null ? project_payout?.low_voltage_approver_payout : '',
    },
    弱电产值:{
      pm: project_payout?.low_voltage_pm_payout !== null ? project_payout?.low_voltage_pm_payout : '',
      pm_assistant: project_payout?.low_voltage_pm_assistant_payout !== null ? project_payout?.low_voltage_pm_assistant_payout : '',
      designer: project_payout?.low_voltage_designer_payout !== null ? project_payout?.low_voltage_designer_payout : '',
      drafter: project_payout?.low_voltage_drafter_payout !== null ? project_payout?.low_voltage_drafter_payout : '',
      post_service: project_payout?.low_voltage_design_post_service_payout !== null ? project_payout?.low_voltage_design_post_service_payout : '',
      proofreader: project_payout?.low_voltage_proofreader_payout !== null ? project_payout?.low_voltage_proofreader_payout : '',
      reviewer: project_payout?.low_voltage_reviewer_payout !== null ? project_payout?.low_voltage_reviewer_payout : '',
      approver: project_payout?.low_voltage_approver_payout !== null ? project_payout?.low_voltage_approver_payout : '',
    }
  }
}


const formDataToProjectPayout = (formData: any): ProjectPayoutCreateIn => {
    const project_payout: ProjectPayoutCreateIn = {
      project_id: formData.project_id !== '' ? formData.project_id : null,
      job_payout_ratio_profile_id: formData.project_class_id !== '' ? formData.project_class_id : null,
      pm_id: formData.pm !== '' ? formData.pm : null,
      pm_payout: formData.pmPayout !== '' ? formData.pmPayout : null,
      pm_assistant_id: formData.pmAssistant !== '' ? formData.pmAssistant : null,
      pm_assistant_payout: formData.pmAssistantPayout !== '' ? formData.pmAssistantPayout : null,

      arch_pm_id: formData.建筑设计人.pm !== '' ? formData.建筑设计人.pm : null,
      arch_pm_payout: formData.建筑产值.pm !== '' ? formData.建筑产值.pm : null,
      arch_pm_assistant_id: formData.建筑设计人.pm_assistant !== '' ? formData.建筑设计人.pm_assistant : null,
      arch_pm_assistant_payout: formData.建筑产值.pm_assistant !== '' ? formData.建筑产值.pm_assistant : null,
      arch_designer_id: formData.建筑设计人.designer !== '' ? formData.建筑设计人.designer : null,
      arch_designer_payout: formData.建筑产值.designer !== '' ? formData.建筑产值.designer : null,
      arch_drafter_id: formData.建筑设计人.drafter !== '' ? formData.建筑设计人.drafter : null,
      arch_drafter_payout: formData.建筑产值.drafter !== '' ? formData.建筑产值.drafter : null,
      arch_design_post_service_id: formData.建筑设计人.post_service !== '' ? formData.建筑设计人.post_service : null,
      arch_design_post_service_payout: formData.建筑产值.post_service !== '' ? formData.建筑产值.post_service : null,
      arch_proofreader_id: formData.建筑设计人.proofreader !== '' ? formData.建筑设计人.proofreader : null,
      arch_proofreader_payout: formData.建筑产值.proofreader !== '' ? formData.建筑产值.proofreader : null,
      arch_reviewer_id: formData.建筑设计人.reviewer !== '' ? formData.建筑设计人.reviewer : null,
      arch_reviewer_payout: formData.建筑产值.reviewer !== '' ? formData.建筑产值.reviewer : null,
      arch_approver_id: formData.建筑设计人.approver !== '' ? formData.建筑设计人.approver : null,
      arch_approver_payout: formData.建筑产值.approver !== '' ? formData.建筑产值.approver : null,

      struct_pm_id: formData.结构设计人.pm !== '' ? formData.结构设计人.pm : null,
      struct_pm_payout: formData.结构产值.pm !== '' ? formData.结构产值.pm : null,
      struct_pm_assistant_id: formData.结构设计人.pm_assistant !== '' ? formData.结构设计人.pm_assistant : null,
      struct_pm_assistant_payout: formData.结构产值.pm_assistant !== '' ? formData.结构产值.pm_assistant : null,
      struct_designer_id: formData.结构设计人.designer !== '' ? formData.结构设计人.designer : null,
      struct_designer_payout: formData.结构产值.designer !== '' ? formData.结构产值.designer : null,
      struct_drafter_id: formData.结构设计人.drafter !== '' ? formData.结构设计人.drafter : null,
      struct_drafter_payout: formData.结构产值.drafter !== '' ? formData.结构产值.drafter : null,
      struct_design_post_service_id: formData.结构设计人.post_service !== '' ? formData.结构设计人.post_service : null,
      struct_design_post_service_payout: formData.结构产值.post_service !== '' ? formData.结构产值.post_service : null,
      struct_proofreader_id: formData.结构设计人.proofreader !== '' ? formData.结构设计人.proofreader : null,
      struct_proofreader_payout: formData.结构产值.proofreader !== '' ? formData.结构产值.proofreader : null,
      struct_reviewer_id: formData.结构设计人.reviewer !== '' ? formData.结构设计人.reviewer : null,
      struct_reviewer_payout: formData.结构产值.reviewer !== '' ? formData.结构产值.reviewer : null,
      struct_approver_id: formData.结构设计人.approver !== '' ? formData.结构设计人.approver : null,
      struct_approver_payout: formData.结构产值.approver !== '' ? formData.结构产值.approver : null,

      plumbing_pm_id: formData.给排水设计人.pm !== '' ? formData.给排水设计人.pm : null,
      plumbing_pm_payout: formData.给排水产值.pm !== '' ? formData.给排水产值.pm : null,
      plumbing_pm_assistant_id: formData.给排水设计人.pm_assistant !== '' ? formData.给排水设计人.pm_assistant : null,
      plumbing_pm_assistant_payout: formData.给排水产值.pm_assistant !== '' ? formData.给排水产值.pm_assistant : null,
      plumbing_designer_id: formData.给排水设计人.designer !== '' ? formData.给排水设计人.designer : null,
      plumbing_designer_payout: formData.给排水产值.designer !== '' ? formData.给排水产值.designer : null,
      plumbing_drafter_id: formData.给排水设计人.drafter !== '' ? formData.给排水设计人.drafter : null,
      plumbing_drafter_payout: formData.给排水产值.drafter !== '' ? formData.给排水产值.drafter : null,
      plumbing_design_post_service_id: formData.给排水设计人.post_service !== '' ? formData.给排水设计人.post_service : null,
      plumbing_design_post_service_payout: formData.给排水产值.post_service !== '' ? formData.给排水产值.post_service : null,
      plumbing_proofreader_id: formData.给排水设计人.proofreader !== '' ? formData.给排水设计人.proofreader : null,
      plumbing_proofreader_payout: formData.给排水产值.proofreader !== '' ? formData.给排水产值.proofreader : null,
      plumbing_reviewer_id: formData.给排水设计人.reviewer !== '' ? formData.给排水设计人.reviewer : null,
      plumbing_reviewer_payout: formData.给排水产值.reviewer !== '' ? formData.给排水产值.reviewer : null,
      plumbing_approver_id: formData.给排水设计人.approver !== '' ? formData.给排水设计人.approver : null,
      plumbing_approver_payout: formData.给排水产值.approver !== '' ? formData.给排水产值.approver : null,

      electrical_pm_id: formData.强电设计人.pm !== '' ? formData.强电设计人.pm : null,
      electrical_pm_payout: formData.强电产值.pm !== '' ? formData.强电产值.pm : null,
      electrical_pm_assistant_id: formData.强电设计人.pm_assistant !== '' ? formData.强电设计人.pm_assistant : null,
      electrical_pm_assistant_payout: formData.强电产值.pm_assistant !== '' ? formData.强电产值.pm_assistant : null,
      electrical_designer_id: formData.强电设计人.designer !== '' ? formData.强电设计人.designer : null,
      electrical_designer_payout: formData.强电产值.designer !== '' ? formData.强电产值.designer : null,
      electrical_drafter_id: formData.强电设计人.drafter !== '' ? formData.强电设计人.drafter : null,
      electrical_drafter_payout: formData.强电产值.drafter !== '' ? formData.强电产值.drafter : null,
      electrical_design_post_service_id: formData.强电设计人.post_service !== '' ? formData.强电设计人.post_service : null,
      electrical_design_post_service_payout: formData.强电产值.post_service !== '' ? formData.强电产值.post_service : null,
      electrical_proofreader_id: formData.强电设计人.proofreader !== '' ? formData.强电设计人.proofreader : null,
      electrical_proofreader_payout: formData.强电产值.proofreader !== '' ? formData.强电产值.proofreader : null,
      electrical_reviewer_id: formData.强电设计人.reviewer !== '' ? formData.强电设计人.reviewer : null,
      electrical_reviewer_payout: formData.强电产值.reviewer !== '' ? formData.强电产值.reviewer : null,
      electrical_approver_id: formData.强电设计人.approver !== '' ? formData.强电设计人.approver : null,
      electrical_approver_payout: formData.强电产值.approver !== '' ? formData.强电产值.approver : null,

      hvac_pm_id: formData.暖通设计人.pm !== '' ? formData.暖通设计人.pm : null,
      hvac_pm_payout: formData.暖通产值.pm !== '' ? formData.暖通产值.pm : null,
      hvac_pm_assistant_id: formData.暖通设计人.pm_assistant !== '' ? formData.暖通设计人.pm_assistant : null,
      hvac_pm_assistant_payout: formData.暖通产值.pm_assistant !== '' ? formData.暖通产值.pm_assistant : null,
      hvac_designer_id: formData.暖通设计人.designer !== '' ? formData.暖通设计人.designer : null,
      hvac_designer_payout: formData.暖通产值.designer !== '' ? formData.暖通产值.designer : null,
      hvac_drafter_id: formData.暖通设计人.drafter !== '' ? formData.暖通设计人.drafter : null,
      hvac_drafter_payout: formData.暖通产值.drafter !== '' ? formData.暖通产值.drafter : null,
      hvac_design_post_service_id: formData.暖通设计人.post_service !== '' ? formData.暖通设计人.post_service : null,
      hvac_design_post_service_payout: formData.暖通产值.post_service !== '' ? formData.暖通产值.post_service : null,
      hvac_proofreader_id: formData.暖通设计人.proofreader !== '' ? formData.暖通设计人.proofreader : null,
      hvac_proofreader_payout: formData.暖通产值.proofreader !== '' ? formData.暖通产值.proofreader : null,
      hvac_reviewer_id: formData.暖通设计人.reviewer !== '' ? formData.暖通设计人.reviewer : null,
      hvac_reviewer_payout: formData.暖通产值.reviewer !== '' ? formData.暖通产值.reviewer : null,
      hvac_approver_id: formData.暖通设计人.approver !== '' ? formData.暖通设计人.approver : null,
      hvac_approver_payout: formData.暖通产值.approver !== '' ? formData.暖通产值.approver : null,

      low_voltage_pm_id: formData.弱电设计人.pm !== '' ? formData.弱电设计人.pm : null,
      low_voltage_pm_payout: formData.弱电产值.pm !== '' ? formData.弱电产值.pm : null,
      low_voltage_pm_assistant_id: formData.弱电设计人.pm_assistant !== '' ? formData.弱电设计人.pm_assistant : null,
      low_voltage_pm_assistant_payout: formData.弱电产值.pm_assistant !== '' ? formData.弱电产值.pm_assistant : null,
      low_voltage_designer_id: formData.弱电设计人.designer !== '' ? formData.弱电设计人.designer : null,
      low_voltage_designer_payout: formData.弱电产值.designer !== '' ? formData.弱电产值.designer : null,
      low_voltage_drafter_id: formData.弱电设计人.drafter !== '' ? formData.弱电设计人.drafter : null,
      low_voltage_drafter_payout: formData.弱电产值.drafter !== '' ? formData.弱电产值.drafter : null,
      low_voltage_design_post_service_id: formData.弱电设计人.post_service !== '' ? formData.弱电设计人.post_service : null,
      low_voltage_design_post_service_payout: formData.弱电产值.post_service !== '' ? formData.弱电产值.post_service : null,
      low_voltage_proofreader_id: formData.弱电设计人.proofreader !== '' ? formData.弱电设计人.proofreader : null,
      low_voltage_proofreader_payout: formData.弱电产值.proofreader !== '' ? formData.弱电产值.proofreader : null,
      low_voltage_reviewer_id: formData.弱电设计人.reviewer !== '' ? formData.弱电设计人.reviewer : null,
      low_voltage_reviewer_payout: formData.弱电产值.reviewer !== '' ? formData.弱电产值.reviewer : null,
      low_voltage_approver_id: formData.弱电设计人.approver !== '' ? formData.弱电设计人.approver : null,
      low_voltage_approver_payout: formData.弱电产值.approver !== '' ? formData.弱电产值.approver : null,
    } 
    return project_payout
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  rowIndex,
  columnIndex,
  departments,
  workLocations,
  handleSave,
  existing_project_payout,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [department, setDepartment] = useState<DepartmentPublicOut | null | undefined>(null)
  const [options, setOptions] = useState<(EmployeePublicOut & {value:number, label:string, key:number})[]>([])
  const selectRef  = useRef<BaseSelectRef>(null);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const [employeeName, setEmployeeName] = useState<string>('');
  
  useEffect(() => {
    if (editing) {
      if (record?.text === '设计人') {
        selectRef.current?.focus()
      } else {
        inputRef.current?.focus()
      }
    }
    
    // Set initial employee name when editing starts
    if (editing && record?.text === '设计人' && record[dataIndex]) {
      const employeeId = record[dataIndex];
      const employee = employeeCache[employeeId];
      if (employee) {
        setEmployeeName(employee.name);
        setOptions([{
          ...employee,
          label: employee.name,
          key: employee.id,
          value: employee.id
        }])
      }
    }
  }, [editing, record, dataIndex]);
  
  useEffect(()=>{
    setDepartment(departments?.find(dp=>dp.name===record?.category))
    
  },[])
  // useEffect(() => {
  //   // 设置初始值
  //   if (form && record) {
  //     form.setFieldsValue({
  //       [`${record.category}${record.text}`]: {
  //         [dataIndex]: record[dataIndex] || ""
  //       }
  //     });
  //   }
  // }, [form, record, dataIndex]);
  const toggleEdit = () => {
    console.log("click");
    
    setEditing(!editing);
    form.setFieldValue([record?.category + record?.text, dataIndex], record[dataIndex]!==null && record[dataIndex]!==undefined ?  record[dataIndex] : "");
    
    // Set employee name when toggling edit mode
    if (record?.text === '设计人' && record[dataIndex]) {
      const employeeId = record[dataIndex];
      const employee = employeeCache[employeeId];
      if (employee) {
        setEmployeeName(employee.name);
      }
    }
  };
  // const setValueToFormField=()=>{
  //   form.setFieldsValue({ [dataIndex]: record[dataIndex] || "" });

  // }

  const save = async () => {
    try {
      // Validate only the current field
      await form.validateFields([[record?.category + record?.text, dataIndex]]);
      
      const values = form.getFieldsValue();
      let internalValue = {};
      
      // Extract the value for the current cell
      if (values[record?.category + record?.text]) {
        internalValue = { [dataIndex]: values[record?.category + record?.text][dataIndex] };
      }
      
      // If this is a 设计人 cell, store the employee object
      if (record.text === '设计人') {
        const employeeId = internalValue[dataIndex];
        if (employeeId && employeeCache[employeeId]) {
          internalValue[dataIndex] = employeeId;
        }
      }
      
      handleSave({ ...record, ...internalValue });
      toggleEdit();
    } catch (error) {
      // If there's an error, don't toggle edit mode
      console.log('存错误:', error);
    }
  };
  
  const onSelect = async (data: string) => {
    const person = options.find((value) => value.id === parseInt(data));
    if (person) {
      setEmployeeName(person.name);
      setEditing(false);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }

      form.setFieldValue([record?.category + record?.text, dataIndex], person.id);
    }
  };
  
  const onSearch = async(searchText:string) => {
    if(searchText === "") {
      setOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        },
        query: {
          department_id: department?.id
        }
      })
      if(response.data){
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => {
          // Add employee to cache
          employeeCache[employee.id.toString()] = employee;
          return {
            ...employee,
            label: employee.name,
            value: employee.id.toString()
          };
        });
        setOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error); 
    }
  }
   
  let childNode = children;
  let formName=[record?.category+record?.text, dataIndex]
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={formName}
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => 
              validateEmployee(
                _, 
                value, 
                getFieldValue([record?.category + '产值', dataIndex])
              )
          })
        ]}
      >
        {record?.text === '设计人' ? 
          <Select
            showSearch
            ref={selectRef}
            onBlur={save}
            filterOption={false}
            value={employeeName==='' ? undefined : employeeName}
            options={options.map((option) => ({
              key: option.id,
              value: option.id,
              label: (
                <Space size={1} align="end">
                  <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                  <Divider type="vertical" style={{width:'1px'}}/>
                  <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                  <Divider type="vertical" style={{width:'1px'}}/>
                  <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                </Space>
              )
            }))}
            onSelect={onSelect}
            onSearch={onSearch}
            notFoundContent={employeeName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
            allowClear={true}
            popupMatchSelectWidth={false}
            placeholder={`模糊搜索员工`}
          />
        :
        <PayoutInput ref={inputRef} onPressEnter={save} onBlur={save} />
        }
      </Form.Item>
    ) : (
      <Form.Item
        style={{ margin: 0 }}
        name={formName}
        rules={[
          ({ getFieldValue }) => ({
            validator: (_, value) => 
              validateEmployee(
                _, 
                value, 
                getFieldValue([record?.category + '产值', dataIndex])
              )
          })
        ]}
      >
        <div
          className="editable-cell-value-wrap"
          style={{ pointerEvents: existing_project_payout?.contract_payment_payout_started && record?.text==='产值' ? 'none' : 'auto' }}
          onClick={toggleEdit}
        >
      {record.text === '设计人' && typeof children[1] === 'number'
        ? employeeCache[children[1]]?.name || children
        : children}
    </div>
      </Form.Item>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


interface PayoutTableProps {
  project: ProjectPublicOut;
  existing_project_payout: ProjectPayoutPublicOut | null;
}

export const PayoutTable: React.FC<PayoutTableProps> = ({project, existing_project_payout}) => {
  
  const [formPayout] = Form.useForm();
  const [selectedProfileId, setSelectedProfileId] = useState<
    number | undefined
  >(undefined);
  const [profiles, setProfiles] = useState<JobPayoutRatioProfilePublicOut[]>(
    []
  );
  const [PMOptions, setPMOptions] = useState<(EmployeePublicOut & {value:String, label:string})[]>([])
  const [selectedProfileData, setSelectedProfileData] = useState<JobPayoutRatioProfilePublicOut | null>(null);
  const [togglePayoutTable, setTogglePayoutTable] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<{ [key: string]: EmployeePublicOut }>({});
  const [inaccuracy, setInaccuracy] = useState<number>(0)
  const [isSumValid, setIsSumValid] = useState<boolean>(false)
  const [totalSum, setTotalSum] = useState<number>(0)
  const [pmOptions, setPmOptions] = useState<(EmployeePublicOut & {value: number, label: string})[]>([])
  const [pmAssistantOptions, setPmAssistantOptions] = useState<(EmployeePublicOut & {value: number, label: string})[]>([])
  const [pmName, setPmName] = useState<string>('');
  const [pmAssistantName, setPmAssistantName] = useState<string>('');
  const [usedDepartmentPayoutRatioId, setUsedDepartmentPayoutRatioId] = useState<number | null>(null)
  const [workLocations, setWorkLocations] = useState<WorkLocationPublicOut[]>([])//use for dropdown while editing
  const [departments, setDepartments] = useState<DepartmentPublicOut[]>([])//use for dropdown while editing
  const [dataSource, setDataSource] = useState<DataType[]>(projectPayoutToDataSource(null))
  const [notificationApi, contextHolder] = notification.useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isStaticDataLoaded, setIsStaticDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resWorkLocations, resDepartments, resProfiles] = await Promise.all([
        WorkLocationsService.readWorkLocations(),
        DepartmentsService.readDepartments(),
        JobPayoutRatioProfilesService.readJobPayoutRatioProfiles({
          query: {
            hidden: false,
          },
        }),
      ]);

      if (resWorkLocations.error) {
        message.error("工作地点获取失败: " + resWorkLocations.error?.detail);
        return;
      }
      if (resDepartments.error) {
        message.error("部门获取失败: " + resDepartments.error?.detail);
        return;
      }
      if (resProfiles.error) {
        message.error("工比获取失败: " + resProfiles.error?.detail);
        return;
      }

      setWorkLocations(resWorkLocations.data.data);
      setDepartments(resDepartments.data.data);
      setProfiles(resProfiles.data.data);
      
      setIsStaticDataLoaded(true);
      if (!existing_project_payout) setLoading(false);
    } catch (error) {
      message.error("数据获取失败: " + error);
      console.error(error);
    }
  };

  // Modify the calculateRowSum function to accept a category
  const calculateRowSum = useCallback((category: string, formValues: any) => {
    const rowData = formValues[`${category}产值`] || {};
    const values = [
      rowData.pm,
      rowData.pm_assistant,
      rowData.designer,
      rowData.drafter,
      rowData.post_service,
      rowData.proofreader,
      rowData.reviewer,
      rowData.approver
    ];
    return values.reduce((sum, value) => sum + (Number(value) || 0), 0).toFixed(2);
  }, []);


  // Add this function to calculate the total sum
  const calculateTotalSum = useCallback((formValues: any): number => {
    const departmentSums = ['建筑', '结构', '给排水', '暖通', '强电', '弱电'].reduce((sum, category) => {
      return sum + Number(calculateRowSum(category, formValues));
    }, 0);

    const pmPayout = Number(formValues.pmPayout) || 0;
    const pmAssistantPayout = Number(formValues.pmAssistantPayout) || 0;

    return departmentSums + pmPayout + pmAssistantPayout;
  }, [calculateRowSum]);

  const handleProfileSelect = useCallback((profileId: number) => {
    setSelectedProfileId(profileId);
    const selectedProfile = profiles.find(
      (profile) => profile.id === profileId
    );
    
    if (selectedProfile) {
      setSelectedProfileId(selectedProfile.id)
      setSelectedProfileData(selectedProfile);
      console.log(selectedProfile);
      
    } else {
      message.error("未找到所选配置文件");
    }
  }, [profiles]);


  const initializeFormWithProjectPayout = useCallback(async () => {
    if (!existing_project_payout) return;

    // load employee cache
    for (const key of Object.keys(existing_project_payout) as (keyof typeof existing_project_payout)[]) {
        if (key.endsWith('_id')) {
          if (key === "project_id") continue;
          if (existing_project_payout[key] === null) continue;
          if (existing_project_payout[key] === undefined) continue;
          if (employeeCache[existing_project_payout[key] as number]) continue;
          const {error, data} = await EmployeeService.getEmployeeById({
            path: {
              id: existing_project_payout[key] as number
            }
          })
          if (error) {
            message.error("获取员工ID " + existing_project_payout[key] + " 信息失败(来自" + key + "): " + error)
            return
          }
          employeeCache[data.id] = data
        }
    }

    setUsedDepartmentPayoutRatioId(existing_project_payout.department_payout_ratio_id)

    const fields = projectPayoutToFormData(existing_project_payout)

    formPayout.setFieldsValue(fields);
    // Update dataSource
    const newDataSource = projectPayoutToDataSource(existing_project_payout)
    setDataSource(newDataSource);

    // Set PM and PM Assistant names
    if (existing_project_payout.pm_id) {
      setPmName(employeeCache[existing_project_payout!.pm_id]?.name || '');
      setPmOptions(employeeCache[existing_project_payout!.pm_id] ? [employeeCache[existing_project_payout!.pm_id]] : [])
    }
    if (existing_project_payout!.pm_assistant_id) {
      setPmAssistantName(employeeCache[existing_project_payout!.pm_assistant_id]?.name || '');
      setPmAssistantOptions(employeeCache[existing_project_payout!.pm_assistant_id] ? [employeeCache[existing_project_payout!.pm_assistant_id]] : [])
    }

    handleProfileSelect(existing_project_payout.job_payout_ratio_profile_id)

    // Calculate and set total sum
    const totalSum = calculateTotalSum(fields);
    setTotalSum(totalSum);
    setIsSumValid(Math.abs(totalSum - project.calculated_employee_payout) < 0.001);
    setTogglePayoutTable(true)
    setLoading(false)
  }, [calculateTotalSum, existing_project_payout, formPayout, handleProfileSelect, project.calculated_employee_payout]);

  useEffect(() => {
    if (isStaticDataLoaded && existing_project_payout) {
      initializeFormWithProjectPayout();
    }
  }, [isStaticDataLoaded, existing_project_payout, initializeFormWithProjectPayout]);

  const handlePayoutFinish = async () => {
      if (!isSumValid) {
        notificationApi.error({
          message: "提交失败",
          description: "计算表总计与项目下发产值不相等。请检查",
          duration: 5,
          closable: false,
          btn: <Button type="primary" onClick={() => notificationApi.destroy()}>我知道了</Button>,
        });
        return;
      }
      setIsSubmitting(true)
      const submitted_project_payout = formDataToProjectPayout(formPayout.getFieldsValue())
      submitted_project_payout.project_id = project.id
      submitted_project_payout.job_payout_ratio_profile_id = selectedProfileId!
      submitted_project_payout.department_payout_ratio_id = usedDepartmentPayoutRatioId!
      console.log("表单提交时的值:", formPayout.getFieldsValue());
      console.log("表单提交时的ProjectPayout:", submitted_project_payout);
      if (!existing_project_payout){ // 第一次计算
        try{
          const {error, data} = await ProjectPayoutsService.createProjectPayout(
            {
              body: submitted_project_payout
            }
          )
          if (error) {
            notificationApi.error({
              message: "提交失败",
              description: "错误: " + error.detail,
            });
            console.log("ProjectPayout提交错误: ");
            console.log(error);
          } else {
            notificationApi.success({
              message: "提交成功",
            });
            existing_project_payout = data
          }
        } catch (error) {
          notificationApi.error({
            message: "提交失败",
            description: "未知错误: " + error,
          });
          console.log("ProjectPayout提交Fetch错误: ");
          console.log(error);
        }
      } else { // 更新
        const changed_project_payout: ProjectPayoutUpdateIn = {}
        for (const key of Object.keys(submitted_project_payout) as (keyof typeof submitted_project_payout)[]) {
          if (existing_project_payout[key] !== submitted_project_payout[key]) {
            changed_project_payout[key] = submitted_project_payout[key]
          }
        }
        console.log("需要更新的ProjectPayout:", changed_project_payout);
        //if (Object.keys(changed_project_payout).length > 0) {
          try{
            const {error, data} = await ProjectPayoutsService.updateProjectPayout(
              {
                body: changed_project_payout,
                path: {
                  id: existing_project_payout.id
                },
              }
            )
            if (error) {
              notificationApi.error({
                message: "修改失败",
                description: "错误: " + error.detail,
              });
              console.log("ProjectPayout修改错误: ");
              console.log(error);
            } else {
              notificationApi.success({
                message: "修改成功",
                description: data.message,
                duration: 5 * data.message.split('\n').length,
              });
              for (const key of Object.keys(changed_project_payout) as (keyof typeof changed_project_payout)[]) {
                existing_project_payout[key] = changed_project_payout[key]
              }
              existing_project_payout.update_required_project_updated = false
              initializeFormWithProjectPayout()
            }
          } catch (error) {
            notificationApi.error({
              message: "修改失败",
              description: "未知错误: " + error,
            });
            console.log("ProjectPayout修改Fetch错误: ");
            console.log(error);
          }
        //} else {
        //   notificationApi.success({
        //     message: "未检测到修改",
        //   });
        // }
      }
      setIsSubmitting(false)
  };

  function calculatePayout(departmentValue: number, ratios: any) {
    return {
      pm: (departmentValue * ratios.pm_ratio / 100).toFixed(2),
      pm_assistant: (departmentValue * ratios.pm_assistant_ratio / 100).toFixed(2),
      designer: (departmentValue * ratios.designer_ratio / 100).toFixed(2),
      drafter: (departmentValue * ratios.drafter_ratio / 100).toFixed(2),
      post_service: (departmentValue * ratios.design_post_service_ratio / 100).toFixed(2),
      proofreader: (departmentValue * ratios.proofreader_ratio / 100).toFixed(2),
      reviewer: (departmentValue * ratios.reviewer_ratio / 100).toFixed(2),
      approver: (departmentValue * ratios.approver_ratio / 100).toFixed(2),
    };
  }

  function getPayoutData(category: string, text: string, department: any) {
    if (text === '设计人') {
      return {
        category,
        text,
        pm: '',
        pm_assistant: '',
        designer: '',
        drafter: '',
        post_service: '',
        proofreader: '',
        reviewer: '',
        approver: '',
      };
    } else if (text === '产值') {
      return {
        category,
        text,
        pm: department.pm,
        pm_assistant: department.pm_assistant,
        designer: department.designer,
        drafter: department.drafter,
        post_service: department.post_service,
        proofreader: department.proofreader,
        reviewer: department.reviewer,
        approver: department.approver,
      };
    }
    // 默认返回空数据，但保持类型一致
    return {
      category: '',
      text: '',
      pm: 0,
      pm_assistant: 0,
      designer: 0,
      drafter: 0,
      post_service: 0,
      proofreader: 0,
      reviewer: 0,
      approver: 0,
    };
  }
  
  const generatePayout = async()=>{
    console.log("生成产值表...");
    setTogglePayoutTable(true)

    console.log(project,"工程");
    
    const resDepartmentPayoutRatio = await DepartmentPayoutRatiosService.getDepartmentPayoutRatio({
      path: {
        project_class_id: project.project_class_id,
        project_rate_adjustment_class_id: project.project_rate_adjustment_class_id
      }
    })
    if (resDepartmentPayoutRatio.error){
      notification.error({
        message: "读取部门间产值配置失败，产值计算失败。",
        description: resDepartmentPayoutRatio.error.detail,
      });
      return;
    }
    setUsedDepartmentPayoutRatioId(resDepartmentPayoutRatio.data.id)
    //计算部门间payout
    const valueForPMTeam = project.calculated_employee_payout * resDepartmentPayoutRatio.data.pm_ratio / 100//项目总负责及助理产值
    const valueForRestOfPM = project.calculated_employee_payout * (100-resDepartmentPayoutRatio.data.pm_ratio) /100 //除项目总负责及助理剩余专业产值
    const valueArch = valueForRestOfPM * resDepartmentPayoutRatio.data.arch_ratio / 100 //建筑专业产值
    const valueStruct = valueForRestOfPM * resDepartmentPayoutRatio.data.struct_ratio / 100 //结构专业产值
    const valuePlumbing = valueForRestOfPM * resDepartmentPayoutRatio.data.plumbing_ratio / 100 //给排水专业产值
    const valueElectric = valueForRestOfPM * resDepartmentPayoutRatio.data.electrical_ratio / 100 //强电专业产值
    const valueHVAC = valueForRestOfPM * resDepartmentPayoutRatio.data.hvac_ratio / 100 //暖通专业产值
    const valueLowVoltage = valueForRestOfPM * resDepartmentPayoutRatio.data.low_voltage_ratio / 100 //弱电专业产值
    //具体职责payout
    let pm = (valueForPMTeam * selectedProfileData!.pm_ratio /100).toFixed(2)
    const pmAssistant = (valueForPMTeam * selectedProfileData!.pm_assistant_ratio /100).toFixed(2)

    const archPM = (valueArch * selectedProfileData!.arch_pm_ratio / 100).toFixed(2)
    const archAssistant = (valueArch * selectedProfileData!.arch_pm_assistant_ratio / 100).toFixed(2)
    const archDesigner= (valueArch * selectedProfileData!.arch_designer_ratio / 100).toFixed(2)
    const archDrafter= (valueArch * selectedProfileData!.arch_drafter_ratio / 100).toFixed(2)
    const archPostService= (valueArch * selectedProfileData!.arch_design_post_service_ratio / 100).toFixed(2)
    const archProofreader= (valueArch * selectedProfileData!.arch_proofreader_ratio / 100).toFixed(2)
    const archReviewer= (valueArch * selectedProfileData!.arch_reviewer_ratio / 100).toFixed(2)
    const archApprover= (valueArch * selectedProfileData!.arch_approver_ratio / 100).toFixed(2)

    const structPM = (valueStruct * selectedProfileData!.struct_pm_ratio / 100).toFixed(2)
    const structAssistant = (valueStruct * selectedProfileData!.struct_pm_assistant_ratio / 100).toFixed(2)
    const structDesigner = (valueStruct * selectedProfileData!.struct_designer_ratio / 100).toFixed(2)
    const structDrafter = (valueStruct * selectedProfileData!.struct_drafter_ratio / 100).toFixed(2)
    const structPostService = (valueStruct * selectedProfileData!.struct_design_post_service_ratio / 100).toFixed(2)
    const structProofreader = (valueStruct * selectedProfileData!.struct_proofreader_ratio / 100).toFixed(2)
    const structReviewer = (valueStruct * selectedProfileData!.struct_reviewer_ratio / 100).toFixed(2)
    const structApprover = (valueStruct * selectedProfileData!.struct_approver_ratio / 100).toFixed(2)

    const plumbingPM = (valuePlumbing * selectedProfileData!.plumbing_pm_ratio / 100).toFixed(2)
    const plumbingAssistant = (valuePlumbing * selectedProfileData!.plumbing_pm_assistant_ratio / 100).toFixed(2)
    const plumbingDesigner = (valuePlumbing * selectedProfileData!.plumbing_designer_ratio / 100).toFixed(2)
    const plumbingDrafter = (valuePlumbing * selectedProfileData!.plumbing_drafter_ratio / 100).toFixed(2)
    const plumbingPostService = (valuePlumbing * selectedProfileData!.plumbing_design_post_service_ratio / 100).toFixed(2)
    const plumbingProofreader = (valuePlumbing * selectedProfileData!.plumbing_proofreader_ratio / 100).toFixed(2)
    const plumbingReviewer = (valuePlumbing * selectedProfileData!.plumbing_reviewer_ratio / 100).toFixed(2)
    const plumbingApprover = (valuePlumbing * selectedProfileData!.plumbing_approver_ratio / 100).toFixed(2)

    const electricPM = (valueElectric * selectedProfileData!.electrical_pm_ratio / 100).toFixed(2)
    const electricAssistant = (valueElectric * selectedProfileData!.electrical_pm_assistant_ratio / 100).toFixed(2)
    const electricDesigner = (valueElectric * selectedProfileData!.electrical_designer_ratio / 100).toFixed(2)
    const electricDrafter = (valueElectric * selectedProfileData!.electrical_drafter_ratio / 100).toFixed(2)
    const electricPostService = (valueElectric * selectedProfileData!.electrical_design_post_service_ratio / 100).toFixed(2)
    const electricProofreader = (valueElectric * selectedProfileData!.electrical_proofreader_ratio / 100).toFixed(2)
    const electricReviewer = (valueElectric * selectedProfileData!.electrical_reviewer_ratio / 100).toFixed(2)
    const electricApprover = (valueElectric * selectedProfileData!.electrical_approver_ratio / 100).toFixed(2)

    const HVACPM = (valueHVAC * selectedProfileData!.hvac_pm_ratio / 100).toFixed(2)
    const HVACAssistant = (valueHVAC * selectedProfileData!.hvac_pm_assistant_ratio / 100).toFixed(2) 
    const HVACDesigner = (valueHVAC * selectedProfileData!.hvac_designer_ratio / 100).toFixed(2)
    const HVACDrafter = (valueHVAC * selectedProfileData!.hvac_drafter_ratio / 100).toFixed(2)
    const HVACPostService = (valueHVAC * selectedProfileData!.hvac_design_post_service_ratio / 100).toFixed(2)
    const HVACProofreader = (valueHVAC * selectedProfileData!.hvac_proofreader_ratio / 100).toFixed(2)
    const HVACReviewer = (valueHVAC * selectedProfileData!.hvac_reviewer_ratio / 100).toFixed(2)
    const HVACApprover = (valueHVAC * selectedProfileData!.hvac_approver_ratio / 100).toFixed(2)

    const lowVoltagePM = (valueLowVoltage * selectedProfileData!.low_voltage_pm_ratio / 100).toFixed(2)
    const lowVoltageAssistant = (valueLowVoltage * selectedProfileData!.low_voltage_pm_assistant_ratio / 100).toFixed(2)
    const lowVoltageDesigner = (valueLowVoltage * selectedProfileData!.low_voltage_designer_ratio / 100).toFixed(2)
    const lowVoltageDrafter = (valueLowVoltage * selectedProfileData!.low_voltage_drafter_ratio / 100).toFixed(2)
    const lowVoltagePostService = (valueLowVoltage * selectedProfileData!.low_voltage_design_post_service_ratio / 100).toFixed(2)
    const lowVoltageProofreader = (valueLowVoltage * selectedProfileData!.low_voltage_proofreader_ratio / 100).toFixed(2)
    const lowVoltageReviewer = (valueLowVoltage * selectedProfileData!.low_voltage_reviewer_ratio / 100).toFixed(2)
    const lowVoltageApprover = (valueLowVoltage * selectedProfileData!.low_voltage_approver_ratio / 100).toFixed(2)

    const inaccuracy = (project?.calculated_employee_payout - (Number(pm)+Number(pmAssistant)+
    Number(archPM)+Number(archAssistant)+Number(archDesigner)+Number(archDrafter)+Number(archPostService)+Number(archProofreader)+Number(archReviewer)+Number(archApprover)+
    Number(structPM)+Number(structAssistant)+Number(structDesigner)+Number(structDrafter)+Number(structPostService)+Number(structProofreader)+Number(structReviewer)+Number(structApprover)+
    Number(plumbingPM)+Number(plumbingAssistant)+Number(plumbingDesigner)+Number(plumbingDrafter)+Number(plumbingPostService)+Number(plumbingProofreader)+Number(plumbingReviewer)+Number(plumbingApprover)+
    Number(electricPM)+Number(electricAssistant)+Number(electricDesigner)+Number(electricDrafter)+Number(electricPostService)+Number(electricProofreader)+Number(electricReviewer)+Number(electricApprover)+
    Number(HVACPM)+Number(HVACAssistant)+Number(HVACDesigner)+Number(HVACDrafter)+Number(HVACPostService)+Number(HVACProofreader)+Number(HVACReviewer)+Number(HVACApprover)+
    Number(lowVoltagePM)+Number(lowVoltageAssistant)+Number(lowVoltageDesigner)+Number(lowVoltageDrafter)+Number(lowVoltagePostService)+Number(lowVoltageProofreader)+Number(lowVoltageReviewer)+Number(lowVoltageApprover)))
    
    if (selectedProfileData?.id !== 99 && resDepartmentPayoutRatio.data.id !== 99){ // 当选择的配置文件不是"不使用配置文件"时
      console.log("四舍五入后不准确度: "+inaccuracy);
      pm = (Number(pm)+Number(inaccuracy)).toFixed(2)
      setInaccuracy(inaccuracy)
    }

    let new_project_payout: ProjectPayoutPublicOut = {
      project_id: project.id,
      id: existing_project_payout?.id || 0,
      created_at: "",
      calculation_updated_at: "",
      people_updated_at: "",
      contract_payment_payout_started: false,
      update_required_project_updated: false,
      department_payout_ratio_id: resDepartmentPayoutRatio.data.id,
      department_payout_ratio_used_outdated: false,
      job_payout_ratio_profile_id: selectedProfileData?.id || 0,
      job_payout_ratio_profile_used_outdated: false
    }
    new_project_payout.pm_payout = Number(pm)
    new_project_payout.pm_assistant_payout = Number(pmAssistant)
    new_project_payout.arch_pm_payout = Number(archPM)
    new_project_payout.arch_pm_assistant_payout = Number(archAssistant)
    new_project_payout.arch_designer_payout = Number(archDesigner)
    new_project_payout.arch_drafter_payout = Number(archDrafter)
    new_project_payout.arch_design_post_service_payout = Number(archPostService)
    new_project_payout.arch_proofreader_payout = Number(archProofreader)
    new_project_payout.arch_reviewer_payout = Number(archReviewer)
    new_project_payout.arch_approver_payout = Number(archApprover)
    new_project_payout.struct_pm_payout = Number(structPM)
    new_project_payout.struct_pm_assistant_payout = Number(structAssistant)
    new_project_payout.struct_designer_payout = Number(structDesigner)
    new_project_payout.struct_drafter_payout = Number(structDrafter)
    new_project_payout.struct_design_post_service_payout = Number(structPostService)
    new_project_payout.struct_proofreader_payout = Number(structProofreader)
    new_project_payout.struct_reviewer_payout = Number(structReviewer)
    new_project_payout.struct_approver_payout = Number(structApprover)
    new_project_payout.plumbing_pm_payout = Number(plumbingPM)
    new_project_payout.plumbing_pm_assistant_payout = Number(plumbingAssistant)
    new_project_payout.plumbing_designer_payout = Number(plumbingDesigner)
    new_project_payout.plumbing_drafter_payout = Number(plumbingDrafter)
    new_project_payout.plumbing_design_post_service_payout = Number(plumbingPostService)
    new_project_payout.plumbing_proofreader_payout = Number(plumbingProofreader)
    new_project_payout.plumbing_reviewer_payout = Number(plumbingReviewer)
    new_project_payout.plumbing_approver_payout = Number(plumbingApprover)
    new_project_payout.electrical_pm_payout = Number(electricPM)
    new_project_payout.electrical_pm_assistant_payout = Number(electricAssistant)
    new_project_payout.electrical_designer_payout = Number(electricDesigner)
    new_project_payout.electrical_drafter_payout = Number(electricDrafter)
    new_project_payout.electrical_design_post_service_payout = Number(electricPostService)
    new_project_payout.electrical_proofreader_payout = Number(electricProofreader)
    new_project_payout.electrical_reviewer_payout = Number(electricReviewer)
    new_project_payout.electrical_approver_payout = Number(electricApprover)
    new_project_payout.hvac_pm_payout = Number(HVACPM)
    new_project_payout.hvac_pm_assistant_payout = Number(HVACAssistant)
    new_project_payout.hvac_designer_payout = Number(HVACDesigner)
    new_project_payout.hvac_drafter_payout = Number(HVACDrafter)
    new_project_payout.hvac_design_post_service_payout = Number(HVACPostService)
    new_project_payout.hvac_proofreader_payout = Number(HVACProofreader)
    new_project_payout.hvac_reviewer_payout = Number(HVACReviewer)
    new_project_payout.hvac_approver_payout = Number(HVACApprover)
    new_project_payout.low_voltage_pm_payout = Number(lowVoltagePM)
    new_project_payout.low_voltage_pm_assistant_payout = Number(lowVoltageAssistant)
    new_project_payout.low_voltage_designer_payout = Number(lowVoltageDesigner)
    new_project_payout.low_voltage_drafter_payout = Number(lowVoltageDrafter)
    new_project_payout.low_voltage_design_post_service_payout = Number(lowVoltagePostService)
    new_project_payout.low_voltage_proofreader_payout = Number(lowVoltageProofreader)
    new_project_payout.low_voltage_reviewer_payout = Number(lowVoltageReviewer)
    new_project_payout.low_voltage_approver_payout = Number(lowVoltageApprover)

    if (existing_project_payout) {
      Object.keys(existing_project_payout).forEach(key => {
          if (key.endsWith('_id') && existing_project_payout[key] !== null) {
              new_project_payout[key] = existing_project_payout[key];
          }
      });
    } 
    const fields= projectPayoutToFormData(new_project_payout)
    setDataSource(projectPayoutToDataSource(new_project_payout))
    formPayout.setFieldsValue(fields)
    handleFormValuesChange(fields,fields)
      
  }
  

  // Modify the defaultColumns array
  const defaultColumns = [
    {
      title: "专业分类",
      dataIndex: "category",
      width: 60,
      rowScope: 'row',
      editable: false,
      colSpan: 2,
      onCell: (_:any, index:number) => {
        if (index %2===0) {
          return { rowSpan: 2 };
        }else{
          return {rowSpan:0}
        }
      },
    },
    {
      title: "",//being colSpan to 专业分类
      dataIndex: "text",
      width: 60,
      colSpan:0,
      editable: false,
    },
    {
      title: "施工图设计",
      dataIndex: "age",
      width: 800,
      editable: false,
      children: [
        {
          title: "专业负责人",
          dataIndex: "pm",
          editable: true,
          width: 100,
        },
        {
          title: "专业负责人助理",
          dataIndex: "pm_assistant",
          editable: true,
          width: 100,
        },
        {
          title: "设计",
          dataIndex: "designer",
          editable: true,
          width: 100,
        },
        {
          title: "施工图",
          dataIndex: "drafter",
          editable: true,
          width: 100,
        },
        {
          title: "后期服务",
          dataIndex: "post_service",
          editable: true,
          width: 100,
        },
        {
          title: "校对",
          dataIndex: "proofreader",
          editable: true,
          width: 100,
        },
        {
          title: "审核",
          dataIndex: "reviewer",
          editable: true,
          width: 100,
        },
        {
          title: "审定",
          dataIndex: "approver",
          editable: true,
          width: 100,
        },
      ],
    },
    {
      title: "小计",
      dataIndex: "subtotal",
      width: 100,
      render: (_, record, index) => {
        if (record.text === '产值') {
          const formValues = formPayout.getFieldsValue();
          return calculateRowSum(record.category, formValues);
        }
        return null;
      },
      onCell: (record: DataType, index: number) => {
        const cellProps = {} as any;
        if (index % 2 === 1) { // Display on '产值' rows
          cellProps.rowSpan = 1;
        } else {
          cellProps.rowSpan = 0;
        }
        return cellProps;
      },
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);

    // Update form values
    const formValues = formPayout.getFieldsValue();
    formValues[`${row.category}${row.text}`] = row;
    formPayout.setFieldsValue(formValues);
  };

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };

  // const columns = defaultColumns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: DataType) => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       handleSave,
  //     }),
  //   };
  // });
  const columns = defaultColumns.map((col) => {
    
    if (!col.editable) {
      if (col.children) {
        return {
          ...col,
          children: col.children.map((child) => ({
            ...child,
            onCell: (record: DataType, rowIndex:number,columnIndex:number) => ({
              record,
              editable: child.editable === true, // Set editable for specific child column
              dataIndex: child.dataIndex,
              title: child.title,
              rowIndex,
              columnIndex,
              departments: departments,
              workLocations: workLocations,
              form: formPayout,
              handleSave,
              existing_project_payout,
            }),
          })),
        };
      }
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType, rowIndex:number) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        rowIndex,
        handleSave,
      }),
    };
  });


  // Modify the handleFormValuesChange function
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const newDataSource = [...dataSource];
  
    Object.entries(changedValues).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const category = key.includes('设计人') ? key.replace('设计人','') : key.replace('产值','');
        const text = key.includes('设计人') ? '设计人' : '产值';
        const index = newDataSource.findIndex(item => item.category === category && item.text === text);
        
        if (index !== -1) {
          newDataSource[index] = {
            ...newDataSource[index],
            ...value,
          };
        }
      }
    });

    // Update pm and pmAssistant separately
    const pmIndex = newDataSource.findIndex(item => item.category === '项目负责' && item.text === '设计人');
    if (pmIndex !== -1) {
      newDataSource[pmIndex].pm = allValues.pm ? parseInt(allValues.pm, 10) : '';
    }
  
    const pmAssistantIndex = newDataSource.findIndex(item => item.category === '项目负责' && item.text === '设计人');
    if (pmAssistantIndex !== -1) {
      newDataSource[pmAssistantIndex].pm_assistant = allValues.pmAssistant ? parseInt(allValues.pmAssistant, 10) : '';
    }
  
    setDataSource(newDataSource);

    // Calculate and update the total sum
    const totalSum = calculateTotalSum(allValues);
    setTotalSum(totalSum);
    // Check if the total sum matches the calculated employee payout
    setIsSumValid(Math.abs(totalSum - project.calculated_employee_payout) < 0.001);
  };


  const onSelectPm = async (data: string) => {
    const person = pmOptions.find((value) => value.id === parseInt(data));
    if (person) {
      setPmName(person.name);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setPmOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }
      formPayout.setFieldValue('pm', person.id);
    }
  };

  const onSearchPm = async (searchText: string) => {
    if (searchText === "") {
      setPmOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        }
      })
      if (response.data) {
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,
          label: employee.name,
          value: employee.id
        }));
        setPmOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSelectPmAssistant = async (data: string) => {
    const person = pmAssistantOptions.find((value) => value.id === parseInt(data));
    if (person) {
      setPmAssistantName(person.name);
      const response = await EmployeeService.getEmployeeById({
        path: { id: person.id }
      })
      if(response.data){
        setPmAssistantOptions([{
          ...response.data,
          label: response.data.name,
          value: response.data.id
        }])
      }
      formPayout.setFieldValue('pmAssistant', person.id);
    }
  };

  const onSearchPmAssistant = async (searchText: string) => {
    if (searchText === "") {
      setPmAssistantOptions([])
      return
    }
    try {
      const response = await EmployeeService.searchEmployee({
        path: {
          query: searchText
        }
      })
      if (response.data) {
        const formattedOptions = response.data.data.map((employee: EmployeePublicOut) => ({
          ...employee,
          label: employee.name,
          value: employee.id
        }));
        setPmAssistantOptions(formattedOptions)
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) return <Skeleton active />

  return (
    <div>
      {contextHolder}
      <Space direction="vertical" size="large" style={{ display: 'flex' }}> 
          <h2 style={{ marginTop: 0 }}>
            <Space>
              下发产值表
              {existing_project_payout?.update_required_project_updated && (
                <Tooltip title="项目下发产值在上次产值计算后修改过。请重新计算产值并保存。重新计算之前将无法进行回款登记。">
                <InfoCircleOutlined style={{color:'orange'}}/>
                    </Tooltip>
              )}
            </Space>
          </h2>
        <Space size="middle">
          <Select
            value={selectedProfileId}
            onChange={handleProfileSelect}
            style={{ width: 300 }}
            placeholder="选择下发配置"
            options={
              profiles.length > 0
                ? [
                    {
                      label: "活跃",
                      title: "not_hidden",
                      options: profiles
                        .filter((profile) => !profile.hidden)
                        .map((profile) => ({
                          value: profile.id,
                          label: (
                            <span>
                              {profile.name}
                              {!profile.is_in_use && (
                                <Tag style={{ marginLeft: "8px" }}>无项目</Tag>
                              )}
                            </span>
                          ),
                          disabled: false,
                        })),
                    },
                  ]
                : [
                    {
                      label: "无配置",
                      title: "no_profiles",
                      options: [
                        {
                          value: "no_profiles",
                          label: "系统内无配置",
                          disabled: true,
                        },
                      ],
                    },
                  ]
            }
          />
          <Button type="primary" disabled={selectedProfileId===undefined ? true : false} onClick={generatePayout}>
            计算产值
          </Button>
          {usedDepartmentPayoutRatioId === 99 && (
            <Tooltip title={`当前工程为非正规工程，或项目工程等级和系数调整级别没有对应的部门工比，无法自动计算产值，请手动填入。`}>
              <InfoCircleOutlined style={{ marginLeft: '4px', color: 'orange' }}/>
            </Tooltip>
          )}
        </Space>
          
        {togglePayoutTable &&
          
          <Form form={formPayout} onFinish={handlePayoutFinish} onValuesChange={handleFormValuesChange}>
            {/* <Space style={{display:'flex', width: '100%', justifyContent:'start', alignContent:'center'}}>
              <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(formPayout.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(dataSource, null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
            </Space> */}
         
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="项目负责人" name="pm"  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value) => 
                        validateEmployee(
                          _, 
                          value, 
                          getFieldValue('pmPayout')
                        )
                      })
                    ]}>
                    <Select
                      showSearch
                      filterOption={false}
                      value={pmName === '' ? undefined : pmName}
                      options={pmOptions.map((option) => ({
                        key: option.id,
                        value: option.id,
                        label: (
                          <Space size={1} align="end">
                            <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                          </Space>
                        )
                      }))}
                      onSelect={onSelectPm}
                      onSearch={onSearchPm}
                      notFoundContent={pmName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
                      allowClear={true}
                      popupMatchSelectWidth={false}
                      placeholder={`模糊搜索员工`}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item 
                  label={
                    <>
                      项目负责人产值
                      {Math.abs(inaccuracy) > 0.001 && (
                        <Tooltip title={`四舍五入后与下发产值的差（${inaccuracy.toFixed(2)}）已计入项目负责人产值，如项目无项目负责人，请手动修改`}>
                          <InfoCircleOutlined style={{ marginLeft: '4px', color: 'orange' }}/>
                        </Tooltip>
                      )}
                    </>
                  } 
                  name='pmPayout'>
                  <Input placeholder="输入产值" />
                </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="项目负责人助理" name='pmAssistant'  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value) => 
                        validateEmployee(
                          _, 
                          value, 
                          getFieldValue('pmAssistantPayout')
                        )
                      })
                    ]}>
                    <Select
                      showSearch
                      filterOption={false}
                      value={pmAssistantName === '' ? undefined : pmAssistantName}
                      options={pmAssistantOptions.map((option) => ({
                        key: option.id,
                        value: option.id,
                        label: (
                          <Space size={1} align="end">
                            <div style={{ textAlign:'center', flex:'2 1 100px'}}>{option.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{departments.find((dept) => dept.id === option.department_id)?.name}</div>
                            <Divider type="vertical" style={{width:'1px'}}/>
                            <div style={{ textAlign:'center',flex:'1 1 100px'}}>{workLocations.find((wl)=>wl.id===option.work_location_id)?.name}</div>
                          </Space>
                        )
                      }))}
                      onSelect={onSelectPmAssistant}
                      onSearch={onSearchPmAssistant}
                      notFoundContent={pmAssistantName === '' ? <div>输入员工姓名或拼音来开始搜索</div> : <div>没有员工满足搜索条件</div>}
                      allowClear={true}
                      popupMatchSelectWidth={false}
                      placeholder={`模糊搜索员工`}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>

                  <Form.Item label="项目负责人助理产值" name='pmAssistantPayout'>
                    
                    <Input placeholder="输入产值" />
                  </Form.Item>
                </Col>
              </Row>

              <EditableContext.Provider value={formPayout}>
              
                <Table<DataType>
                  components={components}
                  rowClassName={() => "editable-row"}
                  bordered
                  dataSource={dataSource}
                  columns={columns as ColumnTypes}
                  pagination={false}
                  size="small"
                />
              </EditableContext.Provider>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text strong style={{ marginRight: '10px' }}>总计:</Text>
                <Text 
                  strong 
                  style={{ 
                    fontSize: '18px', 
                    color: isSumValid ? 'inherit' : 'red' 
                  }}
                >
                  {calculateTotalSum(formPayout.getFieldsValue()).toFixed(2)}
                </Text>
                {!isSumValid && (
                  <Text type="danger" style={{ marginLeft: '10px' }}>
                    与下发产值不符
                  </Text>
                )}
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  提交产值表
                </Button>
              </Form.Item>
              
            </Space>
            
          </Form>
        }
            
      </Space>
      

    </div>
  );
};


