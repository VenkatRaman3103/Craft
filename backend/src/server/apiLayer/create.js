import { desc, eq } from "drizzle-orm";
import {
    apiConfigurations,
    apiParameters,
    apiOperations,
    apiResults,
} from "../../db/schema/apiLayer/api.js";
import { db } from "../server.js";

export const createApiConfiguration = async (req, res) => {
    try {
        const {
            name,
            description,
            apiUrl,
            parameters = [],
            operations = [],
            metadata,
        } = req.body;

        if (!name || !apiUrl) {
            return res.status(400).json({
                error: "Name and API URL are required",
            });
        }

        const result = await db.transaction(async (tx) => {
            const [newConfig] = await tx
                .insert(apiConfigurations)
                .values({
                    name,
                    description,
                    apiUrl,
                    metadata,
                    isActive: true,
                })
                .returning();

            const createdParameters = [];
            if (parameters.length > 0) {
                const parametersToInsert = parameters.map((param) => ({
                    ...param,
                    configId: newConfig.id,
                }));

                const insertedParams = await tx
                    .insert(apiParameters)
                    .values(parametersToInsert)
                    .returning();
                createdParameters.push(...insertedParams);
            }

            const createdOperations = [];
            if (operations.length > 0) {
                const operationsToInsert = operations.map((op, index) => ({
                    ...op,
                    configId: newConfig.id,
                    executionOrder: op.executionOrder ?? index,
                }));

                const insertedOps = await tx
                    .insert(apiOperations)
                    .values(operationsToInsert)
                    .returning();
                createdOperations.push(...insertedOps);
            }

            return {
                configuration: newConfig,
                parameters: createdParameters,
                operations: createdOperations,
            };
        });

        res.status(201).json({
            message: "API configuration created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error creating API configuration:", error);
        res.status(500).json({
            error: "Failed to create API configuration",
        });
    }
};

export const createApiParameter = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);
        const parameterData = req.body;

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const [newParameter] = await db
            .insert(apiParameters)
            .values({
                ...parameterData,
                configId,
            })
            .returning();

        res.status(201).json({
            message: "Parameter created successfully",
            data: newParameter,
        });
    } catch (error) {
        console.error("Error creating parameter:", error);
        res.status(500).json({
            error: "Failed to create parameter",
        });
    }
};

export const createApiOperation = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);
        const operationData = req.body;

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const existingOps = await db
            .select({ executionOrder: apiOperations.executionOrder })
            .from(apiOperations)
            .where(eq(apiOperations.configId, configId))
            .orderBy(desc(apiOperations.executionOrder))
            .limit(1);

        const nextOrder =
            existingOps.length > 0 ? existingOps[0].executionOrder + 1 : 0;

        const [newOperation] = await db
            .insert(apiOperations)
            .values({
                ...operationData,
                configId,
                executionOrder: operationData.executionOrder ?? nextOrder,
            })
            .returning();

        res.status(201).json({
            message: "Operation created successfully",
            data: newOperation,
        });
    } catch (error) {
        console.error("Error creating operation:", error);
        res.status(500).json({
            error: "Failed to create operation",
        });
    }
};

export const createApiResult = async (req, res) => {
    try {
        const resultData = req.body;

        if (!resultData.configId) {
            return res.status(400).json({
                error: "Configuration ID is required",
            });
        }

        const [newResult] = await db
            .insert(apiResults)
            .values(resultData)
            .returning();

        res.status(201).json({
            message: "API result saved successfully",
            data: newResult,
        });
    } catch (error) {
        console.error("Error saving API result:", error);
        res.status(500).json({
            error: "Failed to save API result",
        });
    }
};
