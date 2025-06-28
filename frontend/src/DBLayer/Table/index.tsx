import { getAllCollections } from "@/api/DBLayer/getAllCollections";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./index.scss";

export type CollectionType = {
    collection_id: string;
    createdAt: string;
    name: string;
    reference_id: string | null;
    slug: string;
    status: string;
    type: string | null;
};

const columnOrder: (keyof CollectionType)[] = [
    "name",
    "slug",
    "collection_id",
    "createdAt",
    "reference_id",
    "status",
    "type",
];

type SortDirection = "asc" | "desc";

export const Table = () => {
    const [sortColumn, setSortColumn] = useState<keyof CollectionType>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const { data = [] } = useQuery({
        queryFn: () => getAllCollections(),
        queryKey: ["db-table"],
    });

    const handleSort = (column: keyof CollectionType) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;

        if (sortColumn === "createdAt") {
            comparison =
                new Date(aValue).getTime() - new Date(bValue).getTime();
        } else if (typeof aValue === "string" && typeof bValue === "string") {
            comparison = aValue.localeCompare(bValue);
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    const getSortIcon = (column: keyof CollectionType) => {
        if (sortColumn !== column) return "↕️";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th className="table-header">S.No</th>
                        {columnOrder.map((colName) => (
                            <th
                                key={colName}
                                className={`table-header sortable ${sortColumn === colName ? "active" : ""}`}
                            >
                                <div className="header-content">
                                    {colName}
                                    <button
                                        onClick={() => handleSort(colName)}
                                        className="sort-button"
                                        title={`Sort by ${colName}`}
                                    >
                                        {getSortIcon(colName)}
                                    </button>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row: CollectionType, ind) => (
                        <tr key={row.collection_id} className="table-row">
                            <td className="table-cell">{ind + 1}</td>
                            {columnOrder.map((colName) => (
                                <td key={colName} className="table-cell">
                                    {row[colName] || "nil"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const Cell = () => {
    return (
        <div>
            <div>Cell</div>
        </div>
    );
};
