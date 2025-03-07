import * as React from "react";
import { MultiSelect } from "./MultiSelect";
import { Select } from "./Select";
import { Text } from "./Text";
import { fieldTypes } from "@/Types/fields";

export const FieldsList: Record<fieldTypes, React.ComponentType<any>> = {
    text_field: Text,
    select: Select,
    multi_select_field: MultiSelect,
};
