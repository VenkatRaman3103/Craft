import axios from "axios";
import { backendUrl } from "@/config";

const apiClient = axios.create({
    baseURL: backendUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface ApiConfiguration {
    id: number;
    name: string;
    description?: string;
    apiUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: any;
}

export interface ApiParameter {
    id: number;
    configId: number;
    name: string;
    description?: string;
    type: "string" | "number" | "boolean" | "date";
    defaultValue?: string;
    isRequired: boolean;
    options?: string[];
    createdAt: string;
}

export interface ApiOperation {
    id: number;
    configId: number;
    type: "filter" | "map";
    conditionType: "simple" | "custom";
    field?: string;
    operator?: string;
    value?: string;
    customCode?: string;
    mapFields?: MapField[];
    executionOrder: number;
    createdAt: string;
}

export interface MapField {
    from: string;
    to: string;
    value: string;
    type: "copy" | "value" | "transform";
}

export interface ApiResult {
    id: number;
    configId: number;
    parameterValues?: Record<string, string>;
    rawData?: any;
    processedData?: any;
    responseStatus?: number;
    responseTime?: number;
    errorMessage?: string;
    createdAt: string;
}

export interface CreateApiConfigurationRequest {
    name: string;
    description?: string;
    apiUrl: string;
    results: any;
    parameters?: Omit<ApiParameter, "id" | "configId" | "createdAt">[];
    operations?: Omit<ApiOperation, "id" | "configId" | "createdAt">[];
    metadata?: any;
}

export interface ApiConfigurationWithDetails {
    configuration: ApiConfiguration;
    parameters: ApiParameter[];
    operations: ApiOperation[];
}

export const apiEditorService = {
    createConfiguration: async (
        data: CreateApiConfigurationRequest,
    ): Promise<{ data: ApiConfigurationWithDetails }> => {
        const response = await apiClient.post("/api-config", data);
        console.log(data, "<--resultData");
        return response.data;
    },

    getAllConfigurations: async (
        includeInactive = false,
    ): Promise<{ data: ApiConfiguration[] }> => {
        const response = await apiClient.get("/api-config", {
            params: includeInactive ? { includeInactive: true } : {},
        });
        return response.data;
    },

    getConfigurationById: async (
        id: number,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.get(`/api-config/${id}`);
        return response.data;
    },

    getConfigurationWithDetails: async (
        id: number,
    ): Promise<{ data: ApiConfigurationWithDetails }> => {
        const response = await apiClient.get(`/api-config/${id}/details`);
        return response.data;
    },

    updateConfiguration: async (
        id: number,
        data: Partial<CreateApiConfigurationRequest>,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.patch(`/api-config/${id}`, data);
        return response.data;
    },

    updateConfigurationName: async (
        id: number,
        name: string,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.patch(`/api-config/${id}/name`, {
            name,
        });
        return response.data;
    },

    updateConfigurationUrl: async (
        id: number,
        apiUrl: string,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.patch(`/api-config/${id}/url`, {
            apiUrl,
        });
        return response.data;
    },

    updateConfigurationStatus: async (
        id: number,
        isActive: boolean,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.patch(`/api-config/${id}/status`, {
            isActive,
        });
        return response.data;
    },

    deleteConfiguration: async (
        id: number,
    ): Promise<{ data: ApiConfiguration }> => {
        const response = await apiClient.delete(`/api-config/${id}`);
        return response.data;
    },

    createParameter: async (
        configId: number,
        data: Omit<ApiParameter, "id" | "configId" | "createdAt">,
    ): Promise<{ data: ApiParameter }> => {
        const response = await apiClient.post(
            `/api-config/${configId}/parameters`,
            data,
        );
        return response.data;
    },

    getParametersByConfigId: async (
        configId: number,
    ): Promise<{ data: ApiParameter[] }> => {
        const response = await apiClient.get(
            `/api-config/${configId}/parameters`,
        );
        return response.data;
    },

    updateParameter: async (
        id: number,
        data: Partial<Omit<ApiParameter, "id" | "configId" | "createdAt">>,
    ): Promise<{ data: ApiParameter }> => {
        const response = await apiClient.patch(`/api-parameter/${id}`, data);
        return response.data;
    },

    deleteParameter: async (id: number): Promise<{ data: ApiParameter }> => {
        const response = await apiClient.delete(`/api-parameter/${id}`);
        return response.data;
    },

    createOperation: async (
        configId: number,
        data: Omit<ApiOperation, "id" | "configId" | "createdAt">,
    ): Promise<{ data: ApiOperation }> => {
        const response = await apiClient.post(
            `/api-config/${configId}/operations`,
            data,
        );
        return response.data;
    },

    getOperationsByConfigId: async (
        configId: number,
    ): Promise<{ data: ApiOperation[] }> => {
        const response = await apiClient.get(
            `/api-config/${configId}/operations`,
        );
        return response.data;
    },

    updateOperation: async (
        id: number,
        data: Partial<Omit<ApiOperation, "id" | "configId" | "createdAt">>,
    ): Promise<{ data: ApiOperation }> => {
        const response = await apiClient.patch(`/api-operation/${id}`, data);
        return response.data;
    },

    updateOperationOrder: async (
        id: number,
        executionOrder: number,
    ): Promise<{ data: ApiOperation }> => {
        const response = await apiClient.patch(`/api-operation/${id}/order`, {
            executionOrder,
        });
        return response.data;
    },

    updateOperationOrders: async (
        configId: number,
        operations: { id: number; executionOrder: number }[],
    ): Promise<{ data: ApiOperation[] }> => {
        const response = await apiClient.patch(
            `/api-config/${configId}/operations/orders`,
            { operations },
        );
        return response.data;
    },

    deleteOperation: async (id: number): Promise<{ data: ApiOperation }> => {
        const response = await apiClient.delete(`/api-operation/${id}`);
        return response.data;
    },

    saveResult: async (
        data: Omit<ApiResult, "id" | "createdAt">,
    ): Promise<{ data: ApiResult }> => {
        const response = await apiClient.post("/api-results", data);
        return response.data;
    },

    getResultsByConfigId: async (
        configId: number,
        limit = 10,
        offset = 0,
    ): Promise<{ data: ApiResult[] }> => {
        const response = await apiClient.get(
            `/api-config/${configId}/results`,
            {
                params: { limit, offset },
            },
        );
        return response.data;
    },

    deleteResult: async (id: number): Promise<{ data: ApiResult }> => {
        const response = await apiClient.delete(`/api-result/${id}`);
        return response.data;
    },
};
