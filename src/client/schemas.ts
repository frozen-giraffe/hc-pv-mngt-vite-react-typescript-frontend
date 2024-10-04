export const $Body_Login_login_access_token = {
	properties: {
		grant_type: {
	type: 'any-of',
	contains: [{
	type: 'string',
	pattern: 'password',
}, {
	type: 'null',
}],
},
		username: {
	type: 'string',
	isRequired: true,
},
		password: {
	type: 'string',
	isRequired: true,
},
		scope: {
	type: 'string',
	default: '',
},
		client_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		client_secret: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $BuildingStructureTypeCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $BuildingStructureTypePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $BuildingStructureTypeUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $BuildingStructureTypesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'BuildingStructureTypePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $BuildingTypeCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $BuildingTypePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $BuildingTypeUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $BuildingTypesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'BuildingTypePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ContractPaymentCreateIn = {
	properties: {
		payment_date: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		amount: {
	type: 'number',
	isRequired: true,
},
		processed_by_id: {
	type: 'number',
	isRequired: true,
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		project_payout_id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ContractPaymentPayout = {
	properties: {
		project_payout_id: {
	type: 'number',
	isRequired: true,
},
		contract_payment_id: {
	type: 'number',
	isRequired: true,
},
		employee_id: {
	type: 'number',
	isRequired: true,
},
		employee_payout_amount: {
	type: 'number',
	isRequired: true,
},
		id: {
	type: 'number',
},
	},
} as const;

export const $ContractPaymentPublicOut = {
	properties: {
		payment_date: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		amount: {
	type: 'number',
	isRequired: true,
},
		processed_by_id: {
	type: 'number',
	isRequired: true,
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
		contract_payment_payouts: {
	type: 'any-of',
	contains: [{
	type: 'array',
	contains: {
		type: 'ContractPaymentPayout',
	},
}, {
	type: 'null',
}],
},
		paid_ratio: {
	type: 'number',
	isRequired: true,
},
		project_id: {
	type: 'number',
	isRequired: true,
},
		project_payout_id: {
	type: 'number',
	isRequired: true,
},
		payout_amount: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ContractPaymentUpdateIn = {
	properties: {
		payment_date: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		amount: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		processed_by_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ContractPaymentsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ContractPaymentPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $DepartmentPayoutRatioPublicOut = {
	properties: {
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		project_rate_adjustment_class_id: {
	type: 'number',
	isRequired: true,
},
		pm_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_ratio: {
	type: 'number',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
		modified_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
	},
} as const;

export const $DepartmentPayoutRatioUpdateIn = {
	description: `除了project_class_id和project_rate_adjustment_class_id, 其他字段都允许修改`,
	properties: {
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		project_rate_adjustment_class_id: {
	type: 'number',
	isRequired: true,
},
		pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		modified_at: {
	type: 'string',
	default: '2024-10-04T13:30:07.046502',
	format: 'date-time',
},
	},
} as const;

export const $DepartmentPayoutRatiosPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'DepartmentPayoutRatioPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $DepartmentPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $DepartmentsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'DepartmentPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployStatusCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployStatusPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployStatusUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployStatusesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'EmployStatusPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployeeCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		gov_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		gender: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		department_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		work_location_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employee_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		professional_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employ_status_id: {
	type: 'number',
	isRequired: true,
},
		birth_date: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		initial: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		pinyin: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployeePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		gov_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		gender: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		department_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		work_location_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employee_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		professional_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employ_status_id: {
	type: 'number',
	isRequired: true,
},
		birth_date: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		initial: {
	type: 'string',
	isRequired: true,
},
		pinyin: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployeeTitleCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployeeTitlePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployeeTitleUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployeeTitlesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'EmployeeTitlePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $EmployeeUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		gov_id: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		gender: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		department_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		work_location_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employee_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		professional_title_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		employ_status_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		birth_date: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'date-time',
}, {
	type: 'null',
}],
},
		initial: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		pinyin: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $EmployeesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'EmployeePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ErrorResponse = {
	properties: {
		detail: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $HTTPValidationError = {
	properties: {
		detail: {
	type: 'array',
	contains: {
		type: 'ValidationError',
	},
},
	},
} as const;

export const $ItemCreateIn = {
	properties: {
		title: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ItemPublicOut = {
	properties: {
		title: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
		owner_id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ItemUpdateIn = {
	properties: {
		title: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ItemsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ItemPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $JobPayoutRatioProfileCreateIn = {
	description: `除hidden外必须提供所有字段`,
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		hidden: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		pm_ratio: {
	type: 'number',
	isRequired: true,
},
		pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_approver_ratio: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $JobPayoutRatioProfilePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		hidden: {
	type: 'boolean',
	isRequired: true,
},
		pm_ratio: {
	type: 'number',
	isRequired: true,
},
		pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		arch_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		struct_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		plumbing_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		electrical_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		hvac_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_pm_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_pm_assistant_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_designer_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_drafter_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_design_post_service_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_proofreader_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_reviewer_ratio: {
	type: 'number',
	isRequired: true,
},
		low_voltage_approver_ratio: {
	type: 'number',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
		updated_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		is_in_use: {
	type: 'boolean',
	isRequired: true,
},
	},
} as const;

export const $JobPayoutRatioProfileUpdateIn = {
	description: `除了name和hidden, 其他字段都不允许修改`,
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		hidden: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
		pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $JobPayoutRatioProfilesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'JobPayoutRatioProfilePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $Message = {
	properties: {
		message: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $NewPassword = {
	properties: {
		token: {
	type: 'string',
	isRequired: true,
},
		new_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $ProdValueCalcRatioCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		ratio: {
	type: 'number',
	isRequired: true,
},
		default: {
	type: 'boolean',
	default: false,
},
	},
} as const;

export const $ProdValueCalcRatioPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		ratio: {
	type: 'number',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
		default: {
	type: 'boolean',
	isRequired: true,
},
	},
} as const;

export const $ProdValueCalcRatioUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		default: {
	type: 'any-of',
	contains: [{
	type: 'boolean',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProdValueCalcRatiosPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProdValueCalcRatioPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProfessionalTitleCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProfessionalTitlePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProfessionalTitleUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProfessionalTitlesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProfessionalTitlePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectClassCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ProjectClassPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectClassUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectClassesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectClassPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectCreateIn = {
	properties: {
		project_code: {
	type: 'string',
	isRequired: true,
},
		name: {
	type: 'string',
	isRequired: true,
},
		project_year: {
	type: 'number',
	isRequired: true,
},
		project_type_id: {
	type: 'number',
	isRequired: true,
},
		building_type_id: {
	type: 'number',
	isRequired: true,
},
		project_task_type_id: {
	type: 'number',
	isRequired: true,
},
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		building_structure_type_id: {
	type: 'number',
	isRequired: true,
},
		project_rate_adjustment_class_id: {
	type: 'number',
	isRequired: true,
},
		quality_ratio_class_id: {
	type: 'number',
	isRequired: true,
},
		project_area: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_construction_cost: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		calculated_employee_payout: {
	type: 'number',
	isRequired: true,
},
		project_contract_value: {
	type: 'number',
	isRequired: true,
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectPayoutCreateIn = {
	properties: {
		project_id: {
	type: 'number',
	isRequired: true,
},
		pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		manually_modified: {
	type: 'boolean',
	default: false,
},
		job_payout_ratio_profile_id: {
	type: 'number',
	isRequired: true,
},
		department_payout_ratio_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectPayoutPublicOut = {
	properties: {
		project_id: {
	type: 'number',
	isRequired: true,
},
		pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
		created_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		calculation_updated_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		people_updated_at: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		contract_payment_payout_started: {
	type: 'boolean',
	isRequired: true,
},
		update_required_project_updated: {
	type: 'boolean',
	isRequired: true,
},
		department_payout_ratio_used_outdated: {
	type: 'boolean',
	isRequired: true,
},
		job_payout_ratio_profile_used_outdated: {
	type: 'boolean',
	isRequired: true,
},
	},
} as const;

export const $ProjectPayoutUpdateIn = {
	properties: {
		project_id: {
	type: 'null',
	isRequired: true,
},
		pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		arch_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		struct_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		plumbing_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		electrical_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		hvac_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_pm_assistant_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_designer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_drafter_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_design_post_service_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_proofreader_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_reviewer_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		low_voltage_approver_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectPayoutsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectPayoutPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectPublicOut = {
	properties: {
		project_code: {
	type: 'string',
	isRequired: true,
},
		name: {
	type: 'string',
	isRequired: true,
},
		project_year: {
	type: 'number',
	isRequired: true,
},
		project_type_id: {
	type: 'number',
	isRequired: true,
},
		building_type_id: {
	type: 'number',
	isRequired: true,
},
		project_task_type_id: {
	type: 'number',
	isRequired: true,
},
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		building_structure_type_id: {
	type: 'number',
	isRequired: true,
},
		project_rate_adjustment_class_id: {
	type: 'number',
	isRequired: true,
},
		quality_ratio_class_id: {
	type: 'number',
	isRequired: true,
},
		project_area: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_construction_cost: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		calculated_employee_payout: {
	type: 'number',
	isRequired: true,
},
		project_contract_value: {
	type: 'number',
	isRequired: true,
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
		date_added: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		date_modified: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
		project_payout: {
	type: 'any-of',
	contains: [{
	type: 'ProjectPayoutPublicOut',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectRateAdjustmentClassCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ProjectRateAdjustmentClassPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectRateAdjustmentClassUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectRateAdjustmentClassesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectRateAdjustmentClassPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectTaskTypeCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $ProjectTaskTypePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectTaskTypeUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectTaskTypesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectTaskTypePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectTypeCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		building_type_id: {
	type: 'number',
	isRequired: true,
},
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectTypePublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		building_type_id: {
	type: 'number',
	isRequired: true,
},
		project_class_id: {
	type: 'number',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectTypeUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		building_type_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_class_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectTypesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectTypePublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ProjectUpdateIn = {
	properties: {
		project_code: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		project_year: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_type_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		building_type_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_task_type_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_class_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		building_structure_type_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_rate_adjustment_class_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		quality_ratio_class_id: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_area: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_construction_cost: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		calculated_employee_payout: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
		project_contract_value: {
	type: 'number',
	isRequired: true,
},
		notes: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $ProjectsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'ProjectPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $QualityRatioClassCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		ratio: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $QualityRatioClassPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		ratio: {
	type: 'number',
	isRequired: true,
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $QualityRatioClassUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		ratio: {
	type: 'any-of',
	contains: [{
	type: 'number',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $QualityRatioClassesPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'QualityRatioClassPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $Token = {
	properties: {
		access_token: {
	type: 'string',
	isRequired: true,
},
		token_type: {
	type: 'string',
	default: 'bearer',
},
	},
} as const;

export const $UpdatePassword = {
	properties: {
		current_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
		new_password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $UserCreate = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
	},
} as const;

export const $UserPublic = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $UserRegister = {
	properties: {
		email: {
	type: 'string',
	isRequired: true,
	format: 'email',
	maxLength: 255,
},
		password: {
	type: 'string',
	isRequired: true,
	maxLength: 40,
	minLength: 8,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UserUpdate = {
	properties: {
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'email',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'boolean',
	default: true,
},
		is_superuser: {
	type: 'boolean',
	default: false,
},
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		password: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 40,
	minLength: 8,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UserUpdateMe = {
	properties: {
		full_name: {
	type: 'any-of',
	contains: [{
	type: 'string',
	maxLength: 255,
}, {
	type: 'null',
}],
},
		email: {
	type: 'any-of',
	contains: [{
	type: 'string',
	format: 'email',
	maxLength: 255,
}, {
	type: 'null',
}],
},
	},
} as const;

export const $UsersPublic = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'UserPublic',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $ValidationError = {
	properties: {
		loc: {
	type: 'array',
	contains: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'number',
}],
},
	isRequired: true,
},
		msg: {
	type: 'string',
	isRequired: true,
},
		type: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $WorkLocationCreateIn = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $WorkLocationPublicOut = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		id: {
	type: 'number',
	isRequired: true,
},
	},
} as const;

export const $WorkLocationUpdateIn = {
	properties: {
		name: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		description: {
	type: 'any-of',
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;

export const $WorkLocationsPublicOut = {
	properties: {
		data: {
	type: 'array',
	contains: {
		type: 'WorkLocationPublicOut',
	},
	isRequired: true,
},
		count: {
	type: 'number',
	isRequired: true,
},
	},
} as const;