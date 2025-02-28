import * as React from "react";
import { MultiSelect } from "./MultiSelect";
import { Select } from "./Select";
import { Text } from "./Text";
import { fieldTypes } from "@/Types/fields";

export const FieldsList: Record<fieldTypes, React.ComponentType<any>> = {
    text: Text,
    select: Select,
    "multi-select": MultiSelect,
};
