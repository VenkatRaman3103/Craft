import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { uploads } from "../../../db/schema/index.js";
import { db } from "../../server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRouter = express.Router();

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname),
        );
    },
});

export const upload = multer({ storage: storage });

uploadsRouter.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "..", "public", "uploads")),
);

// get all uploads
uploadsRouter.get("/uploads", async (req, res) => {
    try {
        const response = await db.select().from(uploads);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

// get upload by id
uploadsRouter.get("/uploads/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const upload = await db
            .select()
            .from(uploads)
            .where(eq(uploads.id, id));

        if (upload.length === 0) {
            return res.status(404).json({ error: "Upload not found" });
        }

        res.json(upload[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

uploadsRouter.get("/uploads/:bucket_id/media-bucket", async (req, res) => {
    try {
        const { bucket_id } = req.params;
        const upload = await db
            .select()
            .from(uploads)
            .where(eq(uploads.mediaBucketId, bucket_id));

        if (upload.length === 0) {
            return res.status(404).json({ error: "Upload not found" });
        }

        res.json(upload);
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` });
    }
});

// upload file to root
uploadsRouter.post("/uploads", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uploadData = {
            id: uuidv4(),
            name: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            mediaBucketId: null,
        };

        const [newUpload] = await db
            .insert(uploads)
            .values(uploadData)
            .returning();

        res.json(newUpload);
    } catch (error) {
        res.status(500).json({ error: `Failed to upload file: ${error}` });
    }
});

// upload file to specific media bucket
uploadsRouter.post(
    "/uploads/:mediaBucketId",
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const { mediaBucketId } = req.params;

            const uploadData = {
                id: uuidv4(),
                name: req.file.originalname,
                path: req.file.path,
                mimeType: req.file.mimetype,
                mediaBucketId: mediaBucketId,
            };

            const [newUpload] = await db
                .insert(uploads)
                .values(uploadData)
                .returning();

            res.json(newUpload);
        } catch (error) {
            res.status(500).json({ error: `Failed to upload file: ${error}` });
        }
    },
);

// update upload name
uploadsRouter.patch("/uploads/:id/name", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const [updatedUpload] = await db
            .update(uploads)
            .set({ name })
            .where(eq(uploads.id, id))
            .returning();

        if (!updatedUpload) {
            return res.status(404).json({ error: "Upload not found" });
        }

        res.json(updatedUpload);
    } catch (error) {
        res.status(500).json({
            error: `Failed to update upload name: ${error}`,
        });
    }
});

// delete upload by id
uploadsRouter.delete("/uploads/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const uploadToDelete = await db
            .select()
            .from(uploads)
            .where(eq(uploads.id, id));

        if (uploadToDelete.length === 0) {
            return res.status(404).json({ error: "Upload not found" });
        }

        // delete the physical file
        if (fs.existsSync(uploadToDelete[0].path)) {
            fs.unlinkSync(uploadToDelete[0].path);
        }

        // delete from database
        await db.delete(uploads).where(eq(uploads.id, id));

        res.json({ message: "Upload deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: `Failed to delete upload: ${error}` });
    }
});

// delete multiple uploads
uploadsRouter.delete("/uploads", async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: "Array of IDs is required" });
        }

        // get uploads info first to delete the files
        const uploadsToDelete = await db
            .select()
            .from(uploads)
            .where(eq(uploads.id, ids));

        // delete physical files
        uploadsToDelete.forEach((upload) => {
            if (fs.existsSync(upload.path)) {
                fs.unlinkSync(upload.path);
            }
        });

        // delete from database
        for (const id of ids) {
            await db.delete(uploads).where(eq(uploads.id, id));
        }

        res.json({ message: `${ids.length} uploads deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: `Failed to delete uploads: ${error}` });
    }
});
