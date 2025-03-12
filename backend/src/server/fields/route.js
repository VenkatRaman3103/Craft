import express from "express";
import {
    createColorPickerField,
    createDateField,
    createEmailField,
    createJsonField,
    createMultiSelectField,
    createNumberField,
    createSingleSelectField,
    createTextAreaField,
    createTextField,
} from "./crete.js";
import { readTextFields } from "./read.js";
import {
    deleteColorPickerField,
    deleteDateField,
    deleteEmailField,
    deleteJsonField,
    deleteMultiSelectField,
    deleteNumberField,
    deleteSingleSelectField,
    deleteTextareaField,
    deleteTextField,
    deleteUrlField,
} from "./delete.js";
import {
    patchUpdateTextField,
    patchUpdateMultiSelectField,
    patchUpdateSingleSelectField,
    patchUpdateNumberField,
    patchUpdateEmailField,
    patchUpdateDateField,
    patchUpdateColorPickerField,
    patchUpdateTextareaField,
    patchUpdateJsonField,
    getUrlFields,
    createUrlField,
    patchUpdateUrlField,
} from "./update.js";

export const fieldRoute = express.Router();

// Text field routes
fieldRoute.get("/fields/text", readTextFields); // READ: all text fields
fieldRoute.post("/fields/text", createTextField); // CREATE: text field
fieldRoute.delete("/fields/text_field/:field_id", deleteTextField); // DELETE: text field by field_id
fieldRoute.patch("/fields/text_field/:field_id", patchUpdateTextField); // UPDATE: text field by field_id

// Multi-select field routes
fieldRoute.post("/fields/mutli_select", createMultiSelectField); // CREATE: multi select
fieldRoute.delete("/fields/multi_select/:field_id", deleteMultiSelectField); // DELETE: multi select field by field_id
fieldRoute.patch("/fields/multi_select/:field_id", patchUpdateMultiSelectField); // UPDATE: multi select field by field_id

// Single-select field routes
fieldRoute.post("/fields/single_select", createSingleSelectField); // CREATE: single select
fieldRoute.delete("/fields/single_select/:field_id", deleteSingleSelectField); // DELETE: single select field by field_id
fieldRoute.patch(
    "/fields/single_select/:field_id",
    patchUpdateSingleSelectField,
); // UPDATE: single select field by field_id

// Number field routes
fieldRoute.post("/fields/number", createNumberField); // CREATE: number field
fieldRoute.delete("/fields/number_field/:field_id", deleteNumberField); // DELETE: number field by field_id
fieldRoute.patch("/fields/number_field/:field_id", patchUpdateNumberField); // UPDATE: number field by field_id

// Email field routes
fieldRoute.post("/fields/email", createEmailField); // CREATE: email field
fieldRoute.delete("/fields/email_field/:field_id", deleteEmailField); // DELETE: email field by field_id
fieldRoute.patch("/fields/email_field/:field_id", patchUpdateEmailField); // UPDATE: email field by field_id

// Date field routes
fieldRoute.post("/fields/date", createDateField); // CREATE: date field
fieldRoute.delete("/fields/date_field/:field_id", deleteDateField); // DELETE: date field by field_id
fieldRoute.patch("/fields/date_field/:field_id", patchUpdateDateField); // UPDATE: date field by field_id

// Color picker field routes
fieldRoute.post("/fields/color_picker", createColorPickerField); // CREATE: color picker field
fieldRoute.delete(
    "/fields/color_picker_field/:field_id",
    deleteColorPickerField,
); // DELETE: color picker field by field_id
fieldRoute.patch(
    "/fields/color_picker_field/:field_id",
    patchUpdateColorPickerField,
); // UPDATE: color picker field by field_id

// Textarea field routes
fieldRoute.post("/fields/textarea_field", createTextAreaField); // CREATE: textarea field
fieldRoute.delete("/fields/textarea_field/:field_id", deleteTextareaField); // DELETE: textarea field by field_id
fieldRoute.patch("/fields/textarea_field/:field_id", patchUpdateTextareaField); // UPDATE: textarea field by field_id

// JSON field routes
fieldRoute.post("/fields/json_field", createJsonField); // CREATE: json field
fieldRoute.delete("/fields/json_field/:field_id", deleteJsonField); // DELETE: json field by field_id
fieldRoute.patch("/fields/json_field/:field_id", patchUpdateJsonField); // UPDATE: json field by field_id

// url field
fieldRoute.get("/fields/url_fields", getUrlFields);
fieldRoute.post("/fields/url_field", createUrlField);
fieldRoute.delete("/fields/url_field/:field_id", deleteUrlField);
fieldRoute.patch("/fields/url_field/:field_id", patchUpdateUrlField); // UPDATE: json field by field_id
