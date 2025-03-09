import { pages } from "../../db/schema/pages.js";
import { db } from "../server.js";

function transformPageData(pageData) {
    if (!pageData) return null;

    const transformedPage = {
        page_id: pageData.page_id,
        title: pageData.title,
        slug: pageData.slug,
        created_at: pageData.created_at,
        edited_at: pageData.edited_at,
        fields: [],
    };

    // Transform page items into a more usable structure
    if (pageData.page_items && Array.isArray(pageData.page_items)) {
        pageData.page_items.forEach((item) => {
            // Determine the field type and get the appropriate field data
            const fieldType = item.item_type;
            const fieldData = item[fieldType];

            if (fieldData) {
                // Add only the needed properties to the fields array
                const field = {
                    id: item.item_id,
                    type: fieldType,
                    name: fieldData.name,
                    label: fieldData.label,
                    value: fieldData.value,
                };

                // Handle special field types with additional properties
                if (fieldType === "color_picker_field") {
                    field.hex = fieldData.hex;
                    field.rgb = fieldData.rgb;
                } else if (
                    fieldType === "single_select_field" ||
                    fieldType === "multi_select_field"
                ) {
                    field.options = fieldData.options?.map((option) => ({
                        id: option.option_id,
                        label: option.label,
                        value: option.value,
                        is_selected: option.is_selected,
                    }));
                }

                transformedPage.fields.push(field);
            }
        });
    }

    return transformedPage;
}

// READ: all pages with transformed structure
export async function getAllPages(req, res) {
    try {
        const allPages = await db.select().from(pages);
        // Simple transformation for the list view
        const transformedPages = allPages.map((page) => ({
            page_id: page.page_id,
            title: page.title,
            slug: page.slug,
            created_at: page.created_at,
            edited_at: page.edited_at,
        }));

        res.status(200).json(transformedPages);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the pages`,
            origin: "backend/pagesRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// READ: page by id with transformed data (standard endpoint)
export async function getPageById(req, res) {
    const { page_id } = req.params;
    try {
        const page = await db.query.pages.findFirst({
            where: (page, { eq }) => eq(page.page_id, page_id),
            with: {
                page_items: {
                    with: {
                        text_field: true,
                        block: true,
                        multi_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        single_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        number_field: true,
                        email_field: true,
                        date_field: true,
                        color_picker_field: true,
                        textarea_field: true,
                    },
                },
            },
        });

        // Transform the page data before sending it to the client
        const transformedPage = transformPageData(page);
        res.status(200).json(transformedPage);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the page: ${page_id}`,
            origin: "backend/pagesRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// READ: page by id with raw data (separate endpoint)
export async function getRawPageById(req, res) {
    const { page_id } = req.params;
    try {
        const page = await db.query.pages.findFirst({
            where: (page, { eq }) => eq(page.page_id, page_id),
            with: {
                page_items: {
                    with: {
                        text_field: true,
                        block: true,
                        multi_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        single_select_field: {
                            with: {
                                options: true,
                            },
                        },
                        number_field: true,
                        email_field: true,
                        date_field: true,
                        color_picker_field: true,
                        textarea_field: true,
                    },
                },
            },
        });

        // Return the raw, untransformed data
        res.status(200).json(page);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching raw page data: ${page_id}`,
            origin: "backend/pagesRouter/GET/raw",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// Example of how you could set up these routes in your router file:
/*
router.get('/pages', getAllPages);
router.get('/pages/:page_id', getPageById);
router.get('/pages/:page_id/raw', getRawPageById);
*/
