import * as React from "react";
import { MultiSelect } from "./MultiSelect";
import { Text } from "./Text";
import { fieldTypes } from "@/Types/fields";
import { SingleSelect } from "./SingleSelect";

export const FieldsList: Record<fieldTypes, React.ComponentType<any>> = {
    text_field: Text,
    single_select_field: SingleSelect,
    multi_select_field: MultiSelect,
};
