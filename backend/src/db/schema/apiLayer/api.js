import {
    pgTable,
    text,
    integer,
    timestamp,
    jsonb,
    boolean,
    serial,
    varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const apiConfigurations = pgTable("api_configurations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    apiUrl: text("api_url").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    metadata: jsonb("metadata"),
});

export const apiParameters = pgTable("api_parameters", {
    id: serial("id").primaryKey(),
    configId: integer("config_id").references(() => apiConfigurations.id, {
        onDelete: "cascade",
    }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 20 }).notNull().default("string"),
    defaultValue: text("default_value"),
    isRequired: boolean("is_required").default(false),
    options: jsonb("options"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const apiOperations = pgTable("api_operations", {
    id: serial("id").primaryKey(),
    configId: integer("config_id").references(() => apiConfigurations.id, {
        onDelete: "cascade",
    }),
    type: varchar("type", { length: 20 }).notNull(),
    conditionType: varchar("condition_type", { length: 20 })
        .notNull()
        .default("simple"),
    field: varchar("field", { length: 255 }),
    operator: varchar("operator", { length: 20 }),
    value: text("value"),
    customCode: text("custom_code"),
    mapFields: jsonb("map_fields"),
    executionOrder: integer("execution_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const apiResults = pgTable("api_results", {
    id: serial("id").primaryKey(),
    configId: integer("config_id").references(() => apiConfigurations.id, {
        onDelete: "cascade",
    }),
    parameterValues: jsonb("parameter_values"),
    rawData: jsonb("raw_data"),
    processedData: jsonb("processed_data"),
    responseStatus: integer("response_status"),
    responseTime: integer("response_time"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const apiConfigurationsRelations = relations(
    apiConfigurations,
    ({ many }) => ({
        parameters: many(apiParameters),
        operations: many(apiOperations),
        results: many(apiResults),
    }),
);

export const apiParametersRelations = relations(apiParameters, ({ one }) => ({
    configuration: one(apiConfigurations, {
        fields: [apiParameters.configId],
        references: [apiConfigurations.id],
    }),
}));

export const apiOperationsRelations = relations(apiOperations, ({ one }) => ({
    configuration: one(apiConfigurations, {
        fields: [apiOperations.configId],
        references: [apiConfigurations.id],
    }),
}));

export const apiResultsRelations = relations(apiResults, ({ one }) => ({
    configuration: one(apiConfigurations, {
        fields: [apiResults.configId],
        references: [apiConfigurations.id],
    }),
}));
