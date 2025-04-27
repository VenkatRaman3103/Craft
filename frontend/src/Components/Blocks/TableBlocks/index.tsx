import { useQuery } from "@tanstack/react-query";
import { getColumns, getTableData } from "./api";
import { useState } from "react";

export const TableBlock = ({ block }: any) => {
    const { data: tableData, isLoading } = useQuery({
        queryFn: () => getTableData(block.block_id),
        queryKey: ["tableBlock", block.block_id],
    });

    const allRowIds = Array.from(
        new Set(
            tableData.flatMap((column) => column.rows.map((row) => row.row_id)),
        ),
    );

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {tableData.map((column, index) => (
                            <th key={column.column_id}>{column.value}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {allRowIds.length > 0 ? (
                        allRowIds.map((rowId) => (
                            <tr key={rowId}>
                                {tableData.map((column) => {
                                    const rowData = column.rows.find(
                                        (row) => row.row_id === rowId,
                                    );
                                    return (
                                        <td
                                            key={`${rowId}-${column.column_id}`}
                                        >
                                            {rowData ? rowData.value : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={tableData.length}>No rows found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
