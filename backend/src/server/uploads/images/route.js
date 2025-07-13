import multer from "multer";
import fs from "fs/promises";
import path from "path";
import express from "express";
import { images } from "./schema/images";
import { db } from "../../server";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded");

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `/uploads/${fileName}`;
        const fullPath = path.join(
            __dirname,
            "..",
            "public",
            "uploads",
            fileName,
        );

        await fs.writeFile(fullPath, file.buffer);

        await db.insert(images).values({
            name: file.originalname,
            path: filePath,
            mimeType: file.mimetype,
        });

        res.json({ message: "Upload successful", filePath });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;
