export type field = {
    name?: string;
    type?: fieldTypes;
    label?: string;
    value?: string | multiSelect[];
    hex?: string;
    rgb?: string;
    rgba?: string;
    hsl?: string;
    hsla?: string;
    item_type?: string;
    field_id?: string;
    [key: string]: any;
};

export type multiSelect = {
    value: string;
    checked: boolean;
};

export type colorPicker = {
    value: string;
    hex?: string;
    rgb?: { r: number; g: number; b: number };
    rgba?: { r: number; g: number; b: number; a?: number };
    hsl?: { h: number; s: number; l: number };
    hsla?: { h: number; s: number; l: number; a?: number };
};

export type fieldTypes =
    | "text_field"
    | "json_field"
    | "textarea_field"
    | "number_field"
    | "email_field"
    | "multi_select_field"
    | "date_field"
    | "color_picker_field"
    | "url_field"
    | "single_select_field";

// promt
export type fieldPromt = {
    id: string;
    name: string;
    type: fieldTypes;
};
