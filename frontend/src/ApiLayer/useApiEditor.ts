// hooks/useApiEditor.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    apiEditorService,
    ApiConfiguration,
    ApiParameter,
    ApiOperation,
    ApiResult,
    CreateApiConfigurationRequest,
    ApiConfigurationWithDetails,
} from "@/api/apiEditorService";

// Query Keys
export const apiEditorKeys = {
    all: ["apiEditor"] as const,
    configurations: () => [...apiEditorKeys.all, "configurations"] as const,
    configuration: (id: number) =>
        [...apiEditorKeys.configurations(), id] as const,
    configurationDetails: (id: number) =>
        [...apiEditorKeys.configuration(id), "details"] as const,
    parameters: (configId: number) =>
        [...apiEditorKeys.configuration(configId), "parameters"] as const,
    operations: (configId: number) =>
        [...apiEditorKeys.configuration(configId), "operations"] as const,
    results: (configId: number) =>
        [...apiEditorKeys.configuration(configId), "results"] as const,
};

// Configuration Hooks
export const useApiConfigurations = (includeInactive = false) => {
    return useQuery({
        queryKey: [...apiEditorKeys.configurations(), includeInactive],
        queryFn: () => apiEditorService.getAllConfigurations(includeInactive),
        select: (data) => data.data,
    });
};

export const useApiConfiguration = (id: number) => {
    return useQuery({
        queryKey: apiEditorKeys.configuration(id),
        queryFn: () => apiEditorService.getConfigurationById(id),
        select: (data) => data.data,
        enabled: !!id,
    });
};

export const useApiConfigurationWithDetails = (id: number) => {
    return useQuery({
        queryKey: apiEditorKeys.configurationDetails(id),
        queryFn: () => apiEditorService.getConfigurationWithDetails(id),
        select: (data) => data.data,
        enabled: !!id,
    });
};

export const useCreateApiConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateApiConfigurationRequest) =>
            apiEditorService.createConfiguration(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurations(),
            });
        },
    });
};

export const useUpdateApiConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: number;
            data: Partial<CreateApiConfigurationRequest>;
        }) => apiEditorService.updateConfiguration(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configuration(id),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurations(),
            });
        },
    });
};

export const useUpdateApiConfigurationName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) =>
            apiEditorService.updateConfigurationName(id, name),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configuration(id),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurations(),
            });
        },
    });
};

export const useUpdateApiConfigurationUrl = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, apiUrl }: { id: number; apiUrl: string }) =>
            apiEditorService.updateConfigurationUrl(id, apiUrl),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configuration(id),
            });
        },
    });
};

export const useUpdateApiConfigurationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            apiEditorService.updateConfigurationStatus(id, isActive),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configuration(id),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurations(),
            });
        },
    });
};

export const useDeleteApiConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiEditorService.deleteConfiguration(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurations(),
            });
        },
    });
};

// Parameter Hooks
export const useApiParameters = (configId: number) => {
    return useQuery({
        queryKey: apiEditorKeys.parameters(configId),
        queryFn: () => apiEditorService.getParametersByConfigId(configId),
        select: (data) => data.data,
        enabled: !!configId,
    });
};

export const useCreateApiParameter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            configId,
            data,
        }: {
            configId: number;
            data: Omit<ApiParameter, "id" | "configId" | "createdAt">;
        }) => apiEditorService.createParameter(configId, data),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.parameters(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

export const useUpdateApiParameter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            configId,
            data,
        }: {
            id: number;
            configId: number;
            data: Partial<Omit<ApiParameter, "id" | "configId" | "createdAt">>;
        }) => apiEditorService.updateParameter(id, data),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.parameters(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

export const useDeleteApiParameter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, configId }: { id: number; configId: number }) =>
            apiEditorService.deleteParameter(id),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.parameters(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

// Operation Hooks
export const useApiOperations = (configId: number) => {
    return useQuery({
        queryKey: apiEditorKeys.operations(configId),
        queryFn: () => apiEditorService.getOperationsByConfigId(configId),
        select: (data) => data.data,
        enabled: !!configId,
    });
};

export const useCreateApiOperation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            configId,
            data,
        }: {
            configId: number;
            data: Omit<ApiOperation, "id" | "configId" | "createdAt">;
        }) => apiEditorService.createOperation(configId, data),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.operations(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

export const useUpdateApiOperation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            configId,
            data,
        }: {
            id: number;
            configId: number;
            data: Partial<Omit<ApiOperation, "id" | "configId" | "createdAt">>;
        }) => apiEditorService.updateOperation(id, data),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.operations(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

export const useUpdateApiOperationOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            configId,
            executionOrder,
        }: {
            id: number;
            configId: number;
            executionOrder: number;
        }) => apiEditorService.updateOperationOrder(id, executionOrder),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.operations(configId),
            });
        },
    });
};

export const useUpdateApiOperationOrders = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            configId,
            operations,
        }: {
            configId: number;
            operations: { id: number; executionOrder: number }[];
        }) => apiEditorService.updateOperationOrders(configId, operations),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.operations(configId),
            });
        },
    });
};

export const useDeleteApiOperation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, configId }: { id: number; configId: number }) =>
            apiEditorService.deleteOperation(id),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.operations(configId),
            });
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.configurationDetails(configId),
            });
        },
    });
};

// Result Hooks
export const useApiResults = (configId: number, limit = 10, offset = 0) => {
    return useQuery({
        queryKey: [...apiEditorKeys.results(configId), limit, offset],
        queryFn: () =>
            apiEditorService.getResultsByConfigId(configId, limit, offset),
        select: (data) => data.data,
        enabled: !!configId,
    });
};

export const useSaveApiResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<ApiResult, "id" | "createdAt">) =>
            apiEditorService.saveResult(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.results(data.configId),
            });
        },
    });
};

export const useDeleteApiResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, configId }: { id: number; configId: number }) =>
            apiEditorService.deleteResult(id),
        onSuccess: (_, { configId }) => {
            queryClient.invalidateQueries({
                queryKey: apiEditorKeys.results(configId),
            });
        },
    });
};
