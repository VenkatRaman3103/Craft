import React from "react";
import { ColumnConfig } from "./collections";

export type PagesType = {
    page_id: string;
    title: string;
    slug: string;
    created_at: string;
    edited_at: string;
};

export const pagesTableConfig: ColumnConfig<PagesType>[] = [
    {
        key: "title",
        label: "Title",
        sortable: true,
        required: true,
    },
    {
        key: "slug",
        label: "Slug",
        sortable: true,
        required: true,
    },
    {
        key: "created_at",
        label: "Created At",
        sortable: true,
        required: true,
        render: (value) =>
            value ? new Date(value).toLocaleDateString() : "nil",
    },
    {
        key: "edited_at",
        label: "Edited At",
        sortable: true,
        required: true,
        render: (value) =>
            value ? new Date(value).toLocaleDateString() : "nil",
    },
    {
        key: "page_id",
        label: "Page ID",
        sortable: false,
    },
];
