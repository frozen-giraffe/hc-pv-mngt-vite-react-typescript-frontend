export type Body_Login_login_access_token = {
	grant_type?: string | null;
	username: string;
	password: string;
	scope?: string;
	client_id?: string | null;
	client_secret?: string | null;
};



export type BuildingStructureTypeCreateIn = {
	name: string;
};



export type BuildingStructureTypePublicOut = {
	name: string;
	id: number;
};



export type BuildingStructureTypeUpdateIn = {
	name?: string | null;
};



export type BuildingStructureTypesPublicOut = {
	data: Array<BuildingStructureTypePublicOut>;
	count: number;
};



export type BuildingTypeCreateIn = {
	name: string;
};



export type BuildingTypePublicOut = {
	name: string;
	id: number;
};



export type BuildingTypeUpdateIn = {
	name?: string | null;
};



export type BuildingTypesPublicOut = {
	data: Array<BuildingTypePublicOut>;
	count: number;
};



export type ContractPaymentCreateIn = {
	payment_date: string;
	amount: number;
	processed_by_id: number;
	notes?: string | null;
	project_payout_id: number;
};



export type ContractPaymentPayout = {
	project_payout_id: number;
	contract_payment_id: number;
	employee_id: number;
	employee_payout_amount: number;
	id?: number;
};



export type ContractPaymentPublicOut = {
	payment_date: string;
	amount: number;
	processed_by_id: number;
	notes?: string | null;
	id: number;
	contract_payment_payouts?: Array<ContractPaymentPayout> | null;
	paid_ratio: number;
	project_id: number;
	project_payout_id: number;
	payout_amount: number;
};



export type ContractPaymentUpdateIn = {
	payment_date?: string | null;
	amount?: number | null;
	processed_by_id?: number | null;
	notes?: string | null;
};



export type ContractPaymentsPublicOut = {
	data: Array<ContractPaymentPublicOut>;
	count: number;
};



export type DepartmentPayoutRatioPublicOut = {
	project_class_id: number;
	project_rate_adjustment_class_id: number;
	pm_ratio: number;
	arch_ratio: number;
	struct_ratio: number;
	plumbing_ratio: number;
	electrical_ratio: number;
	hvac_ratio: number;
	low_voltage_ratio: number;
	id: number;
	modified_at: string;
};



/**
 * 除了project_class_id和project_rate_adjustment_class_id, 其他字段都允许修改
 */
export type DepartmentPayoutRatioUpdateIn = {
	project_class_id: number;
	project_rate_adjustment_class_id: number;
	pm_ratio?: number | null;
	arch_ratio?: number | null;
	struct_ratio?: number | null;
	plumbing_ratio?: number | null;
	electrical_ratio?: number | null;
	hvac_ratio?: number | null;
	low_voltage_ratio?: number | null;
	modified_at?: string;
};



export type DepartmentPayoutRatiosPublicOut = {
	data: Array<DepartmentPayoutRatioPublicOut>;
	count: number;
};



export type DepartmentPublicOut = {
	name: string;
	description?: string | null;
	id: number;
};



export type DepartmentsPublicOut = {
	data: Array<DepartmentPublicOut>;
	count: number;
};



export type EmployStatusCreateIn = {
	name: string;
	description?: string | null;
};



export type EmployStatusPublicOut = {
	name: string;
	description?: string | null;
	id: number;
};



export type EmployStatusUpdateIn = {
	name?: string | null;
	description?: string | null;
};



export type EmployStatusesPublicOut = {
	data: Array<EmployStatusPublicOut>;
	count: number;
};



export type EmployeeCreateIn = {
	name: string;
	gov_id?: string | null;
	gender?: string | null;
	department_id?: number | null;
	work_location_id?: number | null;
	employee_title_id?: number | null;
	professional_title_id?: number | null;
	employ_status_id: number;
	birth_date?: string | null;
	initial?: string | null;
	pinyin?: string | null;
};



export type EmployeePublicOut = {
	name: string;
	gov_id?: string | null;
	gender?: string | null;
	department_id?: number | null;
	work_location_id?: number | null;
	employee_title_id?: number | null;
	professional_title_id?: number | null;
	employ_status_id: number;
	birth_date?: string | null;
	initial: string;
	pinyin: string;
	id: number;
};



export type EmployeeTitleCreateIn = {
	name: string;
	description?: string | null;
};



export type EmployeeTitlePublicOut = {
	name: string;
	description?: string | null;
	id: number;
};



export type EmployeeTitleUpdateIn = {
	name?: string | null;
	description?: string | null;
};



export type EmployeeTitlesPublicOut = {
	data: Array<EmployeeTitlePublicOut>;
	count: number;
};



export type EmployeeUpdateIn = {
	name?: string | null;
	gov_id?: string | null;
	gender?: string | null;
	department_id?: number | null;
	work_location_id?: number | null;
	employee_title_id?: number | null;
	professional_title_id?: number | null;
	employ_status_id?: number | null;
	birth_date?: string | null;
	initial?: string | null;
	pinyin?: string | null;
};



export type EmployeesPublicOut = {
	data: Array<EmployeePublicOut>;
	count: number;
};



export type ErrorResponse = {
	detail: string;
};



export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};



export type ItemCreateIn = {
	title: string;
	description?: string | null;
};



export type ItemPublicOut = {
	title: string;
	description?: string | null;
	id: number;
	owner_id: number;
};



export type ItemUpdateIn = {
	title?: string | null;
	description?: string | null;
};



export type ItemsPublicOut = {
	data: Array<ItemPublicOut>;
	count: number;
};



/**
 * 除hidden外必须提供所有字段
 */
export type JobPayoutRatioProfileCreateIn = {
	name: string;
	hidden?: boolean | null;
	pm_ratio: number;
	pm_assistant_ratio: number;
	arch_pm_ratio: number;
	arch_pm_assistant_ratio: number;
	arch_designer_ratio: number;
	arch_drafter_ratio: number;
	arch_design_post_service_ratio: number;
	arch_proofreader_ratio: number;
	arch_reviewer_ratio: number;
	arch_approver_ratio: number;
	struct_pm_ratio: number;
	struct_pm_assistant_ratio: number;
	struct_designer_ratio: number;
	struct_drafter_ratio: number;
	struct_design_post_service_ratio: number;
	struct_proofreader_ratio: number;
	struct_reviewer_ratio: number;
	struct_approver_ratio: number;
	plumbing_pm_ratio: number;
	plumbing_pm_assistant_ratio: number;
	plumbing_designer_ratio: number;
	plumbing_drafter_ratio: number;
	plumbing_design_post_service_ratio: number;
	plumbing_proofreader_ratio: number;
	plumbing_reviewer_ratio: number;
	plumbing_approver_ratio: number;
	electrical_pm_ratio: number;
	electrical_pm_assistant_ratio: number;
	electrical_designer_ratio: number;
	electrical_drafter_ratio: number;
	electrical_design_post_service_ratio: number;
	electrical_reviewer_ratio: number;
	electrical_proofreader_ratio: number;
	electrical_approver_ratio: number;
	hvac_pm_ratio: number;
	hvac_pm_assistant_ratio: number;
	hvac_designer_ratio: number;
	hvac_drafter_ratio: number;
	hvac_design_post_service_ratio: number;
	hvac_proofreader_ratio: number;
	hvac_reviewer_ratio: number;
	hvac_approver_ratio: number;
	low_voltage_pm_ratio: number;
	low_voltage_pm_assistant_ratio: number;
	low_voltage_designer_ratio: number;
	low_voltage_drafter_ratio: number;
	low_voltage_design_post_service_ratio: number;
	low_voltage_proofreader_ratio: number;
	low_voltage_reviewer_ratio: number;
	low_voltage_approver_ratio: number;
};



export type JobPayoutRatioProfilePublicOut = {
	name: string;
	hidden: boolean;
	pm_ratio: number;
	pm_assistant_ratio: number;
	arch_pm_ratio: number;
	arch_pm_assistant_ratio: number;
	arch_designer_ratio: number;
	arch_drafter_ratio: number;
	arch_design_post_service_ratio: number;
	arch_proofreader_ratio: number;
	arch_reviewer_ratio: number;
	arch_approver_ratio: number;
	struct_pm_ratio: number;
	struct_pm_assistant_ratio: number;
	struct_designer_ratio: number;
	struct_drafter_ratio: number;
	struct_design_post_service_ratio: number;
	struct_proofreader_ratio: number;
	struct_reviewer_ratio: number;
	struct_approver_ratio: number;
	plumbing_pm_ratio: number;
	plumbing_pm_assistant_ratio: number;
	plumbing_designer_ratio: number;
	plumbing_drafter_ratio: number;
	plumbing_design_post_service_ratio: number;
	plumbing_proofreader_ratio: number;
	plumbing_reviewer_ratio: number;
	plumbing_approver_ratio: number;
	electrical_pm_ratio: number;
	electrical_pm_assistant_ratio: number;
	electrical_designer_ratio: number;
	electrical_drafter_ratio: number;
	electrical_design_post_service_ratio: number;
	electrical_reviewer_ratio: number;
	electrical_proofreader_ratio: number;
	electrical_approver_ratio: number;
	hvac_pm_ratio: number;
	hvac_pm_assistant_ratio: number;
	hvac_designer_ratio: number;
	hvac_drafter_ratio: number;
	hvac_design_post_service_ratio: number;
	hvac_proofreader_ratio: number;
	hvac_reviewer_ratio: number;
	hvac_approver_ratio: number;
	low_voltage_pm_ratio: number;
	low_voltage_pm_assistant_ratio: number;
	low_voltage_designer_ratio: number;
	low_voltage_drafter_ratio: number;
	low_voltage_design_post_service_ratio: number;
	low_voltage_proofreader_ratio: number;
	low_voltage_reviewer_ratio: number;
	low_voltage_approver_ratio: number;
	id: number;
	updated_at: string;
	is_in_use: boolean;
};



/**
 * 除了name和hidden, 其他字段都不允许修改
 */
export type JobPayoutRatioProfileUpdateIn = {
	name?: string | null;
	hidden?: boolean | null;
	pm_ratio?: number | null;
	pm_assistant_ratio?: number | null;
	arch_pm_ratio?: number | null;
	arch_pm_assistant_ratio?: number | null;
	arch_designer_ratio?: number | null;
	arch_drafter_ratio?: number | null;
	arch_design_post_service_ratio?: number | null;
	arch_proofreader_ratio?: number | null;
	arch_reviewer_ratio?: number | null;
	arch_approver_ratio?: number | null;
	struct_pm_ratio?: number | null;
	struct_pm_assistant_ratio?: number | null;
	struct_designer_ratio?: number | null;
	struct_drafter_ratio?: number | null;
	struct_design_post_service_ratio?: number | null;
	struct_proofreader_ratio?: number | null;
	struct_reviewer_ratio?: number | null;
	struct_approver_ratio?: number | null;
	plumbing_pm_ratio?: number | null;
	plumbing_pm_assistant_ratio?: number | null;
	plumbing_designer_ratio?: number | null;
	plumbing_drafter_ratio?: number | null;
	plumbing_design_post_service_ratio?: number | null;
	plumbing_proofreader_ratio?: number | null;
	plumbing_reviewer_ratio?: number | null;
	plumbing_approver_ratio?: number | null;
	electrical_pm_ratio?: number | null;
	electrical_pm_assistant_ratio?: number | null;
	electrical_designer_ratio?: number | null;
	electrical_drafter_ratio?: number | null;
	electrical_design_post_service_ratio?: number | null;
	electrical_reviewer_ratio?: number | null;
	electrical_proofreader_ratio?: number | null;
	electrical_approver_ratio?: number | null;
	hvac_pm_ratio?: number | null;
	hvac_pm_assistant_ratio?: number | null;
	hvac_designer_ratio?: number | null;
	hvac_drafter_ratio?: number | null;
	hvac_design_post_service_ratio?: number | null;
	hvac_proofreader_ratio?: number | null;
	hvac_reviewer_ratio?: number | null;
	hvac_approver_ratio?: number | null;
	low_voltage_pm_ratio?: number | null;
	low_voltage_pm_assistant_ratio?: number | null;
	low_voltage_designer_ratio?: number | null;
	low_voltage_drafter_ratio?: number | null;
	low_voltage_design_post_service_ratio?: number | null;
	low_voltage_proofreader_ratio?: number | null;
	low_voltage_reviewer_ratio?: number | null;
	low_voltage_approver_ratio?: number | null;
};



export type JobPayoutRatioProfilesPublicOut = {
	data: Array<JobPayoutRatioProfilePublicOut>;
	count: number;
};



export type Message = {
	message: string;
};



export type NewPassword = {
	token: string;
	new_password: string;
};



export type ProdValueCalcRatioCreateIn = {
	name: string;
	ratio: number;
	default?: boolean;
};



export type ProdValueCalcRatioPublicOut = {
	name: string;
	ratio: number;
	id: number;
	default: boolean;
};



export type ProdValueCalcRatioUpdateIn = {
	name?: string | null;
	ratio?: number | null;
	default?: boolean | null;
};



export type ProdValueCalcRatiosPublicOut = {
	data: Array<ProdValueCalcRatioPublicOut>;
	count: number;
};



export type ProfessionalTitleCreateIn = {
	name: string;
	description?: string | null;
};



export type ProfessionalTitlePublicOut = {
	name: string;
	description?: string | null;
	id: number;
};



export type ProfessionalTitleUpdateIn = {
	name?: string | null;
	description?: string | null;
};



export type ProfessionalTitlesPublicOut = {
	data: Array<ProfessionalTitlePublicOut>;
	count: number;
};



export type ProjectClassCreateIn = {
	name: string;
};



export type ProjectClassPublicOut = {
	name: string;
	id: number;
};



export type ProjectClassUpdateIn = {
	name?: string | null;
};



export type ProjectClassesPublicOut = {
	data: Array<ProjectClassPublicOut>;
	count: number;
};



export type ProjectCreateIn = {
	project_code: string;
	name: string;
	project_year: number;
	project_type_id: number;
	building_type_id: number;
	project_task_type_id: number;
	project_class_id: number;
	building_structure_type_id: number;
	project_rate_adjustment_class_id: number;
	quality_ratio_class_id: number;
	project_area?: number | null;
	project_construction_cost?: number | null;
	calculated_employee_payout: number;
	project_contract_value: number;
	notes?: string | null;
};



export type ProjectPayoutCreateIn = {
	project_id: number;
	pm_id?: number | null;
	pm_payout?: number | null;
	pm_assistant_id?: number | null;
	pm_assistant_payout?: number | null;
	arch_pm_id?: number | null;
	arch_pm_payout?: number | null;
	arch_pm_assistant_id?: number | null;
	arch_pm_assistant_payout?: number | null;
	arch_designer_id?: number | null;
	arch_designer_payout?: number | null;
	arch_drafter_id?: number | null;
	arch_drafter_payout?: number | null;
	arch_design_post_service_id?: number | null;
	arch_design_post_service_payout?: number | null;
	arch_proofreader_id?: number | null;
	arch_proofreader_payout?: number | null;
	arch_reviewer_id?: number | null;
	arch_reviewer_payout?: number | null;
	arch_approver_id?: number | null;
	arch_approver_payout?: number | null;
	struct_pm_id?: number | null;
	struct_pm_payout?: number | null;
	struct_pm_assistant_id?: number | null;
	struct_pm_assistant_payout?: number | null;
	struct_designer_id?: number | null;
	struct_designer_payout?: number | null;
	struct_drafter_id?: number | null;
	struct_drafter_payout?: number | null;
	struct_design_post_service_id?: number | null;
	struct_design_post_service_payout?: number | null;
	struct_proofreader_id?: number | null;
	struct_proofreader_payout?: number | null;
	struct_reviewer_id?: number | null;
	struct_reviewer_payout?: number | null;
	struct_approver_id?: number | null;
	struct_approver_payout?: number | null;
	plumbing_pm_id?: number | null;
	plumbing_pm_payout?: number | null;
	plumbing_pm_assistant_id?: number | null;
	plumbing_pm_assistant_payout?: number | null;
	plumbing_designer_id?: number | null;
	plumbing_designer_payout?: number | null;
	plumbing_drafter_id?: number | null;
	plumbing_drafter_payout?: number | null;
	plumbing_design_post_service_id?: number | null;
	plumbing_design_post_service_payout?: number | null;
	plumbing_proofreader_id?: number | null;
	plumbing_proofreader_payout?: number | null;
	plumbing_reviewer_id?: number | null;
	plumbing_reviewer_payout?: number | null;
	plumbing_approver_id?: number | null;
	plumbing_approver_payout?: number | null;
	electrical_pm_id?: number | null;
	electrical_pm_payout?: number | null;
	electrical_pm_assistant_id?: number | null;
	electrical_pm_assistant_payout?: number | null;
	electrical_designer_id?: number | null;
	electrical_designer_payout?: number | null;
	electrical_drafter_id?: number | null;
	electrical_drafter_payout?: number | null;
	electrical_design_post_service_id?: number | null;
	electrical_design_post_service_payout?: number | null;
	electrical_reviewer_id?: number | null;
	electrical_reviewer_payout?: number | null;
	electrical_proofreader_id?: number | null;
	electrical_proofreader_payout?: number | null;
	electrical_approver_id?: number | null;
	electrical_approver_payout?: number | null;
	hvac_pm_id?: number | null;
	hvac_pm_payout?: number | null;
	hvac_pm_assistant_id?: number | null;
	hvac_pm_assistant_payout?: number | null;
	hvac_designer_id?: number | null;
	hvac_designer_payout?: number | null;
	hvac_drafter_id?: number | null;
	hvac_drafter_payout?: number | null;
	hvac_design_post_service_id?: number | null;
	hvac_design_post_service_payout?: number | null;
	hvac_proofreader_id?: number | null;
	hvac_proofreader_payout?: number | null;
	hvac_reviewer_id?: number | null;
	hvac_reviewer_payout?: number | null;
	hvac_approver_id?: number | null;
	hvac_approver_payout?: number | null;
	low_voltage_pm_id?: number | null;
	low_voltage_pm_payout?: number | null;
	low_voltage_pm_assistant_id?: number | null;
	low_voltage_pm_assistant_payout?: number | null;
	low_voltage_designer_id?: number | null;
	low_voltage_designer_payout?: number | null;
	low_voltage_drafter_id?: number | null;
	low_voltage_drafter_payout?: number | null;
	low_voltage_design_post_service_id?: number | null;
	low_voltage_design_post_service_payout?: number | null;
	low_voltage_proofreader_id?: number | null;
	low_voltage_proofreader_payout?: number | null;
	low_voltage_reviewer_id?: number | null;
	low_voltage_reviewer_payout?: number | null;
	low_voltage_approver_id?: number | null;
	low_voltage_approver_payout?: number | null;
	manually_modified?: boolean;
	job_payout_ratio_profile_id: number;
	department_payout_ratio_id?: number | null;
};



export type ProjectPayoutPublicOut = {
	project_id: number;
	pm_id?: number | null;
	pm_payout?: number | null;
	pm_assistant_id?: number | null;
	pm_assistant_payout?: number | null;
	arch_pm_id?: number | null;
	arch_pm_payout?: number | null;
	arch_pm_assistant_id?: number | null;
	arch_pm_assistant_payout?: number | null;
	arch_designer_id?: number | null;
	arch_designer_payout?: number | null;
	arch_drafter_id?: number | null;
	arch_drafter_payout?: number | null;
	arch_design_post_service_id?: number | null;
	arch_design_post_service_payout?: number | null;
	arch_proofreader_id?: number | null;
	arch_proofreader_payout?: number | null;
	arch_reviewer_id?: number | null;
	arch_reviewer_payout?: number | null;
	arch_approver_id?: number | null;
	arch_approver_payout?: number | null;
	struct_pm_id?: number | null;
	struct_pm_payout?: number | null;
	struct_pm_assistant_id?: number | null;
	struct_pm_assistant_payout?: number | null;
	struct_designer_id?: number | null;
	struct_designer_payout?: number | null;
	struct_drafter_id?: number | null;
	struct_drafter_payout?: number | null;
	struct_design_post_service_id?: number | null;
	struct_design_post_service_payout?: number | null;
	struct_proofreader_id?: number | null;
	struct_proofreader_payout?: number | null;
	struct_reviewer_id?: number | null;
	struct_reviewer_payout?: number | null;
	struct_approver_id?: number | null;
	struct_approver_payout?: number | null;
	plumbing_pm_id?: number | null;
	plumbing_pm_payout?: number | null;
	plumbing_pm_assistant_id?: number | null;
	plumbing_pm_assistant_payout?: number | null;
	plumbing_designer_id?: number | null;
	plumbing_designer_payout?: number | null;
	plumbing_drafter_id?: number | null;
	plumbing_drafter_payout?: number | null;
	plumbing_design_post_service_id?: number | null;
	plumbing_design_post_service_payout?: number | null;
	plumbing_proofreader_id?: number | null;
	plumbing_proofreader_payout?: number | null;
	plumbing_reviewer_id?: number | null;
	plumbing_reviewer_payout?: number | null;
	plumbing_approver_id?: number | null;
	plumbing_approver_payout?: number | null;
	electrical_pm_id?: number | null;
	electrical_pm_payout?: number | null;
	electrical_pm_assistant_id?: number | null;
	electrical_pm_assistant_payout?: number | null;
	electrical_designer_id?: number | null;
	electrical_designer_payout?: number | null;
	electrical_drafter_id?: number | null;
	electrical_drafter_payout?: number | null;
	electrical_design_post_service_id?: number | null;
	electrical_design_post_service_payout?: number | null;
	electrical_reviewer_id?: number | null;
	electrical_reviewer_payout?: number | null;
	electrical_proofreader_id?: number | null;
	electrical_proofreader_payout?: number | null;
	electrical_approver_id?: number | null;
	electrical_approver_payout?: number | null;
	hvac_pm_id?: number | null;
	hvac_pm_payout?: number | null;
	hvac_pm_assistant_id?: number | null;
	hvac_pm_assistant_payout?: number | null;
	hvac_designer_id?: number | null;
	hvac_designer_payout?: number | null;
	hvac_drafter_id?: number | null;
	hvac_drafter_payout?: number | null;
	hvac_design_post_service_id?: number | null;
	hvac_design_post_service_payout?: number | null;
	hvac_proofreader_id?: number | null;
	hvac_proofreader_payout?: number | null;
	hvac_reviewer_id?: number | null;
	hvac_reviewer_payout?: number | null;
	hvac_approver_id?: number | null;
	hvac_approver_payout?: number | null;
	low_voltage_pm_id?: number | null;
	low_voltage_pm_payout?: number | null;
	low_voltage_pm_assistant_id?: number | null;
	low_voltage_pm_assistant_payout?: number | null;
	low_voltage_designer_id?: number | null;
	low_voltage_designer_payout?: number | null;
	low_voltage_drafter_id?: number | null;
	low_voltage_drafter_payout?: number | null;
	low_voltage_design_post_service_id?: number | null;
	low_voltage_design_post_service_payout?: number | null;
	low_voltage_proofreader_id?: number | null;
	low_voltage_proofreader_payout?: number | null;
	low_voltage_reviewer_id?: number | null;
	low_voltage_reviewer_payout?: number | null;
	low_voltage_approver_id?: number | null;
	low_voltage_approver_payout?: number | null;
	id: number;
	created_at: string;
	calculation_updated_at: string;
	people_updated_at: string;
	contract_payment_payout_started: boolean;
	update_required_project_updated: boolean;
	department_payout_ratio_used_outdated: boolean;
	job_payout_ratio_profile_used_outdated: boolean;
};



export type ProjectPayoutUpdateIn = {
	project_id: null;
	pm_id?: number | null;
	pm_payout?: number | null;
	pm_assistant_id?: number | null;
	pm_assistant_payout?: number | null;
	arch_pm_id?: number | null;
	arch_pm_payout?: number | null;
	arch_pm_assistant_id?: number | null;
	arch_pm_assistant_payout?: number | null;
	arch_designer_id?: number | null;
	arch_designer_payout?: number | null;
	arch_drafter_id?: number | null;
	arch_drafter_payout?: number | null;
	arch_design_post_service_id?: number | null;
	arch_design_post_service_payout?: number | null;
	arch_proofreader_id?: number | null;
	arch_proofreader_payout?: number | null;
	arch_reviewer_id?: number | null;
	arch_reviewer_payout?: number | null;
	arch_approver_id?: number | null;
	arch_approver_payout?: number | null;
	struct_pm_id?: number | null;
	struct_pm_payout?: number | null;
	struct_pm_assistant_id?: number | null;
	struct_pm_assistant_payout?: number | null;
	struct_designer_id?: number | null;
	struct_designer_payout?: number | null;
	struct_drafter_id?: number | null;
	struct_drafter_payout?: number | null;
	struct_design_post_service_id?: number | null;
	struct_design_post_service_payout?: number | null;
	struct_proofreader_id?: number | null;
	struct_proofreader_payout?: number | null;
	struct_reviewer_id?: number | null;
	struct_reviewer_payout?: number | null;
	struct_approver_id?: number | null;
	struct_approver_payout?: number | null;
	plumbing_pm_id?: number | null;
	plumbing_pm_payout?: number | null;
	plumbing_pm_assistant_id?: number | null;
	plumbing_pm_assistant_payout?: number | null;
	plumbing_designer_id?: number | null;
	plumbing_designer_payout?: number | null;
	plumbing_drafter_id?: number | null;
	plumbing_drafter_payout?: number | null;
	plumbing_design_post_service_id?: number | null;
	plumbing_design_post_service_payout?: number | null;
	plumbing_proofreader_id?: number | null;
	plumbing_proofreader_payout?: number | null;
	plumbing_reviewer_id?: number | null;
	plumbing_reviewer_payout?: number | null;
	plumbing_approver_id?: number | null;
	plumbing_approver_payout?: number | null;
	electrical_pm_id?: number | null;
	electrical_pm_payout?: number | null;
	electrical_pm_assistant_id?: number | null;
	electrical_pm_assistant_payout?: number | null;
	electrical_designer_id?: number | null;
	electrical_designer_payout?: number | null;
	electrical_drafter_id?: number | null;
	electrical_drafter_payout?: number | null;
	electrical_design_post_service_id?: number | null;
	electrical_design_post_service_payout?: number | null;
	electrical_reviewer_id?: number | null;
	electrical_reviewer_payout?: number | null;
	electrical_proofreader_id?: number | null;
	electrical_proofreader_payout?: number | null;
	electrical_approver_id?: number | null;
	electrical_approver_payout?: number | null;
	hvac_pm_id?: number | null;
	hvac_pm_payout?: number | null;
	hvac_pm_assistant_id?: number | null;
	hvac_pm_assistant_payout?: number | null;
	hvac_designer_id?: number | null;
	hvac_designer_payout?: number | null;
	hvac_drafter_id?: number | null;
	hvac_drafter_payout?: number | null;
	hvac_design_post_service_id?: number | null;
	hvac_design_post_service_payout?: number | null;
	hvac_proofreader_id?: number | null;
	hvac_proofreader_payout?: number | null;
	hvac_reviewer_id?: number | null;
	hvac_reviewer_payout?: number | null;
	hvac_approver_id?: number | null;
	hvac_approver_payout?: number | null;
	low_voltage_pm_id?: number | null;
	low_voltage_pm_payout?: number | null;
	low_voltage_pm_assistant_id?: number | null;
	low_voltage_pm_assistant_payout?: number | null;
	low_voltage_designer_id?: number | null;
	low_voltage_designer_payout?: number | null;
	low_voltage_drafter_id?: number | null;
	low_voltage_drafter_payout?: number | null;
	low_voltage_design_post_service_id?: number | null;
	low_voltage_design_post_service_payout?: number | null;
	low_voltage_proofreader_id?: number | null;
	low_voltage_proofreader_payout?: number | null;
	low_voltage_reviewer_id?: number | null;
	low_voltage_reviewer_payout?: number | null;
	low_voltage_approver_id?: number | null;
	low_voltage_approver_payout?: number | null;
};



export type ProjectPayoutsPublicOut = {
	data: Array<ProjectPayoutPublicOut>;
	count: number;
};



export type ProjectPublicOut = {
	project_code: string;
	name: string;
	project_year: number;
	project_type_id: number;
	building_type_id: number;
	project_task_type_id: number;
	project_class_id: number;
	building_structure_type_id: number;
	project_rate_adjustment_class_id: number;
	quality_ratio_class_id: number;
	project_area?: number | null;
	project_construction_cost?: number | null;
	calculated_employee_payout: number;
	project_contract_value: number;
	notes?: string | null;
	id: number;
	date_added: string;
	date_modified: string;
	project_payout?: ProjectPayoutPublicOut | null;
};



export type ProjectRateAdjustmentClassCreateIn = {
	name: string;
};



export type ProjectRateAdjustmentClassPublicOut = {
	name: string;
	id: number;
};



export type ProjectRateAdjustmentClassUpdateIn = {
	name?: string | null;
};



export type ProjectRateAdjustmentClassesPublicOut = {
	data: Array<ProjectRateAdjustmentClassPublicOut>;
	count: number;
};



export type ProjectTaskTypeCreateIn = {
	name: string;
};



export type ProjectTaskTypePublicOut = {
	name: string;
	id: number;
};



export type ProjectTaskTypeUpdateIn = {
	name?: string | null;
};



export type ProjectTaskTypesPublicOut = {
	data: Array<ProjectTaskTypePublicOut>;
	count: number;
};



export type ProjectTypeCreateIn = {
	name: string;
	building_type_id: number;
	project_class_id: number;
	description?: string | null;
};



export type ProjectTypePublicOut = {
	name: string;
	building_type_id: number;
	project_class_id: number;
	description?: string | null;
	id: number;
};



export type ProjectTypeUpdateIn = {
	name?: string | null;
	building_type_id?: number | null;
	project_class_id?: number | null;
	description?: string | null;
};



export type ProjectTypesPublicOut = {
	data: Array<ProjectTypePublicOut>;
	count: number;
};



export type ProjectUpdateIn = {
	project_code?: string | null;
	name?: string | null;
	project_year?: number | null;
	project_type_id?: number | null;
	building_type_id?: number | null;
	project_task_type_id?: number | null;
	project_class_id?: number | null;
	building_structure_type_id?: number | null;
	project_rate_adjustment_class_id?: number | null;
	quality_ratio_class_id?: number | null;
	project_area?: number | null;
	project_construction_cost?: number | null;
	calculated_employee_payout?: number | null;
	project_contract_value: number;
	notes?: string | null;
};



export type ProjectsPublicOut = {
	data: Array<ProjectPublicOut>;
	count: number;
};



export type QualityRatioClassCreateIn = {
	name: string;
	ratio: number;
};



export type QualityRatioClassPublicOut = {
	name: string;
	ratio: number;
	id: number;
};



export type QualityRatioClassUpdateIn = {
	name?: string | null;
	ratio?: number | null;
};



export type QualityRatioClassesPublicOut = {
	data: Array<QualityRatioClassPublicOut>;
	count: number;
};



export type Token = {
	access_token: string;
	token_type?: string;
};



export type UpdatePassword = {
	current_password: string;
	new_password: string;
};



export type UserCreate = {
	email: string;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	password: string;
};



export type UserPublic = {
	email: string;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	id: number;
};



export type UserRegister = {
	email: string;
	password: string;
	full_name?: string | null;
};



export type UserUpdate = {
	email?: string | null;
	is_active?: boolean;
	is_superuser?: boolean;
	full_name?: string | null;
	password?: string | null;
};



export type UserUpdateMe = {
	full_name?: string | null;
	email?: string | null;
};



export type UsersPublic = {
	data: Array<UserPublic>;
	count: number;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};



export type WorkLocationCreateIn = {
	name: string;
	description?: string | null;
};



export type WorkLocationPublicOut = {
	name: string;
	description?: string | null;
	id: number;
};



export type WorkLocationUpdateIn = {
	name?: string | null;
	description?: string | null;
};



export type WorkLocationsPublicOut = {
	data: Array<WorkLocationPublicOut>;
	count: number;
};

