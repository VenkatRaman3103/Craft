import express from "express";
import { createTextField } from "./crete.js";
import { readTextFields } from "./read.js";

export const fieldRoute = express.Router();

// TODO: make the route for creating text field field

// create text field
fieldRoute.post("/fields/text", createTextField);

// read text fields
fieldRoute.get("/fields/text", readTextFields);
