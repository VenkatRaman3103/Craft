export type field = {
    name?: string;
    type?: fieldTypes;
    label?: string;
    value: string | multiSelect[];
};

export type multiSelect = {
    value: string;
    checked: boolean;
};

export type fieldTypes = "text" | "select" | "multi-select";
