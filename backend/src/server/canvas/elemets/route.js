import express from "express";
import { db } from "../../server.js";
import { elements } from "../../../db/schema/canvas/elements/schema.js";
import { asc, eq } from "drizzle-orm";
import { pagesCanvas } from "../../../db/schema/index.js";

export const elementsRouter = express.Router();

function getDefaultStyles(type) {
    const defaults = {
        div: {
            display: "block",
            width: "100%",
            minHeight: "50px",
            padding: "8px",
            margin: "0px",
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "0px",
        },
        text: {
            fontSize: "16px",
            fontWeight: "400",
            color: "#333333",
            lineHeight: "1.5",
            margin: "0px",
            padding: "4px",
        },
        button: {
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
        },
        image: {
            width: "100%",
            height: "auto",
            objectFit: "cover",
            border: "none",
            borderRadius: "0px",
        },
    };

    return defaults[type] || defaults.div;
}

function buildElementTree(elements) {
    const elementMap = new Map();
    const rootElements = [];

    elements.forEach((element) => {
        elementMap.set(element.id, { ...element, children: [] });
    });

    elements.forEach((element) => {
        if (element.parentId) {
            const parent = elementMap.get(element.parentId);
            if (parent) {
                parent.children.push(elementMap.get(element.id));
            }
        } else {
            rootElements.push(elementMap.get(element.id));
        }
    });

    return rootElements;
}

// create new element with attributes
export const createNewElement = async (req, res) => {
    const { pageId } = req.params;
    const { elementData } = req.body;
    const { type, parentId, styles, content, attributes, order, name } =
        elementData;

    try {
        const response = await db
            .insert(elements)
            .values([
                {
                    pageId,
                    parentId: parentId || null,
                    type,
                    content: content || "",
                    styles: styles || getDefaultStyles(type),
                    attributes: attributes || {},
                    order: order || 0,
                    name: name || `${type}_${Date.now()}`,
                },
            ])
            .returning();
        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/createNewElement/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const getElement = async (req, res) => {
    try {
        const { pageId } = req.params;

        console.log("PageId:", pageId);

        const page = await db
            .select()
            .from(pagesCanvas)
            .where(eq(pagesCanvas.page_id, pageId))
            .limit(1);

        const allElements = await db
            .select()
            .from(elements)
            .where(eq(elements.pageId, pageId))
            .orderBy(asc(elements.order));

        const elementTree = buildElementTree(allElements);

        res.json({
            page: page[0],
            elements: elementTree,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

elementsRouter.get("/elements/:pageId", getElement);
elementsRouter.post("/elements/:pageId", createNewElement);

// getting the data from db and generating the html and bind css stylling with tags using name as class
function generateHTML(elements, depth = 0) {
    return elements
        .map((element) => {
            const tag = getHTMLTag(element.type);
            const attrs = generateAttributes(element);
            const content = element.content || "";

            if (element.children && element.children.length > 0) {
                const childrenHTML = generateHTML(element.children, depth + 1);
                return `<${tag}${attrs}>${content}${childrenHTML}</${tag}>`;
            } else {
                if (["img", "input", "br", "hr"].includes(tag)) {
                    return `<${tag}${attrs} />`;
                }
                return `<${tag}${attrs}>${content}</${tag}>`;
            }
        })
        .join("\n");
}

function generateCSS(elements) {
    const flatElements = flattenElements(elements);

    return flatElements
        .map((element) => {
            const selector = `.${element.name}`;
            const styles = Object.entries(element.styles || {})
                .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
                .join("\n");
            return `${selector} {\n${styles}\n}`;
        })
        .join("\n\n");
}

function generateAttributes(element) {
    let attrs = ` class="${element.name}"`;
    if (element.attributes) {
        Object.entries(element.attributes).forEach(([key, value]) => {
            attrs += ` ${key}="${value}"`;
        });
    }
    return attrs;
}

function getHTMLTag(type) {
    const tagMap = {
        div: "div",
        text: "p",
        heading: "h2",
        button: "button",
        image: "img",
        link: "a",
        input: "input",
        container: "div",
    };
    return tagMap[type] || "div";
}

function camelToKebab(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function flattenElements(elements) {
    const flat = [];
    elements.forEach((element) => {
        flat.push(element);
        if (element.children && element.children.length > 0) {
            flat.push(...flattenElements(element.children));
        }
    });
    return flat;
}

export const generatePageHTML = async (req, res) => {
    try {
        const { pageId } = req.params;

        const page = await db
            .select()
            .from(pagesCanvas)
            .where(eq(pagesCanvas.page_id, pageId))
            .limit(1);

        const allElements = await db
            .select()
            .from(elements)
            .where(eq(elements.pageId, pageId))
            .orderBy(asc(elements.order));

        const elementTree = buildElementTree(allElements);

        const htmlContent = generateHTML(elementTree);
        const cssContent = generateCSS(elementTree);

        const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page[0]?.title || "Generated Page"}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        
        /* styles */
${cssContent}
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

        res.setHeader("Content-Type", "text/html");
        res.send(fullHTML);
    } catch (error) {
        console.error("Error generating HTML:", error);
        res.status(500).json({
            error: error.message,
            message: "Error generating HTML page",
            origin: "backend/generatePageHTML/GET",
        });
    }
};

elementsRouter.get("/elements/:pageId/html", generatePageHTML);

export const updateElement = async (req, res) => {
    const { elementId } = req.params;
    try {
        const updates = req.body;

        const updatedElement = await db
            .update(elements)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(elements.id, elementId))
            .returning();

        if (!updatedElement.length) {
            return res.status(404).json({ error: "Element not found" });
        }

        res.json(updatedElement[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

elementsRouter.patch("/elements/:elementId", updateElement);

export const deleteElementById = async (req, res) => {
    try {
        const { elementId } = req.params;

        const deletedElement = await db
            .delete(elements)
            .where(eq(elements.id, elementId))
            .returning();

        if (!deletedElement.length) {
            return res.status(404).json({ error: "Element not found" });
        }

        res.json(deletedElement[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

elementsRouter.delete("/elements/:elementId", deleteElementById);
