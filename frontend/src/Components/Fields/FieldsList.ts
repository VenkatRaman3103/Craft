import * as React from "react";
import { MultiSelect } from "./MultiSelect";
import { Text } from "./Text";
import { fieldTypes } from "@/Types/fields";
import { SingleSelect } from "./SingleSelect";
import { Number } from "./Number";
import { Email } from "./Email";
import { DateField } from "./Date";

export const FieldsList: Record<fieldTypes, React.ComponentType<any>> = {
    text_field: Text,
    single_select_field: SingleSelect,
    multi_select_field: MultiSelect,
    number_field: Number,
    email_field: Email,
    date_field: DateField,
};
