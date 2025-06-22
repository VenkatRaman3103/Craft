import express from "express";
import {
    createApiConfiguration,
    createApiParameter,
    createApiOperation,
    createApiResult,
} from "./create.js";
import {
    getAllApiConfigurations,
    getApiConfigurationById,
    getApiConfigurationWithDetails,
    getApiParametersByConfigId,
    getApiOperationsByConfigId,
    getApiResultsByConfigId,
    getApiParameterById,
    getApiOperationById,
} from "./read.js";
import {
    deleteApiConfiguration,
    deleteApiParameter,
    deleteApiOperation,
    deleteApiResult,
    deleteAllApiParameters,
    deleteAllApiOperations,
    deleteAllApiResults,
} from "./delete.js";
import {
    updateApiConfiguration,
    updateApiConfigurationName,
    updateApiConfigurationUrl,
    updateApiConfigurationStatus,
    updateApiParameter,
    updateApiOperation,
    updateApiOperationOrder,
    updateOperationOrders,
    updateParameterType,
} from "./update.js";

export const apiEditorRouter = express.Router();

// Create operations
apiEditorRouter.post("/api-config", createApiConfiguration);
apiEditorRouter.post("/api-config/:configId/parameters", createApiParameter); // create parameter for config
apiEditorRouter.post("/api-config/:configId/operations", createApiOperation); // create operation for config
apiEditorRouter.post("/api-results", createApiResult); // save API execution result

// Read operations
apiEditorRouter.get("/api-config", getAllApiConfigurations); // all configurations
apiEditorRouter.get("/api-config/:id", getApiConfigurationById); // configuration by id
apiEditorRouter.get("/api-config/:id/details", getApiConfigurationWithDetails); // configuration with parameters and operations
apiEditorRouter.get("/api-config/:id/parameters", getApiParametersByConfigId); // parameters by config id
apiEditorRouter.get("/api-config/:id/operations", getApiOperationsByConfigId); // operations by config id
apiEditorRouter.get("/api-config/:id/results", getApiResultsByConfigId); // results by config id
apiEditorRouter.get("/api-parameter/:id", getApiParameterById); // single parameter by id
apiEditorRouter.get("/api-operation/:id", getApiOperationById); // single operation by id

// Delete operations
apiEditorRouter.delete("/api-config/:id", deleteApiConfiguration); // delete configuration and all related data
apiEditorRouter.delete("/api-parameter/:id", deleteApiParameter); // delete specific parameter
apiEditorRouter.delete("/api-operation/:id", deleteApiOperation); // delete specific operation
apiEditorRouter.delete("/api-result/:id", deleteApiResult); // delete specific result
apiEditorRouter.delete(
    "/api-config/:configId/parameters",
    deleteAllApiParameters,
); // delete all parameters for config
apiEditorRouter.delete(
    "/api-config/:configId/operations",
    deleteAllApiOperations,
); // delete all operations for config
apiEditorRouter.delete("/api-config/:configId/results", deleteAllApiResults); // delete all results for config

// Update operations
apiEditorRouter.patch("/api-config/:id", updateApiConfiguration); // update entire configuration
apiEditorRouter.patch("/api-config/:id/name", updateApiConfigurationName); // update configuration name
apiEditorRouter.patch("/api-config/:id/url", updateApiConfigurationUrl); // update API URL
apiEditorRouter.patch("/api-config/:id/status", updateApiConfigurationStatus); // update active status
apiEditorRouter.patch("/api-parameter/:id", updateApiParameter); // update parameter
apiEditorRouter.patch("/api-parameter/:id/type", updateParameterType); // update parameter type
apiEditorRouter.patch("/api-operation/:id", updateApiOperation); // update operation
apiEditorRouter.patch("/api-operation/:id/order", updateApiOperationOrder); // update operation execution order
apiEditorRouter.patch(
    "/api-config/:configId/operations/orders",
    updateOperationOrders,
); // bulk update operation orders
