export const fieldTypeOptions = [
    // -------------------- TEXT FIELDS --------------------
    {
        name: "Text",
        description: "single line text (max 255 chars)",
        value: "text",
    },
    { name: "Textarea", description: "multi-line text", value: "textarea" },
    {
        name: "Rich Text",
        description: "formatted content with TipTap",
        value: "rich_text",
    },
    { name: "Markdown", description: "markdown editor", value: "markdown" },

    // -------------------- NUMBER FIELDS --------------------
    { name: "Number", description: "integer or decimal", value: "number" },
    {
        name: "Currency",
        description: "currency with selector",
        value: "currency",
    },
    {
        name: "Percentage",
        description: "percentage value",
        value: "percentage",
    },

    // -------------------- SELECTION FIELDS --------------------
    {
        name: "Select",
        description: "dropdown (single choice)",
        value: "select",
    },
    {
        name: "Radio",
        description: "radio options (single choice)",
        value: "radio",
    },
    { name: "Checkbox", description: "multiple choices", value: "checkbox" },
    { name: "Tags", description: "free-form tags (multiple)", value: "tags" },

    // -------------------- DATE/TIME --------------------
    { name: "Date", description: "date picker", value: "date" },
    { name: "DateTime", description: "date + time picker", value: "datetime" },
    { name: "Time", description: "time picker", value: "time" },

    // -------------------- MEDIA FIELDS --------------------
    { name: "Image", description: "single image upload", value: "image" },
    { name: "File", description: "file upload", value: "file" },
    { name: "Gallery", description: "multiple image upload", value: "gallery" },
    { name: "Video", description: "video upload or embed", value: "video" },

    // -------------------- RELATIONSHIP --------------------
    {
        name: "Relation",
        description: "link to another collection",
        value: "relation",
    },
    {
        name: "One-to-one",
        description: "one-to-one relational link",
        value: "one_to_one",
    },
    {
        name: "One-to-many",
        description: "one-to-many relational link",
        value: "one_to_many",
    },
    {
        name: "Many-to-many",
        description: "many-to-many relational link",
        value: "many_to_many",
    },
    {
        name: "Self-reference",
        description: "link to the same collection",
        value: "self_reference",
    },

    // -------------------- BOOLEAN --------------------
    { name: "Toggle", description: "true/false switch", value: "toggle" },

    // -------------------- SPECIAL FIELDS --------------------
    { name: "JSON", description: "raw JSON editor", value: "json" },
    {
        name: "Code",
        description: "code editor with syntax highlighting",
        value: "code",
    },
    { name: "Color", description: "color picker", value: "color" },
    { name: "URL", description: "URL with validation", value: "url" },
    { name: "Email", description: "email with validation", value: "email" },
    {
        name: "Phone",
        description: "phone number with validation",
        value: "phone",
    },
];
