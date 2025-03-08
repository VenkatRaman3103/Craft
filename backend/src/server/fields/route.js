import express from "express";
import {
    createMultiSelectField,
    createNumberField,
    createSingleSelectField,
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
