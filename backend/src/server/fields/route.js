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
} from "./delete.js";
import { patchUpdateTextField } from "./update.js";

export const fieldRoute = express.Router();

// TODO: make the route for creating text field field

// text field
fieldRoute.get("/fields/text", readTextFields); // READ: all text fields
fieldRoute.post("/fields/text", createTextField); // CREATE: text field
fieldRoute.delete("/fields/text_field/:field_id", deleteTextField); // DELETE: text field by field_id
fieldRoute.patch("/fields/text_field/:field_id", patchUpdateTextField);

// multi select
fieldRoute.post("/fields/mutli_select", createMultiSelectField); // CREATE: multi select
fieldRoute.delete("/fields/multi_select/:field_id", deleteMultiSelectField); // DELETE: multi select field by field_id

// single select

fieldRoute.post("/fields/single_select", createSingleSelectField); // CREATE: single select
fieldRoute.delete("/fields/single_select/:field_id", deleteSingleSelectField); // DELETE: text field by field_id

// number field
fieldRoute.post("/fields/number", createNumberField); // CREATE: number field
fieldRoute.delete("/fields/number_field/:field_id", deleteNumberField); // DELETE: number field by field_id

// email field

fieldRoute.post("/fields/email", createEmailField); // CREATE: email field
fieldRoute.delete("/fields/email_field/:field_id", deleteEmailField); // DELETE: email field by field_id

// date field
fieldRoute.post("/fields/date", createDateField); // CREATE: date field
fieldRoute.delete("/fields/date_field/:field_id", deleteDateField); // DELETE: date field by field_id

// color picker
fieldRoute.post("/fields/color_picker", createColorPickerField); // CREATE: color picker
fieldRoute.delete(
    "/fields/color_picker_field/:field_id",
    deleteColorPickerField,
); // DELETE: color picker field by field_id

// textarea
fieldRoute.post("/fields/textarea_field", createTextAreaField); // CREATE: color picker
fieldRoute.delete("/fields/textarea_field/:field_id", deleteTextareaField); // DELETE: textarea field by field_id

// json
fieldRoute.post("/fields/json_field", createJsonField); // CREATE: json
fieldRoute.delete("/fields/json_field/:field_id", deleteJsonField); // DELETE: json field by field_id
