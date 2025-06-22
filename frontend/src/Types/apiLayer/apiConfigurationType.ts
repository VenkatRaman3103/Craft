export interface ApiConfigurationType {
    id: string;
    name: string;
    url: string;
    status?: string;
    active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ApiParameterType {
    id: string;
    config_id: string;
    name: string;
    type: string;
    value?: string;
    required?: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiOperationType {
    id: string;
    config_id: string;
    operation_type: string;
    description?: string;
    execution_order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ApiResultType {
    id: string;
    config_id?: string;
    operation_id?: string;
    result_data: any;
    status: string;
    execution_time?: number;
    created_at?: string;
}
