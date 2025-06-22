import { desc, eq } from "drizzle-orm";
import {
    apiConfigurations,
    apiParameters,
    apiOperations,
    apiResults,
} from "../../db/schema/apiLayer/api.js";
import { db } from "../server.js";

export const deleteApiConfiguration = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

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

        const [deletedConfig] = await db
            .delete(apiConfigurations)
            .where(eq(apiConfigurations.id, id))
            .returning();

        res.json({
            message:
                "API configuration and all related data deleted successfully",
            data: deletedConfig,
        });
    } catch (error) {
        console.error("Error deleting API configuration:", error);
        res.status(500).json({
            error: "Failed to delete API configuration",
        });
    }
};

export const deleteApiParameter = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

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

        const [deletedParameter] = await db
            .delete(apiParameters)
            .where(eq(apiParameters.id, id))
            .returning();

        res.json({
            message: "Parameter deleted successfully",
            data: deletedParameter,
        });
    } catch (error) {
        console.error("Error deleting parameter:", error);
        res.status(500).json({
            error: "Failed to delete parameter",
        });
    }
};

export const deleteApiOperation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

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

        const [deletedOperation] = await db
            .delete(apiOperations)
            .where(eq(apiOperations.id, id))
            .returning();

        res.json({
            message: "Operation deleted successfully",
            data: deletedOperation,
        });
    } catch (error) {
        console.error("Error deleting operation:", error);
        res.status(500).json({
            error: "Failed to delete operation",
        });
    }
};

export const deleteApiResult = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid result ID is required",
            });
        }

        const [existingResult] = await db
            .select()
            .from(apiResults)
            .where(eq(apiResults.id, id));

        if (!existingResult) {
            return res.status(404).json({
                error: "Result not found",
            });
        }

        const [deletedResult] = await db
            .delete(apiResults)
            .where(eq(apiResults.id, id))
            .returning();

        res.json({
            message: "Result deleted successfully",
            data: deletedResult,
        });
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(500).json({
            error: "Failed to delete result",
        });
    }
};

export const deleteAllApiParameters = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const deletedParameters = await db
            .delete(apiParameters)
            .where(eq(apiParameters.configId, configId))
            .returning();

        res.json({
            message: "All parameters deleted successfully",
            data: deletedParameters,
            count: deletedParameters.length,
        });
    } catch (error) {
        console.error("Error deleting parameters:", error);
        res.status(500).json({
            error: "Failed to delete parameters",
        });
    }
};

export const deleteAllApiOperations = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const deletedOperations = await db
            .delete(apiOperations)
            .where(eq(apiOperations.configId, configId))
            .returning();

        res.json({
            message: "All operations deleted successfully",
            data: deletedOperations,
            count: deletedOperations.length,
        });
    } catch (error) {
        console.error("Error deleting operations:", error);
        res.status(500).json({
            error: "Failed to delete operations",
        });
    }
};

export const deleteAllApiResults = async (req, res) => {
    try {
        const configId = parseInt(req.params.configId);

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const deletedResults = await db
            .delete(apiResults)
            .where(eq(apiResults.configId, configId))
            .returning();

        res.json({
            message: "All results deleted successfully",
            data: deletedResults,
            count: deletedResults.length,
        });
    } catch (error) {
        console.error("Error deleting results:", error);
        res.status(500).json({
            error: "Failed to delete results",
        });
    }
};
