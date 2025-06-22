interface ApiParam {
    name: string;
    description: string;
    type: "string" | "number" | "boolean" | "date";
    defaultValue?: string;
    options?: string[];
}

export const availableParams: ApiParam[] = [
    {
        name: "type",
        description: "Filter by item type (comma-separated)",
        type: "string",
        defaultValue: "",
    },
    {
        name: "scope",
        description: "Filter by scope",
        type: "string",
        defaultValue: "",
    },
    {
        name: "limit",
        description: "Maximum number of items to return",
        type: "number",
        defaultValue: "",
    },
    {
        name: "offset",
        description: "Number of items to skip",
        type: "number",
        defaultValue: "",
    },
    {
        name: "sort",
        description: "Field to sort by",
        type: "string",
        defaultValue: "",
    },
    {
        name: "order",
        description: "Sort order",
        type: "string",
        options: ["asc", "desc"],
        defaultValue: "asc",
    },
    {
        name: "search",
        description: "Search in name, label, or description",
        type: "string",
        defaultValue: "",
    },
    {
        name: "required",
        description: "Filter by required status",
        type: "boolean",
        options: ["true", "false"],
        defaultValue: "",
    },
    {
        name: "fields",
        description: "Select specific fields (comma-separated)",
        type: "string",
        defaultValue: "",
    },
    {
        name: "exclude_empty",
        description: "Exclude items with empty values",
        type: "boolean",
        options: ["true", "false"],
        defaultValue: "",
    },
    {
        name: "date_from",
        description: "Filter items created after this date",
        type: "date",
        defaultValue: "",
    },
    {
        name: "date_to",
        description: "Filter items created before this date",
        type: "date",
        defaultValue: "",
    },
    {
        name: "include_nested",
        description: "Include nested data structures",
        type: "boolean",
        options: ["true", "false"],
        defaultValue: "",
    },
    {
        name: "format",
        description: "Response format",
        type: "string",
        options: ["grouped", "flat"],
        defaultValue: "",
    },
];

export const operationTypes = [
    { value: "filter", label: "Filter (item => boolean)" },
    { value: "map", label: "Map (item => newItem)" },
];

export const conditionTypes = [
    { value: "simple", label: "Simple Condition" },
    { value: "custom", label: "Custom JavaScript" },
];

export const operators = [
    { value: "===", label: "Equals (===)" },
    { value: "!==", label: "Not Equals (!==)" },
    { value: ">", label: "Greater Than (>)" },
    { value: "<", label: "Less Than (<)" },
    { value: ">=", label: "Greater Than or Equal (>=)" },
    { value: "<=", label: "Less Than or Equal (<=)" },
    { value: "includes", label: "Includes (string/array)" },
    { value: "startsWith", label: "Starts With" },
    { value: "endsWith", label: "Ends With" },
    { value: "&&", label: "AND (&&)" },
    { value: "||", label: "OR (||)" },
];
