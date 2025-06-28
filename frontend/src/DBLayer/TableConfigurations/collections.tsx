import React from "react";

export type CollectionType = {
    collection_id: string;
    createdAt: string;
    name: string;
    reference_id: string | null;
    slug: string;
    status: string;
    type: string | null;
};

export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    required?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

export const collectionsTableConfig: ColumnConfig<CollectionType>[] = [
    {
        key: "name",
        label: "Name",
        sortable: true,
        required: true,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        required: true,
        render: (value) => (
            <span className={`status-badge status-${value?.toLowerCase()}`}>
                {value}
            </span>
        ),
    },
    {
        key: "createdAt",
        label: "Created At",
        sortable: true,
        required: true,
        render: (value) =>
            value ? new Date(value).toLocaleDateString() : "nil",
    },
    {
        key: "slug",
        label: "Slug",
        sortable: true,
    },
    {
        key: "collection_id",
        label: "Collection ID",
        sortable: false,
    },
    {
        key: "reference_id",
        label: "Reference ID",
        sortable: false,
    },
    {
        key: "type",
        label: "Type",
        sortable: true,
    },
];
