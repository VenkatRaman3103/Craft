import express from "express";
import { createReferenceBlock } from "./create.js";

export const referenceBlockRouter = express.Router();

referenceBlockRouter.post("/reference", createReferenceBlock);
