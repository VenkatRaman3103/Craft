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

export const fieldRoute = express.Router();

// TODO: make the route for creating text field field

// text field
// READ: all text fields
fieldRoute.get("/fields/text", readTextFields);
// CREATE: text field
fieldRoute.post("/fields/text", createTextField);

// multi select
// CREATE: multi select
fieldRoute.post("/fields/mutli_select", createMultiSelectField);

// single select
// CREATE: single select
fieldRoute.post("/fields/single_select", createSingleSelectField);

// number field
// CREATE: number field
fieldRoute.post("/fields/number", createNumberField);

// email field
// CREATE: email field
fieldRoute.post("/fields/email", createEmailField);

// date field
// CREATE: date field
fieldRoute.post("/fields/date", createDateField);

// color picker
// CREATE: color picker
fieldRoute.post("/fields/color_picker", createColorPickerField);

// textarea
// CREATE: color picker
fieldRoute.post("/fields/textarea_field", createTextAreaField);

// json
// CREATE: json
fieldRoute.post("/fields/json", createJsonField);
