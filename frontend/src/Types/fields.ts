export type field = {
    name?: string;
    type?: fieldTypes;
    label?: string;
    value?: string | multiSelect[];
};

export type multiSelect = {
    value: string;
    checked: boolean;
};

export type fieldTypes =
    | "text_field"
    | "number_field"
    | "email_field"
    | "multi_select_field"
    | "single_select_field";

// promt
export type fieldPromt = {
    id: string;
    name: string;
    type: fieldTypes;
};
