import { eq, desc, asc } from "drizzle-orm";
import {
    apiConfigurations,
    apiParameters,
    apiOperations,
    apiResults,
} from "../../db/schema/apiLayer/api.js";
import { db } from "../server.js";

export const getAllApiConfigurations = async (req, res) => {
    try {
        const { includeInactive = false } = req.query;

        let query = db.select().from(apiConfigurations);

        if (!includeInactive) {
            query = query.where(eq(apiConfigurations.isActive, true));
        }

        const configurations = await query.orderBy(
            desc(apiConfigurations.updatedAt),
        );

        res.json({
            message: "API configurations retrieved successfully",
            data: configurations,
            count: configurations.length,
        });
    } catch (error) {
        console.error("Error fetching API configurations:", error);
        res.status(500).json({
            error: "Failed to fetch API configurations",
        });
    }
};

export const getApiConfigurationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const [configuration] = await db
            .select()
            .from(apiConfigurations)
            .where(eq(apiConfigurations.id, id));

        if (!configuration) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        res.json({
            message: "API configuration retrieved successfully",
            data: configuration,
        });
    } catch (error) {
        console.error("Error fetching API configuration:", error);
        res.status(500).json({
            error: "Failed to fetch API configuration",
        });
    }
};

export const getApiConfigurationWithDetails = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const [configuration] = await db
            .select()
            .from(apiConfigurations)
            .where(eq(apiConfigurations.id, id));

        if (!configuration) {
            return res.status(404).json({
                error: "API configuration not found",
            });
        }

        const parameters = await db
            .select()
            .from(apiParameters)
            .where(eq(apiParameters.configId, id))
            .orderBy(asc(apiParameters.createdAt));

        const operations = await db
            .select()
            .from(apiOperations)
            .where(eq(apiOperations.configId, id))
            .orderBy(asc(apiOperations.executionOrder));

        res.json({
            message: "API configuration with details retrieved successfully",
            data: {
                configuration,
                parameters,
                operations,
            },
        });
    } catch (error) {
        console.error("Error fetching API configuration details:", error);
        res.status(500).json({
            error: "Failed to fetch API configuration details",
        });
    }
};

export const getApiParametersByConfigId = async (req, res) => {
    try {
        const configId = parseInt(req.params.id);

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const parameters = await db
            .select()
            .from(apiParameters)
            .where(eq(apiParameters.configId, configId))
            .orderBy(asc(apiParameters.createdAt));

        res.json({
            message: "Parameters retrieved successfully",
            data: parameters,
            count: parameters.length,
        });
    } catch (error) {
        console.error("Error fetching parameters:", error);
        res.status(500).json({
            error: "Failed to fetch parameters",
        });
    }
};

export const getApiOperationsByConfigId = async (req, res) => {
    try {
        const configId = parseInt(req.params.id);

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const operations = await db
            .select()
            .from(apiOperations)
            .where(eq(apiOperations.configId, configId))
            .orderBy(asc(apiOperations.executionOrder));

        res.json({
            message: "Operations retrieved successfully",
            data: operations,
            count: operations.length,
        });
    } catch (error) {
        console.error("Error fetching operations:", error);
        res.status(500).json({
            error: "Failed to fetch operations",
        });
    }
};

export const getApiResultsByConfigId = async (req, res) => {
    try {
        const configId = parseInt(req.params.id);
        const { limit = 10, offset = 0 } = req.query;

        if (!configId || isNaN(configId)) {
            return res.status(400).json({
                error: "Valid configuration ID is required",
            });
        }

        const results = await db
            .select()
            .from(apiResults)
            .where(eq(apiResults.configId, configId))
            .orderBy(desc(apiResults.createdAt))
            .limit(parseInt(limit))
            .offset(parseInt(offset));

        res.json({
            message: "Results retrieved successfully",
            data: results,
            count: results.length,
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({
            error: "Failed to fetch results",
        });
    }
};

export const getApiParameterById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid parameter ID is required",
            });
        }

        const [parameter] = await db
            .select()
            .from(apiParameters)
            .where(eq(apiParameters.id, id));

        if (!parameter) {
            return res.status(404).json({
                error: "Parameter not found",
            });
        }

        res.json({
            message: "Parameter retrieved successfully",
            data: parameter,
        });
    } catch (error) {
        console.error("Error fetching parameter:", error);
        res.status(500).json({
            error: "Failed to fetch parameter",
        });
    }
};

export const getApiOperationById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Valid operation ID is required",
            });
        }

        const [operation] = await db
            .select()
            .from(apiOperations)
            .where(eq(apiOperations.id, id));

        if (!operation) {
            return res.status(404).json({
                error: "Operation not found",
            });
        }

        res.json({
            message: "Operation retrieved successfully",
            data: operation,
        });
    } catch (error) {
        console.error("Error fetching operation:", error);
        res.status(500).json({
            error: "Failed to fetch operation",
        });
    }
};
