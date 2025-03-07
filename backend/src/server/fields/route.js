import express from "express";
import { createMultiSelectField, createTextField } from "./crete.js";
import { readTextFields } from "./read.js";

export const fieldRoute = express.Router();

// TODO: make the route for creating text field field

// create text field
fieldRoute.post("/fields/text", createTextField);
fieldRoute.post("/fields/mutli_select", createMultiSelectField);

// read text fields
fieldRoute.get("/fields/text", readTextFields);
