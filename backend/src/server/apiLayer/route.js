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

// NEW: Get latest results for API configuration
apiEditorRouter.get("/api-config/:id/latest-results", async (req, res) => {
    try {
        const configId = parseInt(req.params.id);

        if (isNaN(configId)) {
            return res.status(400).json({ error: "Invalid configuration ID" });
        }

        // Get the latest result using your existing function but limit to 1
        const results = await getApiResultsByConfigId(configId, 1); // Assuming you can pass a limit

        if (!results || results.length === 0) {
            return res.json({
                processedData: [],
                rawData: null,
                lastExecuted: null,
            });
        }

        const latestResult = results[0];
        res.json({
            processedData: latestResult.processedData
                ? JSON.parse(latestResult.processedData)
                : [],
            rawData: latestResult.rawData
                ? JSON.parse(latestResult.rawData)
                : null,
            parameterValues: latestResult.parameterValues
                ? JSON.parse(latestResult.parameterValues)
                : {},
            responseStatus: latestResult.responseStatus,
            responseTime: latestResult.responseTime,
            errorMessage: latestResult.errorMessage,
            lastExecuted: latestResult.createdAt,
        });
    } catch (error) {
        console.error("Error fetching latest API results:", error);
        res.status(500).json({ error: "Failed to fetch API results" });
    }
});

// NEW: Execute API configuration and return processed data
apiEditorRouter.post("/api-config/:id/execute", async (req, res) => {
    try {
        const configId = parseInt(req.params.id);
        const { parameterValues = {} } = req.body;

        if (isNaN(configId)) {
            return res.status(400).json({ error: "Invalid configuration ID" });
        }

        // Get the configuration with its operations using your existing function
        const config = await getApiConfigurationWithDetails(configId);
        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        // Build the API URL with parameters
        const apiUrl = buildApiUrlWithParams(
            config.configuration.apiUrl,
            parameterValues,
        );

        // Fetch data from the API
        const startTime = Date.now();
        const apiResponse = await fetch(apiUrl);
        const responseTime = Date.now() - startTime;

        if (!apiResponse.ok) {
            throw new Error(
                `API request failed with status ${apiResponse.status}`,
            );
        }

        const rawData = await apiResponse.json();

        // Process the raw data into array format (same logic as in ApiEditor)
        let processedArray = rawData;
        if (!Array.isArray(rawData)) {
            if (rawData.data && Array.isArray(rawData.data)) {
                processedArray = rawData.data;
            } else if (rawData.results && Array.isArray(rawData.results)) {
                processedArray = rawData.results;
            } else if (rawData.items && Array.isArray(rawData.items)) {
                processedArray = rawData.items;
            } else {
                processedArray = [rawData];
            }
        }

        // Apply operations to the data
        let result = [...processedArray];

        // Sort operations by execution order
        const sortedOperations = config.operations.sort(
            (a, b) => (a.executionOrder || 0) - (b.executionOrder || 0),
        );

        // Execute each operation
        for (const op of sortedOperations) {
            if (op.type === "filter") {
                if (op.conditionType === "simple") {
                    result = result.filter((item) => {
                        const fieldValue = op.field
                            .split(".")
                            .reduce((obj, key) => obj?.[key], item);
                        const compareValue = op.value;

                        switch (op.operator) {
                            case "===":
                                return fieldValue === compareValue;
                            case "!==":
                                return fieldValue !== compareValue;
                            case ">":
                                return (
                                    Number(fieldValue) > Number(compareValue)
                                );
                            case "<":
                                return (
                                    Number(fieldValue) < Number(compareValue)
                                );
                            case ">=":
                                return (
                                    Number(fieldValue) >= Number(compareValue)
                                );
                            case "<=":
                                return (
                                    Number(fieldValue) <= Number(compareValue)
                                );
                            case "includes":
                                if (Array.isArray(fieldValue))
                                    return fieldValue.includes(compareValue);
                                return String(fieldValue).includes(
                                    String(compareValue),
                                );
                            case "startsWith":
                                return String(fieldValue).startsWith(
                                    String(compareValue),
                                );
                            case "endsWith":
                                return String(fieldValue).endsWith(
                                    String(compareValue),
                                );
                            default:
                                return false;
                        }
                    });
                } else {
                    // Custom filter code
                    const filterFunction = new Function(
                        "item",
                        `return ${op.customCode || "true"}`,
                    );
                    result = result.filter(filterFunction);
                }
            } else if (op.type === "map") {
                if (op.conditionType === "simple") {
                    result = result.map((item) => {
                        const newItem = {};
                        op.mapFields.forEach((field) => {
                            if (field.type === "copy" && field.from) {
                                const value = field.from
                                    .split(".")
                                    .reduce((obj, key) => obj?.[key], item);
                                newItem[field.to || field.from] = value;
                            } else if (field.type === "value" && field.to) {
                                newItem[field.to] = field.value;
                            } else if (field.type === "transform" && field.to) {
                                const transformFunction = new Function(
                                    "item",
                                    `return ${field.value}`,
                                );
                                newItem[field.to] = transformFunction(item);
                            }
                        });
                        return Object.keys(newItem).length > 0 ? newItem : item;
                    });
                } else {
                    // Custom map code
                    const mapFunction = new Function(
                        "item",
                        `return ${op.customCode || "item"}`,
                    );
                    result = result.map(mapFunction);
                }
            }
        }

        // Save the results to database using your existing function
        const resultData = {
            configId,
            parameterValues: JSON.stringify(parameterValues),
            rawData: JSON.stringify(rawData),
            processedData: JSON.stringify(result),
            responseStatus: apiResponse.status,
            responseTime,
            errorMessage: null,
        };

        await createApiResult(resultData);

        res.json({
            processedData: result,
            rawData,
            responseStatus: apiResponse.status,
            responseTime,
            itemCount: result.length,
            originalItemCount: processedArray.length,
        });
    } catch (error) {
        console.error("Error executing API configuration:", error);

        // Save error result using your existing function
        try {
            const errorResultData = {
                configId: parseInt(req.params.id),
                parameterValues: JSON.stringify(req.body.parameterValues || {}),
                rawData: null,
                processedData: null,
                responseStatus: 0,
                responseTime: null,
                errorMessage: error.message,
            };

            await createApiResult(errorResultData);
        } catch (saveError) {
            console.error("Error saving error result:", saveError);
        }

        res.status(500).json({
            error: "Failed to execute API configuration",
            message: error.message,
        });
    }
});

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

// Helper function to build API URL with parameters
function buildApiUrlWithParams(baseUrl, params) {
    try {
        const url = new URL(baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            if (value && value.trim()) {
                url.searchParams.set(key, value.trim());
            }
        });
        return url.toString();
    } catch (error) {
        console.error("Invalid URL:", baseUrl, error);
        throw new Error("Invalid API URL format");
    }
}
