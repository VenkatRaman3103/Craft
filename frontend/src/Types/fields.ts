export type field = {
    name: string;
    type: fieldTypes;
    label: string;
    value: string;
};

export type fieldTypes = "text" | "select" | "multi-select";
