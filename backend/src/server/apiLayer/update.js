import { eq, desc, asc } from "drizzle-orm";
import {
    apiConfigurations,
    apiParameters,
    apiOperations,
    apiResults,
} from "../../db/schema/apiLayer/api.js";
import { db } from "../server.js";

export const updateApiConfiguration = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const [existingConfig] = await db
            .select()
            .from(apiConfigurations)
            .where(eq(apiConfigurations.id, id));

        if (!existingConfig) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        const [updatedConfig] = await db
            .update(apiConfigurations)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(apiConfigurations.id, id))
            .returning();

        res.json({
            message: "API configuration updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Error updating API configuration:", error);
        res.status(500).json({
            error: "Failed to update API configuration",
        });
    }
};

export const updateApiConfigurationName = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        if (!name || typeof name !== "string") {
            return res.status(400).json({
                error: "Valid name is required",
            });
        }

        const [updatedConfig] = await db
            .update(apiConfigurations)
            .set({
                name: name.trim(),
                updatedAt: new Date(),
            })
            .where(eq(apiConfigurations.id, id))
            .returning();

        if (!updatedConfig) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        res.json({
            message: "Configuration name updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Error updating configuration name:", error);
        res.status(500).json({
            error: "Failed to update configuration name",
        });
    }
};

export const updateApiConfigurationUrl = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { apiUrl } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        if (!apiUrl || typeof apiUrl !== "string") {
            return res.status(400).json({
                error: "Valid API URL is required",
            });
        }

        const [updatedConfig] = await db
            .update(apiConfigurations)
            .set({
                apiUrl: apiUrl.trim(),
                updatedAt: new Date(),
            })
            .where(eq(apiConfigurations.id, id))
            .returning();

        if (!updatedConfig) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        res.json({
            message: "API URL updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Error updating API URL:", error);
        res.status(500).json({
            error: "Failed to update API URL",
        });
    }
};

export const updateApiConfigurationStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { isActive } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                error: "Valid status (boolean) is required",
            });
        }

        const [updatedConfig] = await db
            .update(apiConfigurations)
            .set({
                isActive,
                updatedAt: new Date(),
            })
            .where(eq(apiConfigurations.id, id))
            .returning();

        if (!updatedConfig) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        res.json({
            message: "Configuration status updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Error updating configuration status:", error);
        res.status(500).json({
            error: "Failed to update configuration status",
        });
    }
};

export const updateApiParameter = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid parameter ID is required",
            });
        }

        const [existingParameter] = await db
            .select()
            .from(apiParameters)
            .where(eq(apiParameters.id, id));

        if (!existingParameter) {
            return res.status(404).json({
                error: "Parameter not found",
            });
        }

        const [updatedParameter] = await db
            .update(apiParameters)
            .set(updateData)
            .where(eq(apiParameters.id, id))
            .returning();

        res.json({
            message: "Parameter updated successfully",
            data: updatedParameter,
        });
    } catch (error) {
        console.error("Error updating parameter:", error);
        res.status(500).json({
            error: "Failed to update parameter",
        });
    }
};

export const updateApiOperation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid operation ID is required",
            });
        }

        const [existingOperation] = await db
            .select()
            .from(apiOperations)
            .where(eq(apiOperations.id, id));

        if (!existingOperation) {
            return res.status(404).json({
                error: "Operation not found",
            });
        }

        const [updatedOperation] = await db
            .update(apiOperations)
            .set(updateData)
            .where(eq(apiOperations.id, id))
            .returning();

        res.json({
            message: "Operation updated successfully",
            data: updatedOperation,
        });
    } catch (error) {
        console.error("Error updating operation:", error);
        res.status(500).json({
            error: "Failed to update operation",
        });
    }
};

export const updateApiOperationOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { executionOrder } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid operation ID is required",
            });
        }

        if (typeof executionOrder !== "number" || executionOrder < 0) {
            return res.status(400).json({
                error: "Valid execution order (non-negative number) is required",
            });
        }

        const [updatedOperation] = await db
            .update(apiOperations)
            .set({ executionOrder })
            .where(eq(apiOperations.id, id))
            .returning();

        if (!updatedOperation) {
            return res.status(404).json({
                error: "Operation not found",
            });
        }

        res.json({
            message: "Operation execution order updated successfully",
            data: updatedOperation,
        });
    } catch (error) {
        console.error("Error updating operation order:", error);
        res.status(500).json({
            error: "Failed to update operation order",
        });
    }
};

export const updateOperationOrders = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);
        const { operations } = req.body;

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        if (!Array.isArray(operations)) {
            return res.status(400).json({
                error: "Operations array is required",
            });
        }

        const updatedOperations = await db.transaction(async (tx) => {
            const results = [];
            for (const op of operations) {
                if (op.id && typeof op.executionOrder === "number") {
                    const [updated] = await tx
                        .update(apiOperations)
                        .set({ executionOrder: op.executionOrder })
                        .where(eq(apiOperations.id, op.id))
                        .returning();
                    if (updated) results.push(updated);
                }
            }
            return results;
        });

        res.json({
            message: "Operation orders updated successfully",
            data: updatedOperations,
            count: updatedOperations.length,
        });
    } catch (error) {
        console.error("Error updating operation orders:", error);
        res.status(500).json({
            error: "Failed to update operation orders",
        });
    }
};

export const updateParameterType = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { type } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid parameter ID is required",
            });
        }

        const validTypes = ["string", "number", "boolean", "date"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: `Valid type is required. Must be one of: ${validTypes.join(", ")}`,
            });
        }

        const [updatedParameter] = await db
            .update(apiParameters)
            .set({ type })
            .where(eq(apiParameters.id, id))
            .returning();

        if (!updatedParameter) {
            return res.status(404).json({
                error: "Parameter not found",
            });
        }

        res.json({
            message: "Parameter type updated successfully",
            data: updatedParameter,
        });
    } catch (error) {
        console.error("Error updating parameter type:", error);
        res.status(500).json({
            error: "Failed to update parameter type",
        });
    }
};
