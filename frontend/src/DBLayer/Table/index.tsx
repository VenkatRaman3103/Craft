import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./index.scss";
import { ColumnConfig } from "../TableConfigurations/collections";

export interface TableProps<T> {
    queryKey: string[];
    queryFn: () => Promise<T[]>;
    columns: ColumnConfig<T>[] | any;
    defaultSortColumn?: keyof T | string;
    defaultSortDirection?: "asc" | "desc";
    showSerialNumber?: boolean;
    toggleableColumns?: boolean;
    className?: string;
    emptyMessage?: string;
    getRowKey: (row: T) => string | number;
}

type SortDirection = "asc" | "desc";

export const Table = <T extends Record<string, any>>({
    queryKey,
    queryFn,
    columns,
    defaultSortColumn,
    defaultSortDirection = "asc",
    showSerialNumber = true,
    toggleableColumns = true,
    className = "",
    emptyMessage = "No data available",
    getRowKey,
}: TableProps<T>) => {
    const [sortColumn, setSortColumn] = useState<keyof T>(
        defaultSortColumn || columns[0]?.key,
    );
    const [sortDirection, setSortDirection] =
        useState<SortDirection>(defaultSortDirection);
    const [showAdditionalColumns, setShowAdditionalColumns] = useState(false);

    const {
        data = [],
        isLoading,
        error,
    } = useQuery({
        queryFn,
        queryKey,
    });

    const requiredColumns = columns.filter((col) => col.required);
    const optionalColumns = columns.filter((col) => !col.required);

    const visibleColumns =
        toggleableColumns && !showAdditionalColumns ? requiredColumns : columns;

    const handleSort = (column: keyof T) => {
        const columnConfig = columns.find((col) => col.key === column);
        if (!columnConfig?.sortable) return;

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

        if (typeof aValue === "string" && typeof bValue === "string") {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                comparison = aDate.getTime() - bDate.getTime();
            } else {
                comparison = aValue.localeCompare(bValue);
            }
        } else if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue;
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    const getSortIcon = (column: keyof T) => {
        const columnConfig = columns.find((col) => col.key === column);
        if (!columnConfig?.sortable) return null;

        if (sortColumn !== column) return "↕️";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const toggleAdditionalColumns = () => {
        setShowAdditionalColumns(!showAdditionalColumns);
    };

    if (isLoading) {
        return <div className="table-loading">Loading...</div>;
    }

    if (error) {
        return <div className="table-error">Error loading data</div>;
    }

    return (
        <div className={`table-container ${className}`}>
            {toggleableColumns && optionalColumns.length > 0 && (
                <div className="table-controls">
                    <button
                        onClick={toggleAdditionalColumns}
                        className="toggle-columns-btn"
                    >
                        {showAdditionalColumns ? "Show Less" : "Show More"}
                    </button>
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        {showSerialNumber && (
                            <th className="table-header">S.No</th>
                        )}
                        {visibleColumns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`table-header ${
                                    column.sortable ? "sortable" : ""
                                } ${sortColumn === column.key ? "active" : ""}`}
                            >
                                <div className="header-content">
                                    {column.label}
                                    {column.sortable && (
                                        <button
                                            onClick={() =>
                                                handleSort(column.key)
                                            }
                                            className="sort-button"
                                            title={`Sort by ${column.label}`}
                                        >
                                            {getSortIcon(column.key)}
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    visibleColumns.length +
                                    (showSerialNumber ? 1 : 0)
                                }
                                className="table-cell table-empty"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row: T, index) => (
                            <tr key={getRowKey(row)} className="table-row">
                                {showSerialNumber && (
                                    <td className="table-cell">{index + 1}</td>
                                )}
                                {visibleColumns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className="table-cell"
                                    >
                                        {column.render
                                            ? column.render(
                                                  row[column.key],
                                                  row,
                                              )
                                            : row[column.key] || "nil"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
