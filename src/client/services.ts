import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

import type { Body_Login_login_access_token,Message,NewPassword,Token,UserPublic,UpdatePassword,UserCreate,UserRegister,UsersPublic,UserUpdate,UserUpdateMe,ProjectCreateIn,ProjectPublicOut,ProjectsPublicOut,ProjectUpdateIn,ProjectTypeCreateIn,ProjectTypePublicOut,ProjectTypesPublicOut,ProjectTypeUpdateIn,BuildingTypeCreateIn,BuildingTypePublicOut,BuildingTypesPublicOut,BuildingTypeUpdateIn,ProjectTaskTypeCreateIn,ProjectTaskTypePublicOut,ProjectTaskTypesPublicOut,ProjectTaskTypeUpdateIn,ProjectClassCreateIn,ProjectClassesPublicOut,ProjectClassPublicOut,ProjectClassUpdateIn,BuildingStructureTypeCreateIn,BuildingStructureTypePublicOut,BuildingStructureTypesPublicOut,BuildingStructureTypeUpdateIn,ProjectRateAdjustmentClassCreateIn,ProjectRateAdjustmentClassesPublicOut,ProjectRateAdjustmentClassPublicOut,ProjectRateAdjustmentClassUpdateIn,QualityRatioClassCreateIn,QualityRatioClassesPublicOut,QualityRatioClassPublicOut,QualityRatioClassUpdateIn,ProdValueCalcRatioCreateIn,ProdValueCalcRatioPublicOut,ProdValueCalcRatiosPublicOut,ProdValueCalcRatioUpdateIn,JobPayoutRatioProfileCreateIn,JobPayoutRatioProfilePublicOut,JobPayoutRatioProfilesPublicOut,JobPayoutRatioProfileUpdateIn,DepartmentPayoutRatioPublicOut,DepartmentPayoutRatiosPublicOut,DepartmentPayoutRatioUpdateIn,EmployeeCreateIn,EmployeePublicOut,EmployeesPublicOut,EmployeeUpdateIn,DepartmentPublicOut,DepartmentsPublicOut,WorkLocationCreateIn,WorkLocationPublicOut,WorkLocationsPublicOut,WorkLocationUpdateIn,EmployeeTitleCreateIn,EmployeeTitlePublicOut,EmployeeTitlesPublicOut,EmployeeTitleUpdateIn,ProfessionalTitleCreateIn,ProfessionalTitlePublicOut,ProfessionalTitlesPublicOut,ProfessionalTitleUpdateIn,EmployStatusCreateIn,EmployStatusesPublicOut,EmployStatusPublicOut,EmployStatusUpdateIn,ProjectPayoutCreateIn,ProjectPayoutPublicOut,ProjectPayoutsPublicOut,ProjectPayoutUpdateIn,ContractPaymentCreateIn,ContractPaymentPublicOut,ContractPaymentsPublicOut,ContractPaymentUpdateIn,ItemCreateIn,ItemPublicOut,ItemsPublicOut,ItemUpdateIn } from './models';

export type LoginData = {
        LoginAccessToken: {
                    formData: Body_Login_login_access_token
                    
                };
RecoverPassword: {
                    email: string
                    
                };
ResetPassword: {
                    requestBody: NewPassword
                    
                };
RecoverPasswordHtmlContent: {
                    email: string
                    
                };
    }

export type UsersData = {
        ReadUsers: {
                    limit?: number
skip?: number
                    
                };
CreateUser: {
                    requestBody: UserCreate
                    
                };
UpdateUserMe: {
                    requestBody: UserUpdateMe
                    
                };
UpdatePasswordMe: {
                    requestBody: UpdatePassword
                    
                };
RegisterUser: {
                    requestBody: UserRegister
                    
                };
ReadUserById: {
                    userId: number
                    
                };
UpdateUser: {
                    requestBody: UserUpdate
userId: number
                    
                };
DeleteUser: {
                    userId: number
                    
                };
    }

export type ProjectsData = {
        GetAndFilterProjects: {
                    buildingStructureTypeId?: number | null
buildingTypeId?: number | null
calculatedEmployeePayoutMax?: number | null
calculatedEmployeePayoutMin?: number | null
dateAddedFrom?: string | null
dateAddedTo?: string | null
id?: number | null
limit?: number
name?: string | null
projectAreaMax?: number | null
projectAreaMin?: number | null
projectClassId?: number | null
projectCode?: string | null
projectConstructionCostMax?: number | null
projectConstructionCostMin?: number | null
projectContractValueMax?: number | null
projectContractValueMin?: number | null
projectRateAdjustmentClassId?: number | null
projectTaskTypeId?: number | null
projectTypeId?: number | null
qualityRatioClassId?: number | null
skip?: number
                    
                };
CreateProject: {
                    requestBody: ProjectCreateIn
                    
                };
ReadProject: {
                    id: number
                    
                };
UpdateProject: {
                    id: number
requestBody: ProjectUpdateIn
                    
                };
DeleteProject: {
                    id: number
                    
                };
    }

export type ProjectTypesData = {
        CreateProjectType: {
                    requestBody: ProjectTypeCreateIn
                    
                };
GetProjectTypeById: {
                    id: number
                    
                };
UpdateProjectType: {
                    id: number
requestBody: ProjectTypeUpdateIn
                    
                };
    }

export type BuildingTypesData = {
        CreateBuildingType: {
                    requestBody: BuildingTypeCreateIn
                    
                };
GetBuildingTypeById: {
                    id: number
                    
                };
UpdateBuildingType: {
                    id: number
requestBody: BuildingTypeUpdateIn
                    
                };
    }

export type ProjectTaskTypesData = {
        CreateProjectTaskType: {
                    requestBody: ProjectTaskTypeCreateIn
                    
                };
GetProjectTaskTypeById: {
                    id: number
                    
                };
UpdateProjectTaskType: {
                    id: number
requestBody: ProjectTaskTypeUpdateIn
                    
                };
    }

export type ProjectClassesData = {
        CreateProjectClass: {
                    requestBody: ProjectClassCreateIn
                    
                };
GetProjectClassById: {
                    id: number
                    
                };
UpdateProjectClass: {
                    id: number
requestBody: ProjectClassUpdateIn
                    
                };
    }

export type BuildingStructureTypesData = {
        CreateBuildingStructureType: {
                    requestBody: BuildingStructureTypeCreateIn
                    
                };
GetBuildingStructureTypeById: {
                    id: number
                    
                };
UpdateBuildingStructureType: {
                    id: number
requestBody: BuildingStructureTypeUpdateIn
                    
                };
    }

export type ProjectRateAdjustmentClassesData = {
        CreateProjectRateAdjustmentClass: {
                    requestBody: ProjectRateAdjustmentClassCreateIn
                    
                };
GetProjectRateAdjustmentClassById: {
                    id: number
                    
                };
UpdateProjectRateAdjustmentClass: {
                    id: number
requestBody: ProjectRateAdjustmentClassUpdateIn
                    
                };
    }

export type QualityRatioClassesData = {
        CreateQualityRaitioClass: {
                    requestBody: QualityRatioClassCreateIn
                    
                };
GetQualityRaitioClassById: {
                    id: number
                    
                };
UpdateQualityRaitioClass: {
                    id: number
requestBody: QualityRatioClassUpdateIn
                    
                };
    }

export type ProdValueCalcRatiosData = {
        CreateProdValueCalcRatio: {
                    requestBody: ProdValueCalcRatioCreateIn
                    
                };
GetProdValueCalcRatioById: {
                    id: number
                    
                };
UpdateProdValueCalcRatio: {
                    id: number
requestBody: ProdValueCalcRatioUpdateIn
                    
                };
DeleteProdValueCalcRatio: {
                    id: number
                    
                };
    }

export type JobPayoutRatioProfilesData = {
        ReadJobPayoutRatioProfiles: {
                    hidden?: boolean
                    
                };
CreateJobPayoutRatioProfile: {
                    requestBody: JobPayoutRatioProfileCreateIn
                    
                };
GetJobPayoutRatioProfileById: {
                    id: number
                    
                };
UpdateJobPayoutRatioProfile: {
                    id: number
requestBody: JobPayoutRatioProfileUpdateIn
                    
                };
    }

export type DepartmentPayoutRatiosData = {
        GetDepartmentPayoutRatioById: {
                    id: number
                    
                };
UpdateDepartmentPayoutRatioById: {
                    id: number
requestBody: DepartmentPayoutRatioUpdateIn
                    
                };
ReadDepartmentPayoutRatiosByProjectClassId: {
                    projectClassId: number
                    
                };
GetDepartmentPayoutRatio: {
                    projectClassId: number
projectRateAdjustmentClassId: number
                    
                };
UpdateDepartmentPayoutRatioByCombo: {
                    projectClassId: number
projectRateAdjustmentClassId: number
requestBody: DepartmentPayoutRatioUpdateIn
                    
                };
    }

export type EmployeeData = {
        ReadEmployees: {
                    limit?: number
showDisabled?: boolean | null
skip?: number
                    
                };
CreateEmployee: {
                    requestBody: EmployeeCreateIn
                    
                };
SearchEmployee: {
                    departmentId?: number | null
limit?: number
query: string
skip?: number
                    
                };
ReadEmployeesByDepartment: {
                    limit?: number
skip?: number
                    
                };
GetEmployeeById: {
                    id: number
                    
                };
UpdateEmployee: {
                    id: number
requestBody: EmployeeUpdateIn
                    
                };
GetEmployeeReportById: {
                    id: number
                    
                };
    }

export type DepartmentsData = {
        GetDepartmentById: {
                    id: number
                    
                };
    }

export type WorkLocationsData = {
        CreateWorkLocation: {
                    requestBody: WorkLocationCreateIn
                    
                };
GetWorkLocationById: {
                    id: number
                    
                };
UpdateWorkLocation: {
                    id: number
requestBody: WorkLocationUpdateIn
                    
                };
    }

export type EmployeeTitlesData = {
        CreateEmployeeTitle: {
                    requestBody: EmployeeTitleCreateIn
                    
                };
GetEmployeeTitleById: {
                    id: number
                    
                };
UpdateEmployeeTitle: {
                    id: number
requestBody: EmployeeTitleUpdateIn
                    
                };
    }

export type ProfessionalTitlesData = {
        CreateProfessionalTitle: {
                    requestBody: ProfessionalTitleCreateIn
                    
                };
GetProfessionalTitleById: {
                    id: number
                    
                };
UpdateProfessionalTitle: {
                    id: number
requestBody: ProfessionalTitleUpdateIn
                    
                };
    }

export type EmployeeStatusesData = {
        CreateEmployeeStatus: {
                    requestBody: EmployStatusCreateIn
                    
                };
GetEmployeeStatusById: {
                    id: number
                    
                };
UpdateEmployeeStatus: {
                    id: number
requestBody: EmployStatusUpdateIn
                    
                };
    }

export type ProjectPayoutsData = {
        GetProjectPayout: {
                    limit?: number
skip?: number
                    
                };
CreateProjectPayout: {
                    requestBody: ProjectPayoutCreateIn
                    
                };
GetProjectPayoutByProjectId: {
                    id: number
                    
                };
ReadProjectPayout: {
                    id: number
                    
                };
UpdateProjectPayout: {
                    id: number
requestBody: ProjectPayoutUpdateIn
                    
                };
    }

export type ContractPaymentsData = {
        CreateContractPayment: {
                    requestBody: ContractPaymentCreateIn
                    
                };
GetContractPaymentByProjectPayoutId: {
                    id: number
                    
                };
GetContractPaymentByProjectId: {
                    id: number
                    
                };
ReadContractPayment: {
                    id: number
                    
                };
UpdateContractPayment: {
                    id: number
requestBody: ContractPaymentUpdateIn
                    
                };
DeleteContractPayment: {
                    id: number
                    
                };
    }

export type ReportsData = {
        GetProjectListReport: {
                    projectYear?: number | null
                    
                };
GetContractPaymentListReport: {
                    projectId?: number | null
timeEnd?: string | null
timeStart?: string | null
                    
                };
GetEmployeeProjectPayoutListByPaymentYearReport: {
                    employeeId: number
paymentYear: number
                    
                };
GetEmployeeProjectPayoutListByProjectYearReport: {
                    employeeId: number
projectYear: number
                    
                };
GetEmployeeProjectProductionValueByProjectYearReport: {
                    employeeId: number
projectYear: number
                    
                };
GetCompanyProjectPayoutListByPaymentYearReport: {
                    paymentYear: number
                    
                };
GetCompanyProjectPayoutListByProjectYearReport: {
                    projectYear: number
                    
                };
GetCompanyProjectProductionValueByProjectYearReport: {
                    projectYear: number
                    
                };
GetProjectPayoutListByPaymentYearReport: {
                    paymentYear: number
projectId: number
                    
                };
GetProjectPayoutListByProjectYearReport: {
                    projectId: number
                    
                };
GetProjectProductionValueReport: {
                    projectId: number
                    
                };
GetContractPaymentPayoutListReport: {
                    contractPaymentId: number
                    
                };
    }

export type UtilsData = {
        TestEmail: {
                    emailTo: string
                    
                };
    }

export type ItemsData = {
        ReadItems: {
                    limit?: number
skip?: number
                    
                };
CreateItem: {
                    requestBody: ItemCreateIn
                    
                };
ReadItem: {
                    id: number
                    
                };
UpdateItem: {
                    id: number
requestBody: ItemUpdateIn
                    
                };
DeleteItem: {
                    id: number
                    
                };
    }

export class LoginService {

	/**
	 * Login Access Token
	 * OAuth2 compatible token login, get an access token for future requests
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginAccessToken(data: LoginData['LoginAccessToken']): CancelablePromise<Token> {
		const {
formData,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/access-token',
			formData: formData,
			mediaType: 'application/x-www-form-urlencoded',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Test Token
	 * Test access token
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static testToken(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/test-token',
		});
	}

	/**
	 * Refresh Token
	 * Refresh access token
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static refreshToken(): CancelablePromise<Token> {
				return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/login/refresh-token',
		});
	}

	/**
	 * Recover Password
	 * Password Recovery
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static recoverPassword(data: LoginData['RecoverPassword']): CancelablePromise<Message> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Reset Password
	 * Reset password
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static resetPassword(data: LoginData['ResetPassword']): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/reset-password/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Recover Password Html Content
	 * HTML Content for Password Recovery
	 * @returns string Successful Response
	 * @throws ApiError
	 */
	public static recoverPasswordHtmlContent(data: LoginData['RecoverPasswordHtmlContent']): CancelablePromise<string> {
		const {
email,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/password-recovery-html-content/{email}',
			path: {
				email
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export class UsersService {

	/**
	 * Read Users
	 * Retrieve users.
	 * @returns UsersPublic Successful Response
	 * @throws ApiError
	 */
	public static readUsers(data: UsersData['ReadUsers'] = {}): CancelablePromise<UsersPublic> {
		const {
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create User
	 * Create new user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static createUser(data: UsersData['CreateUser']): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User Me
	 * Get current user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserMe(): CancelablePromise<UserPublic> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Delete User Me
	 * Delete own user.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteUserMe(): CancelablePromise<Message> {
				return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/me',
		});
	}

	/**
	 * Update User Me
	 * Update own user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUserMe(data: UsersData['UpdateUserMe']): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Password Me
	 * Update own password.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static updatePasswordMe(data: UsersData['UpdatePasswordMe']): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/me/password',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Register User
	 * Create new user without the need to be logged in.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static registerUser(data: UsersData['RegisterUser']): CancelablePromise<UserPublic> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/signup',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read User By Id
	 * Get a specific user by id.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static readUserById(data: UsersData['ReadUserById']): CancelablePromise<UserPublic> {
		const {
userId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update User
	 * Update a user.
	 * @returns UserPublic Successful Response
	 * @throws ApiError
	 */
	public static updateUser(data: UsersData['UpdateUser']): CancelablePromise<UserPublic> {
		const {
userId,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete User
	 * Delete a user.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteUser(data: UsersData['DeleteUser']): CancelablePromise<Message> {
		const {
userId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/{user_id}',
			path: {
				user_id: userId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectsService {

	/**
	 * Get And Filter Projects
	 * 搜索项目。
	 * @returns ProjectsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getAndFilterProjects(data: ProjectsData['GetAndFilterProjects'] = {}): CancelablePromise<ProjectsPublicOut> {
		const {
skip = 0,
limit = 100,
id,
projectCode,
name,
projectTypeId,
buildingTypeId,
projectTaskTypeId,
projectClassId,
buildingStructureTypeId,
projectRateAdjustmentClassId,
qualityRatioClassId,
dateAddedFrom,
dateAddedTo,
projectAreaMin,
projectAreaMax,
projectConstructionCostMin,
projectConstructionCostMax,
calculatedEmployeePayoutMin,
calculatedEmployeePayoutMax,
projectContractValueMin,
projectContractValueMax,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/projects/',
			query: {
				skip, limit, id, project_code: projectCode, name, project_type_id: projectTypeId, building_type_id: buildingTypeId, project_task_type_id: projectTaskTypeId, project_class_id: projectClassId, building_structure_type_id: buildingStructureTypeId, project_rate_adjustment_class_id: projectRateAdjustmentClassId, quality_ratio_class_id: qualityRatioClassId, date_added_from: dateAddedFrom, date_added_to: dateAddedTo, project_area_min: projectAreaMin, project_area_max: projectAreaMax, project_construction_cost_min: projectConstructionCostMin, project_construction_cost_max: projectConstructionCostMax, calculated_employee_payout_min: calculatedEmployeePayoutMin, calculated_employee_payout_max: calculatedEmployeePayoutMax, project_contract_value_min: projectContractValueMin, project_contract_value_max: projectContractValueMax
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Project
	 * Create a new project.
	 * @returns ProjectPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProject(data: ProjectsData['CreateProject']): CancelablePromise<ProjectPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/projects/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Project
	 * Get project by ID.
	 * @returns ProjectPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProject(data: ProjectsData['ReadProject']): CancelablePromise<ProjectPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/projects/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `项目ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project
	 * Update a project.
 * 当产值已经计算过并有入账时，个别字段不允许修改。
	 * @returns ProjectPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProject(data: ProjectsData['UpdateProject']): CancelablePromise<ProjectPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/projects/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Project
	 * Delete a project. Related Project Payout, Contract Payment, Contract Payment Payout will be deleted as well. Only allowed if the project year is the current year.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteProject(data: ProjectsData['DeleteProject']): CancelablePromise<Message> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/projects/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectTypesService {

	/**
	 * Read Project Types
	 * Retrieve project_types.
	 * @returns ProjectTypesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProjectTypes(): CancelablePromise<ProjectTypesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-types/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Project Type
	 * Create new ProjectType.
	 * @returns ProjectTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProjectType(data: ProjectTypesData['CreateProjectType']): CancelablePromise<ProjectTypePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/project-types/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建工程类型`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Project Type By Id
	 * Get Exployee by ID.
	 * @returns ProjectTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectTypeById(data: ProjectTypesData['GetProjectTypeById']): CancelablePromise<ProjectTypePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-types/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `工程类型ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project Type
	 * Update an ProjectType.
	 * @returns ProjectTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProjectType(data: ProjectTypesData['UpdateProjectType']): CancelablePromise<ProjectTypePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/project-types/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新工程类型`,
				404: `工程类型ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class BuildingTypesService {

	/**
	 * Read Building Types
	 * Retrieve building_types.
	 * @returns BuildingTypesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readBuildingTypes(): CancelablePromise<BuildingTypesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/building-types/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Building Type
	 * Create new BuildingType.
	 * @returns BuildingTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createBuildingType(data: BuildingTypesData['CreateBuildingType']): CancelablePromise<BuildingTypePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/building-types/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建民用建筑类别`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Building Type By Id
	 * Get Exployee by ID.
	 * @returns BuildingTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getBuildingTypeById(data: BuildingTypesData['GetBuildingTypeById']): CancelablePromise<BuildingTypePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/building-types/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Building Type
	 * Update an BuildingType.
	 * @returns BuildingTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateBuildingType(data: BuildingTypesData['UpdateBuildingType']): CancelablePromise<BuildingTypePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/building-types/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法修改民用建筑类别信息`,
				404: `民用建筑类别ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectTaskTypesService {

	/**
	 * Read Project Task Types
	 * Retrieve project_task_types.
	 * @returns ProjectTaskTypesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProjectTaskTypes(): CancelablePromise<ProjectTaskTypesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-task-types/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Project Task Type
	 * Create new ProjectTaskType.
	 * @returns ProjectTaskTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProjectTaskType(data: ProjectTaskTypesData['CreateProjectTaskType']): CancelablePromise<ProjectTaskTypePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/project-task-types/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建工程项目类别`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Project Task Type By Id
	 * Get ProjectTaskType by ID.
	 * @returns ProjectTaskTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectTaskTypeById(data: ProjectTaskTypesData['GetProjectTaskTypeById']): CancelablePromise<ProjectTaskTypePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-task-types/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `工程项目类别ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project Task Type
	 * Update an ProjectTaskType.
	 * @returns ProjectTaskTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProjectTaskType(data: ProjectTaskTypesData['UpdateProjectTaskType']): CancelablePromise<ProjectTaskTypePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/project-task-types/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新工程项目类别`,
				404: `工程项目类别ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectClassesService {

	/**
	 * Read Project Classes
	 * Retrieve ProjectClasses.
	 * @returns ProjectClassesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProjectClasses(): CancelablePromise<ProjectClassesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-classes/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Project Class
	 * Create new ProjectClass.
	 * @returns ProjectClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProjectClass(data: ProjectClassesData['CreateProjectClass']): CancelablePromise<ProjectClassPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/project-classes/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建工程等级`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Project Class By Id
	 * Get ProjectClass by ID.
	 * @returns ProjectClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectClassById(data: ProjectClassesData['GetProjectClassById']): CancelablePromise<ProjectClassPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-classes/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `工程等级ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project Class
	 * Update an ProjectClass.
	 * @returns ProjectClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProjectClass(data: ProjectClassesData['UpdateProjectClass']): CancelablePromise<ProjectClassPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/project-classes/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新工程等级`,
				404: `工程等级ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class BuildingStructureTypesService {

	/**
	 * Read Building Structure Types
	 * Retrieve BuildingStructureTypes.
	 * @returns BuildingStructureTypesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readBuildingStructureTypes(): CancelablePromise<BuildingStructureTypesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/building-structure-types/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Building Structure Type
	 * Create new BuildingStructureType.
	 * @returns BuildingStructureTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createBuildingStructureType(data: BuildingStructureTypesData['CreateBuildingStructureType']): CancelablePromise<BuildingStructureTypePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/building-structure-types/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建结构形式`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Building Structure Type By Id
	 * Get BuildingStructureType by ID.
	 * @returns BuildingStructureTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getBuildingStructureTypeById(data: BuildingStructureTypesData['GetBuildingStructureTypeById']): CancelablePromise<BuildingStructureTypePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/building-structure-types/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Building Structure Type
	 * Update an BuildingStructureType.
	 * @returns BuildingStructureTypePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateBuildingStructureType(data: BuildingStructureTypesData['UpdateBuildingStructureType']): CancelablePromise<BuildingStructureTypePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/building-structure-types/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法修改结构形式信息`,
				404: `结构形式ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectRateAdjustmentClassesService {

	/**
	 * Read Project Rate Adjustment Classes
	 * Retrieve project_rate_adjustment_classes.
	 * @returns ProjectRateAdjustmentClassesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProjectRateAdjustmentClasses(): CancelablePromise<ProjectRateAdjustmentClassesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-rate-adjustment-classes/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Project Rate Adjustment Class
	 * Create new ProjectRateAdjustmentClass.
	 * @returns ProjectRateAdjustmentClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProjectRateAdjustmentClass(data: ProjectRateAdjustmentClassesData['CreateProjectRateAdjustmentClass']): CancelablePromise<ProjectRateAdjustmentClassPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/project-rate-adjustment-classes/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建系数调整级别`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Project Rate Adjustment Class By Id
	 * Get Exployee by ID.
	 * @returns ProjectRateAdjustmentClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectRateAdjustmentClassById(data: ProjectRateAdjustmentClassesData['GetProjectRateAdjustmentClassById']): CancelablePromise<ProjectRateAdjustmentClassPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-rate-adjustment-classes/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `系数调整级别ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project Rate Adjustment Class
	 * Update an ProjectRateAdjustmentClass.
	 * @returns ProjectRateAdjustmentClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProjectRateAdjustmentClass(data: ProjectRateAdjustmentClassesData['UpdateProjectRateAdjustmentClass']): CancelablePromise<ProjectRateAdjustmentClassPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/project-rate-adjustment-classes/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新系数调整级别`,
				404: `系数调整级别ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class QualityRatioClassesService {

	/**
	 * Read Quality Ratio Classes
	 * Retrieve quality_raitio_classes.
	 * @returns QualityRatioClassesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readQualityRatioClasses(): CancelablePromise<QualityRatioClassesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/quality-ratio-classes/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Quality Raitio Class
	 * Create new QualityRatioClass.
	 * @returns QualityRatioClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createQualityRaitioClass(data: QualityRatioClassesData['CreateQualityRaitioClass']): CancelablePromise<QualityRatioClassPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/quality-ratio-classes/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建设计质量系数`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Quality Raitio Class By Id
	 * Get Exployee by ID.
	 * @returns QualityRatioClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getQualityRaitioClassById(data: QualityRatioClassesData['GetQualityRaitioClassById']): CancelablePromise<QualityRatioClassPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/quality-ratio-classes/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `设计质量系数ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Quality Raitio Class
	 * Update an QualityRatioClass.
	 * @returns QualityRatioClassPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateQualityRaitioClass(data: QualityRatioClassesData['UpdateQualityRaitioClass']): CancelablePromise<QualityRatioClassPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/quality-ratio-classes/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新设计质量系数`,
				404: `设计质量系数ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProdValueCalcRatiosService {

	/**
	 * Read Prod Value Calc Ratios Default
	 * 获取默认的施工图产值到下发产值比。
	 * @returns ProdValueCalcRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProdValueCalcRatiosDefault(): CancelablePromise<ProdValueCalcRatioPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/prod-value-calc-ratios/default',
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `未找到默认的施工图产值到下发产值比。`,
			},
		});
	}

	/**
	 * Read Prod Value Calc Ratios
	 * 获取施工图产值到下发产值比。
	 * @returns ProdValueCalcRatiosPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProdValueCalcRatios(): CancelablePromise<ProdValueCalcRatiosPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/prod-value-calc-ratios/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Prod Value Calc Ratio
	 * 创建新的施工图产值到下发产值比。
	 * @returns ProdValueCalcRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProdValueCalcRatio(data: ProdValueCalcRatiosData['CreateProdValueCalcRatio']): CancelablePromise<ProdValueCalcRatioPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/prod-value-calc-ratios/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建施工图产值到下发产值比`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Prod Value Calc Ratio By Id
	 * 使用id获取施工图产值到下发产值比。
	 * @returns ProdValueCalcRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProdValueCalcRatioById(data: ProdValueCalcRatiosData['GetProdValueCalcRatioById']): CancelablePromise<ProdValueCalcRatioPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/prod-value-calc-ratios/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `施工图产值到下发产值比ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Prod Value Calc Ratio
	 * 更新施工图产值到下发产值比。
	 * @returns ProdValueCalcRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProdValueCalcRatio(data: ProdValueCalcRatiosData['UpdateProdValueCalcRatio']): CancelablePromise<ProdValueCalcRatioPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/prod-value-calc-ratios/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法修改施工图产值到下发产值比信息`,
				404: `施工图产值到下发产值比ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Prod Value Calc Ratio
	 * 删除施工图产值到下发产值比。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static deleteProdValueCalcRatio(data: ProdValueCalcRatiosData['DeleteProdValueCalcRatio']): CancelablePromise<unknown> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/prod-value-calc-ratios/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法删除施工图产值到下发产值比`,
				404: `施工图产值到下发产值比ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class JobPayoutRatioProfilesService {

	/**
	 * Read Job Payout Ratio Profiles
	 * Retrieve JobPayoutRatioProfile.
	 * @returns JobPayoutRatioProfilesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readJobPayoutRatioProfiles(data: JobPayoutRatioProfilesData['ReadJobPayoutRatioProfiles'] = {}): CancelablePromise<JobPayoutRatioProfilesPublicOut> {
		const {
hidden = false,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/job-payout-ratio-profiles/',
			query: {
				hidden
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Job Payout Ratio Profile
	 * Create new JobPayoutRatioProfile.
	 * @returns JobPayoutRatioProfilePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createJobPayoutRatioProfile(data: JobPayoutRatioProfilesData['CreateJobPayoutRatioProfile']): CancelablePromise<JobPayoutRatioProfilePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/job-payout-ratio-profiles/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建设计阶段产值系数配置`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Job Payout Ratio Profile By Id
	 * Get JobPayoutRatioProfile by ID.
	 * @returns JobPayoutRatioProfilePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getJobPayoutRatioProfileById(data: JobPayoutRatioProfilesData['GetJobPayoutRatioProfileById']): CancelablePromise<JobPayoutRatioProfilePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/job-payout-ratio-profiles/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `设计阶段产值系数配置ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Job Payout Ratio Profile
	 * Update an JobPayoutRatioProfile.
	 * @returns JobPayoutRatioProfilePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateJobPayoutRatioProfile(data: JobPayoutRatioProfilesData['UpdateJobPayoutRatioProfile']): CancelablePromise<JobPayoutRatioProfilePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/job-payout-ratio-profiles/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `无法更新已被项目使用的设计阶段产值系数配置中的比例。`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新设计阶段产值系数配置`,
				404: `设计阶段产值系数配置ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class DepartmentPayoutRatiosService {

	/**
	 * Read Department Payout Ratios
	 * Retrieve DepartmentPayoutRatio.
	 * @returns DepartmentPayoutRatiosPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readDepartmentPayoutRatios(): CancelablePromise<DepartmentPayoutRatiosPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/department-payout-ratios/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Get Department Payout Ratio By Id
	 * Retrieve DepartmentPayoutRatio.
	 * @returns DepartmentPayoutRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getDepartmentPayoutRatioById(data: DepartmentPayoutRatiosData['GetDepartmentPayoutRatioById']): CancelablePromise<DepartmentPayoutRatioPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/department-payout-ratios/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Department Payout Ratio By Id
	 * Update an DepartmentPayoutRatio.
	 * @returns DepartmentPayoutRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateDepartmentPayoutRatioById(data: DepartmentPayoutRatiosData['UpdateDepartmentPayoutRatioById']): CancelablePromise<DepartmentPayoutRatioPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/department-payout-ratios/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新专业产值系数`,
				404: `专业产值系数配置 ID 不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Department Payout Ratios By Project Class Id
	 * Read all DepartmentPayoutRatios under a project class id.
	 * @returns DepartmentPayoutRatiosPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readDepartmentPayoutRatiosByProjectClassId(data: DepartmentPayoutRatiosData['ReadDepartmentPayoutRatiosByProjectClassId']): CancelablePromise<DepartmentPayoutRatiosPublicOut> {
		const {
projectClassId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/department-payout-ratios/by-project-class-id/{project_class_id}',
			path: {
				project_class_id: projectClassId
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Department Payout Ratio
	 * Get DepartmentPayoutRatio for a project class id and project rate adjustment class combo.
	 * @returns DepartmentPayoutRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getDepartmentPayoutRatio(data: DepartmentPayoutRatiosData['GetDepartmentPayoutRatio']): CancelablePromise<DepartmentPayoutRatioPublicOut> {
		const {
projectClassId,
projectRateAdjustmentClassId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/department-payout-ratios/project-class/{project_class_id}/project-rate-adjustment-class/{project_rate_adjustment_class_id}',
			path: {
				project_class_id: projectClassId, project_rate_adjustment_class_id: projectRateAdjustmentClassId
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Department Payout Ratio By Combo
	 * Update an DepartmentPayoutRatio.
	 * @returns DepartmentPayoutRatioPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateDepartmentPayoutRatioByCombo(data: DepartmentPayoutRatiosData['UpdateDepartmentPayoutRatioByCombo']): CancelablePromise<DepartmentPayoutRatioPublicOut> {
		const {
projectClassId,
projectRateAdjustmentClassId,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/department-payout-ratios/project-class/{project_class_id}/project-rate-adjustment-class/{project_rate_adjustment_class_id}',
			path: {
				project_class_id: projectClassId, project_rate_adjustment_class_id: projectRateAdjustmentClassId
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新专业产值系数`,
				422: `Validation Error`,
			},
		});
	}

}

export class EmployeeService {

	/**
	 * Read Employees
	 * Retrieve employees.
	 * @returns EmployeesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readEmployees(data: EmployeeData['ReadEmployees'] = {}): CancelablePromise<EmployeesPublicOut> {
		const {
showDisabled,
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee/',
			query: {
				show_disabled: showDisabled, skip, limit
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Employee
	 * Create new Employee.
	 * @returns EmployeePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createEmployee(data: EmployeeData['CreateEmployee']): CancelablePromise<EmployeePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/employee/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建员工信息`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Search Employee
	 * 通过query搜索员工。
 * 
 * 搜索的字段包括：initial, pinyin, name
 * 如果提供department_id，则该部门的员工优先级最高。
 * 
 * 排序规则：
 * 1. 在指定部门（如果提供）
 * 2. 匹配拼音开头
 * 3. 匹配首字母开头
 * 4. 拼音全文匹配
 * 5. 首字母全文匹配
 * 6. 名字全文匹配
 * 
 * 不搜索id.
	 * @returns EmployeesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static searchEmployee(data: EmployeeData['SearchEmployee']): CancelablePromise<EmployeesPublicOut> {
		const {
query,
departmentId,
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee/search/{query}',
			path: {
				query
			},
			query: {
				department_id: departmentId, skip, limit
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Employees By Department
	 * Retrieve employees by department ID.
	 * @returns EmployeesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readEmployeesByDepartment(data: EmployeeData['ReadEmployeesByDepartment'] = {}): CancelablePromise<EmployeesPublicOut> {
		const {
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee/by-department-id/{id}',
			query: {
				skip, limit
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `部门ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Employee By Id
	 * Get Exployee by ID.
	 * @returns EmployeePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeById(data: EmployeeData['GetEmployeeById']): CancelablePromise<EmployeePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `员工ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Employee
	 * Update an Employee.
	 * @returns EmployeePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateEmployee(data: EmployeeData['UpdateEmployee']): CancelablePromise<EmployeePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/employee/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新员工信息`,
				404: `员工ID不存在`,
				422: `更新提供的数据不合法`,
			},
		});
	}

	/**
	 * Get Employee Report By Id
	 * Get Report by Employee ID.
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeReportById(data: EmployeeData['GetEmployeeReportById']): CancelablePromise<unknown> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee/report/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Generate Pinyin
	 * Generate pinyin for a given name.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static generatePinyin(): CancelablePromise<Message> {
				return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/employee/generate-pinyin',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法使用该接口`,
			},
		});
	}

}

export class DepartmentsService {

	/**
	 * Read Departments
	 * Retrieve departrments.
	 * @returns DepartmentsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readDepartments(): CancelablePromise<DepartmentsPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/departments/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Get Department By Id
	 * Get Exployee by ID.
	 * @returns DepartmentPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getDepartmentById(data: DepartmentsData['GetDepartmentById']): CancelablePromise<DepartmentPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/departments/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

}

export class WorkLocationsService {

	/**
	 * Read Worklocations
	 * Retrieve WorkLocations.
	 * @returns WorkLocationsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readWorkLocations(): CancelablePromise<WorkLocationsPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/work-locations/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Worklocation
	 * Create new WorkLocation.
	 * @returns WorkLocationPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createWorkLocation(data: WorkLocationsData['CreateWorkLocation']): CancelablePromise<WorkLocationPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/work-locations/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建工作地点`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Worklocation By Id
	 * Get Exployee by ID.
	 * @returns WorkLocationPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getWorkLocationById(data: WorkLocationsData['GetWorkLocationById']): CancelablePromise<WorkLocationPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/work-locations/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `工作地点ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Worklocation
	 * Update an WorkLocation.
	 * @returns WorkLocationPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateWorkLocation(data: WorkLocationsData['UpdateWorkLocation']): CancelablePromise<WorkLocationPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/work-locations/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新工作地点`,
				404: `工作地点ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class EmployeeTitlesService {

	/**
	 * Read Employee Titles
	 * Retrieve EmployeeTitles.
	 * @returns EmployeeTitlesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readEmployeeTitles(): CancelablePromise<EmployeeTitlesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee-titles/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Employee Title
	 * Create new EmployeeTitle.
	 * @returns EmployeeTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createEmployeeTitle(data: EmployeeTitlesData['CreateEmployeeTitle']): CancelablePromise<EmployeeTitlePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/employee-titles/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建职位`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Employee Title By Id
	 * Get EmployeeTitle by ID.
	 * @returns EmployeeTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeTitleById(data: EmployeeTitlesData['GetEmployeeTitleById']): CancelablePromise<EmployeeTitlePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee-titles/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Employee Title
	 * Update an EmployeeTitle.
	 * @returns EmployeeTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateEmployeeTitle(data: EmployeeTitlesData['UpdateEmployeeTitle']): CancelablePromise<EmployeeTitlePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/employee-titles/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新职位`,
				404: `职位ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProfessionalTitlesService {

	/**
	 * Read Professional Titles
	 * Retrieve professional_titles.
	 * @returns ProfessionalTitlesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProfessionalTitles(): CancelablePromise<ProfessionalTitlesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/professional-titles/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Professional Title
	 * Create new ProfessionalTitle.
	 * @returns ProfessionalTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProfessionalTitle(data: ProfessionalTitlesData['CreateProfessionalTitle']): CancelablePromise<ProfessionalTitlePublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/professional-titles/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建职称`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Professional Title By Id
	 * Get Exployee by ID.
	 * @returns ProfessionalTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProfessionalTitleById(data: ProfessionalTitlesData['GetProfessionalTitleById']): CancelablePromise<ProfessionalTitlePublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/professional-titles/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `职称ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Professional Title
	 * Update an ProfessionalTitle.
	 * @returns ProfessionalTitlePublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProfessionalTitle(data: ProfessionalTitlesData['UpdateProfessionalTitle']): CancelablePromise<ProfessionalTitlePublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/professional-titles/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新职称`,
				404: `职称ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class EmployeeStatusesService {

	/**
	 * Read Employee Statuses
	 * Retrieve employees.
	 * @returns EmployStatusesPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readEmployeeStatuses(): CancelablePromise<EmployStatusesPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee-statuses/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Employee Status
	 * Create new EmployStatus.
	 * @returns EmployStatusPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createEmployeeStatus(data: EmployeeStatusesData['CreateEmployeeStatus']): CancelablePromise<EmployStatusPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/employee-statuses/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法创建员工状态`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Employee Status By Id
	 * Get Exployee by ID.
	 * @returns EmployStatusPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeStatusById(data: EmployeeStatusesData['GetEmployeeStatusById']): CancelablePromise<EmployStatusPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/employee-statuses/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Employee Status
	 * Update an EmployStatus.
	 * @returns EmployStatusPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateEmployeeStatus(data: EmployeeStatusesData['UpdateEmployeeStatus']): CancelablePromise<EmployStatusPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/employee-statuses/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法更新员工状态`,
				404: `员工状态ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ProjectPayoutsService {

	/**
	 * Get Project Payout
	 * Retrieve ProjectPayouts.
	 * @returns ProjectPayoutsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectPayout(data: ProjectPayoutsData['GetProjectPayout'] = {}): CancelablePromise<ProjectPayoutsPublicOut> {
		const {
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-payouts/',
			query: {
				skip, limit
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Project Payout
	 * Create a new project payout.
	 * @returns ProjectPayoutPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createProjectPayout(data: ProjectPayoutsData['CreateProjectPayout']): CancelablePromise<ProjectPayoutPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/project-payouts/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `项目已有产值`,
				401: `未登录、登录状态过期或无效`,
				404: `项目ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Project Payout By Project Id
	 * Get project payout *by project ID*.
	 * @returns ProjectPayoutPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getProjectPayoutByProjectId(data: ProjectPayoutsData['GetProjectPayoutByProjectId']): CancelablePromise<ProjectPayoutPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-payouts/by-project-id/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `项目产值ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Project Payout
	 * Get project payout by ID.
	 * @returns ProjectPayoutPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readProjectPayout(data: ProjectPayoutsData['ReadProjectPayout']): CancelablePromise<ProjectPayoutPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/project-payouts/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				404: `项目产值ID不存在`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Project Payout
	 * Update a project payout.
 * 
 * Recalculate the employee payout for the current year if contract payment exists.
 * 
 * 当合同回款已经开始分配时，不允许修改价格信息
	 * @returns ProjectPayoutPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateProjectPayout(data: ProjectPayoutsData['UpdateProjectPayout']): CancelablePromise<ProjectPayoutPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/project-payouts/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				400: `项目已有回款记录，不允许修改`,
				401: `未登录、登录状态过期或无效`,
				404: `项目产值ID不存在`,
				422: `Validation Error`,
			},
		});
	}

}

export class ContractPaymentsService {

	/**
	 * Get Contract Payment
	 * Retrieve ContractPayments.
	 * @returns ContractPaymentsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getContractPayment(): CancelablePromise<ContractPaymentsPublicOut> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/contract-payments/',
			errors: {
				401: `未登录、登录状态过期或无效`,
			},
		});
	}

	/**
	 * Create Contract Payment
	 * Create a new contract_payment payout.
	 * @returns ContractPaymentPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createContractPayment(data: ContractPaymentsData['CreateContractPayment']): CancelablePromise<ContractPaymentPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/contract-payments/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Contract Payment By Project Payout Id
	 * Get contract_payment payout *by project payout ID*.
	 * @returns ContractPaymentsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getContractPaymentByProjectPayoutId(data: ContractPaymentsData['GetContractPaymentByProjectPayoutId']): CancelablePromise<ContractPaymentsPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/contract-payments/by-project-payout-id/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Contract Payment By Project Id
	 * Get contract_payment payout *by project ID*.
	 * @returns ContractPaymentPublicOut Successful Response
	 * @throws ApiError
	 */
	public static getContractPaymentByProjectId(data: ContractPaymentsData['GetContractPaymentByProjectId']): CancelablePromise<ContractPaymentPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/contract-payments/by-project-id/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Contract Payment
	 * Get contract_payment payout by ID.
	 * @returns ContractPaymentPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readContractPayment(data: ContractPaymentsData['ReadContractPayment']): CancelablePromise<ContractPaymentPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/contract-payments/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Contract Payment
	 * Update a contract_payment.
	 * @returns ContractPaymentPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateContractPayment(data: ContractPaymentsData['UpdateContractPayment']): CancelablePromise<ContractPaymentPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/contract-payments/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Contract Payment
	 * Delete a contract_payment. Related Project Payout, Contract Payment, Contract Payment Payout will be deleted as well. Only allowed if the contract_payment year is the current year.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteContractPayment(data: ContractPaymentsData['DeleteContractPayment']): CancelablePromise<Message> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/contract-payments/{id}',
			path: {
				id
			},
			errors: {
				401: `未登录、登录状态过期或无效`,
				422: `Validation Error`,
			},
		});
	}

}

export class ReportsService {

	/**
	 * 生成项目列表报告
	 * 生成项目列表报告。
 * 如果提供项目年份，则生成指定年份的项目列表报告。
 * 否则生成所有年份的项目列表报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getProjectListReport(data: ReportsData['GetProjectListReport'] = {}): CancelablePromise<unknown> {
		const {
projectYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/project-list',
			query: {
				project_year: projectYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成员工列表报告
	 * 生成员工列表报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeListReport(): CancelablePromise<unknown> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/employee-list',
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
			},
		});
	}

	/**
	 * 生成回款报告
	 * 生成回款报告。
 * 如果提供项目id，则生成指定项目的回款报告。
 * 如果提供时间范围，则生成指定时间范围内的回款报告。
 * 否则生成所有回款报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getContractPaymentListReport(data: ReportsData['GetContractPaymentListReport'] = {}): CancelablePromise<unknown> {
		const {
projectId,
timeStart,
timeEnd,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/contract-payments',
			query: {
				project_id: projectId, time_start: timeStart, time_end: timeEnd
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成员工报告
	 * 生成按回款年度汇总个人累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeProjectPayoutListByPaymentYearReport(data: ReportsData['GetEmployeeProjectPayoutListByPaymentYearReport']): CancelablePromise<unknown> {
		const {
employeeId,
paymentYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/employee/project-payout-list-by-payment-year',
			query: {
				employee_id: employeeId, payment_year: paymentYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成员工报告
	 * 生成按工程年度汇总个人累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeProjectPayoutListByProjectYearReport(data: ReportsData['GetEmployeeProjectPayoutListByProjectYearReport']): CancelablePromise<unknown> {
		const {
employeeId,
projectYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/employee/project-payout-list-by-project-year',
			query: {
				employee_id: employeeId, project_year: projectYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成员工报告
	 * 生成按工程年度汇总个人产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getEmployeeProjectProductionValueByProjectYearReport(data: ReportsData['GetEmployeeProjectProductionValueByProjectYearReport']): CancelablePromise<unknown> {
		const {
employeeId,
projectYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/employee/project-production-value-by-project-year',
			query: {
				employee_id: employeeId, project_year: projectYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成公司报告
	 * 生成按回款年度汇总公司累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getCompanyProjectPayoutListByPaymentYearReport(data: ReportsData['GetCompanyProjectPayoutListByPaymentYearReport']): CancelablePromise<unknown> {
		const {
paymentYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/company/project-payout-list-by-payment-year',
			query: {
				payment_year: paymentYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成按工程年度汇总公司累计兑付产值报告
	 * 生成按工程年度汇总公司累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getCompanyProjectPayoutListByProjectYearReport(data: ReportsData['GetCompanyProjectPayoutListByProjectYearReport']): CancelablePromise<unknown> {
		const {
projectYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/company/project-payout-list-by-project-year',
			query: {
				project_year: projectYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成按工程年度汇总公司产值报告
	 * 生成按工程年度汇总公司产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getCompanyProjectProductionValueByProjectYearReport(data: ReportsData['GetCompanyProjectProductionValueByProjectYearReport']): CancelablePromise<unknown> {
		const {
projectYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/company/project-production-value-by-project-year',
			query: {
				project_year: projectYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成项目按回款年度汇总员工累计兑付产值报告
	 * 生成项目按回款年度汇总员工累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getProjectPayoutListByPaymentYearReport(data: ReportsData['GetProjectPayoutListByPaymentYearReport']): CancelablePromise<unknown> {
		const {
projectId,
paymentYear,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/project/payout-list-by-payment-year',
			query: {
				project_id: projectId, payment_year: paymentYear
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成项目按工程年度汇总员工累计兑付产值报告
	 * 生成项目按工程年度汇总员工累计兑付产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getProjectPayoutListByProjectYearReport(data: ReportsData['GetProjectPayoutListByProjectYearReport']): CancelablePromise<unknown> {
		const {
projectId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/project/payout-list-by-project-year',
			query: {
				project_id: projectId
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成项目按工程年度汇总员工产值报告
	 * 生成项目按工程年度汇总员工产值报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getProjectProductionValueReport(data: ReportsData['GetProjectProductionValueReport']): CancelablePromise<unknown> {
		const {
projectId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/project/production-value',
			query: {
				project_id: projectId
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

	/**
	 * 生成回款下发报告
	 * 生成回款下发报告。
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static getContractPaymentPayoutListReport(data: ReportsData['GetContractPaymentPayoutListReport']): CancelablePromise<unknown> {
		const {
contractPaymentId,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/reports/contract-payment/payout-list',
			query: {
				contract_payment_id: contractPaymentId
			},
			errors: {
				400: `生成报告时发生错误`,
				401: `未登录、登录状态过期或无效`,
				403: `非超管无法生成报告`,
				422: `Validation Error`,
			},
		});
	}

}

export class UtilsService {

	/**
	 * Test Email
	 * Test emails.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static testEmail(data: UtilsData['TestEmail']): CancelablePromise<Message> {
		const {
emailTo,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/utils/test-email/',
			query: {
				email_to: emailTo
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Health Check
	 * @returns boolean Successful Response
	 * @throws ApiError
	 */
	public static healthCheck(): CancelablePromise<boolean> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/utils/health-check/',
		});
	}

}

export class ItemsService {

	/**
	 * Read Items
	 * Retrieve items.
	 * @returns ItemsPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readItems(data: ItemsData['ReadItems'] = {}): CancelablePromise<ItemsPublicOut> {
		const {
skip = 0,
limit = 100,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/',
			query: {
				skip, limit
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Item
	 * Create new item.
	 * @returns ItemPublicOut Successful Response
	 * @throws ApiError
	 */
	public static createItem(data: ItemsData['CreateItem']): CancelablePromise<ItemPublicOut> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/items/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Item
	 * Get item by ID.
	 * @returns ItemPublicOut Successful Response
	 * @throws ApiError
	 */
	public static readItem(data: ItemsData['ReadItem']): CancelablePromise<ItemPublicOut> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Item
	 * Update an item.
	 * @returns ItemPublicOut Successful Response
	 * @throws ApiError
	 */
	public static updateItem(data: ItemsData['UpdateItem']): CancelablePromise<ItemPublicOut> {
		const {
id,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Item
	 * Delete an item.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static deleteItem(data: ItemsData['DeleteItem']): CancelablePromise<Message> {
		const {
id,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/items/{id}',
			path: {
				id
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}