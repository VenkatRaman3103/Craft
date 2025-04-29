import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createNewRowWithEntries,
    createNewColumnWithEntries,
    getTableData,
    deleteRow,
} from "./api";
import "./index.scss";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export const TableBlock = ({ block }: any) => {
    const [tableWidth, setTableWidth] = useState(1);
    const [addRow, setAddRow] = useState(false);
    const [addColumn, setAddColumn] = useState(false);
    const [newRowData, setNewRowData] = useState([]);
    const [newColumnData, setNewColumnData] = useState({
        name: "",
        entries: [],
    });

    const [activeRowId, setActiveRowId] = useState(false);

    const {
        data: tableData,
        isLoading,
        error,
    } = useQuery({
        queryFn: () => getTableData(block.block_id),
        queryKey: ["tableBlock", block.block_id],
    });
    const queryClient = useQueryClient();

    const saveRow = useMutation({
        mutationFn: () => {
            return createNewRowWithEntries(
                newRowData,
                tableData,
                block.block_id,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tableBlock"]);
            setAddRow(false);
            setNewRowData([]);
        },
    });

    const saveColumn = useMutation({
        mutationFn: () => {
            return createNewColumnWithEntries(
                newColumnData,
                tableData,
                block.block_id,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["tableBlock"]);
            setAddColumn(false);
            setNewColumnData({ name: "", entries: [] });
        },
    });

    const deleteRowMutation = useMutation({
        mutationFn: (row_id) => deleteRow(row_id),
        onSuccess: () => queryClient.invalidateQueries(["tableBlock"]),
    });

    useEffect(() => {
        if (tableData) {
            setTableWidth(tableData.columns.length);
            if (
                addColumn &&
                newColumnData.entries.length === 0 &&
                tableData.rows.length > 0
            ) {
                setNewColumnData({
                    ...newColumnData,
                    entries: Array(tableData.rows.length).fill(""),
                });
            }
        }
    }, [tableData, addColumn]);

    if (isLoading) return <div>Loading table...</div>;
    if (error) return <div>Error loading table</div>;
    if (!tableData) return null;

    function handleNewRowHeading(e, ind) {
        e.preventDefault();
        let temp = [...newRowData];
        temp[ind] = e.target.value;
        setNewRowData(temp);
    }

    function saveTheRowData() {
        saveRow.mutate();
    }

    function handleAddRow() {
        if (addRow === false) {
            setAddRow(true);
        } else {
            saveTheRowData();
        }
    }

    function handleNewColumnName(e) {
        setNewColumnData({
            ...newColumnData,
            name: e.target.value,
        });
    }

    function handleNewColumnEntry(e, rowIndex) {
        const newEntries = [...newColumnData.entries];
        newEntries[rowIndex] = e.target.value;
        setNewColumnData({
            ...newColumnData,
            entries: newEntries,
        });
    }

    function saveTheColumnData() {
        saveColumn.mutate();
    }

    function handleAddColumn() {
        if (addColumn === false) {
            setAddColumn(true);
            if (tableData.rows.length > 0) {
                setNewColumnData({
                    name: "",
                    entries: Array(tableData.rows.length).fill(""),
                });
            }
        } else {
            saveTheColumnData();
        }
    }

    function cancelAddColumn() {
        setAddColumn(false);
        setNewColumnData({ name: "", entries: [] });
    }

    function cancelAddRow() {
        setAddRow(false);
        setNewRowData([]);
    }

    function handleRowDelete(row_id: string) {
        deleteRowMutation.mutate(row_id);
    }

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="row-header-cell">Row Name</th>
                            {tableData.columns.map((column) => (
                                <th
                                    key={column.column_id}
                                    className="table-header"
                                >
                                    {column.value}
                                </th>
                            ))}
                            {addColumn && (
                                <th className="table-header">
                                    <input
                                        type="text"
                                        value={newColumnData.name}
                                        onChange={handleNewColumnName}
                                        placeholder="Column Name"
                                    />
                                </th>
                            )}
                            <th className="add-column-cell">
                                {addColumn ? (
                                    <button
                                        className="cancel-button"
                                        onClick={cancelAddColumn}
                                        title="Cancel"
                                    >
                                        ✕
                                    </button>
                                ) : (
                                    <button
                                        className="add-button"
                                        onClick={handleAddColumn}
                                        title="Add Column"
                                    >
                                        +
                                    </button>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.grid.map((row, rowIndex) => (
                            <tr key={row.row_id}>
                                <td
                                    className="row-name-cell table-cell"
                                    onMouseEnter={() =>
                                        setActiveRowId(
                                            tableData.rows[rowIndex].row_id,
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setActiveRowId(
                                            tableData.rows[rowIndex].row_id,
                                        )
                                    }
                                >
                                    {tableData.rows[rowIndex].name ||
                                        `Row ${rowIndex + 1}`}
                                    {activeRowId ==
                                        tableData.rows[rowIndex].row_id && (
                                        <Trash2
                                            size={14}
                                            className="trash"
                                            onClick={() =>
                                                handleRowDelete(
                                                    tableData.rows[rowIndex]
                                                        .row_id,
                                                )
                                            }
                                        />
                                    )}
                                </td>
                                {row.cells.map((cell, cellIndex) => (
                                    <td
                                        key={`${row.row_id}-${tableData.columns[cellIndex].column_id}`}
                                        className="table-cell"
                                    >
                                        {cell || ""}
                                    </td>
                                ))}
                                {addColumn && (
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            value={
                                                newColumnData.entries[
                                                    rowIndex
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleNewColumnEntry(
                                                    e,
                                                    rowIndex,
                                                )
                                            }
                                            placeholder="Value"
                                        />
                                    </td>
                                )}
                                <td className="table-cell column-spacer"></td>
                            </tr>
                        ))}
                        {addRow && (
                            <tr>
                                {Array.from({ length: tableWidth + 1 }).map(
                                    (_, ind) => (
                                        <td className="table-cell" key={ind}>
                                            <input
                                                type="text"
                                                value={newRowData[ind]}
                                                onChange={(e) =>
                                                    handleNewRowHeading(e, ind)
                                                }
                                                placeholder={
                                                    ind === 0
                                                        ? "Row Name"
                                                        : "Value"
                                                }
                                            />
                                        </td>
                                    ),
                                )}
                                {addColumn && (
                                    <td className="table-cell">
                                        <input
                                            type="text"
                                            placeholder="Value"
                                        />
                                    </td>
                                )}
                                <td className="table-cell">
                                    <button
                                        className="cancel-button"
                                        onClick={cancelAddRow}
                                        title="Cancel"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        )}
                        <tr className="add-row-row">
                            <td
                                colSpan={tableWidth + 2 + (addColumn ? 1 : 0)}
                                className="add-row-cell"
                            >
                                {addRow ? (
                                    <button
                                        className="save-button"
                                        onClick={saveTheRowData}
                                    >
                                        Save Row
                                    </button>
                                ) : (
                                    <button
                                        className="add-button"
                                        onClick={handleAddRow}
                                    >
                                        +
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {addColumn && (
                <div className="save-column-container">
                    <button className="save-button" onClick={saveTheColumnData}>
                        Save Column
                    </button>
                </div>
            )}
        </div>
    );
};
