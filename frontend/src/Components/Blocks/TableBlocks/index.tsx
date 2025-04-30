import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createNewRowWithEntries,
    createNewColumnWithEntries,
    getTableData,
    deleteRow,
    deleteColumn,
    updateRowName,
    updateColumnName,
} from "./api";
import "./index.scss";
import { useEffect, useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";

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
    const [activeColumnId, setActiveColumnId] = useState(false);

    const [editableRow, setEditableRow] = useState<string>();
    const [editableRowName, setEditableRowName] = useState<string>();

    const [editableColumn, setEditableColumn] = useState<string>();
    const [editableColumnName, setEditableColumnName] = useState<string>();

    const queryClient = useQueryClient();
    const queryKey = ["tableBlock", block.block_id];

    const {
        data: tableData,
        isLoading,
        error,
    } = useQuery({
        queryFn: () => getTableData(block.block_id),
        queryKey: queryKey,
    });

    const newRowNameMutation = useMutation({
        mutationFn: () => {
            return updateRowName(editableRow, editableRowName);
        },
        onSuccess: () => {
            const previousData = queryClient.getQueryData(queryKey);
            if (previousData) {
                const updatedData = JSON.parse(JSON.stringify(previousData));

                const rowIndex = updatedData.rows.findIndex(
                    (row) => row.row_id === editableRow,
                );
                if (rowIndex !== -1) {
                    updatedData.rows[rowIndex].name = editableRowName;
                }

                queryClient.setQueryData(queryKey, updatedData);
            } else {
                queryClient.invalidateQueries(queryKey);
            }

            setEditableRow("");
            setEditableRowName("");
        },
    });

    const newColumnNameMutation = useMutation({
        mutationFn: () => {
            return updateColumnName(editableColumn, editableColumnName);
        },
        onSuccess: () => {
            const previousData = queryClient.getQueryData(queryKey);
            if (previousData) {
                const updatedData = JSON.parse(JSON.stringify(previousData));

                const columnIndex = updatedData.columns.findIndex(
                    (column) => column.column_id === editableColumn,
                );
                if (columnIndex !== -1) {
                    updatedData.columns[columnIndex].value = editableColumnName;
                }

                queryClient.setQueryData(queryKey, updatedData);
            } else {
                queryClient.invalidateQueries(queryKey);
            }

            setEditableColumn("");
            setEditableColumnName("");
        },
    });

    const saveRow = useMutation({
        mutationFn: () => {
            return createNewRowWithEntries(
                newRowData,
                tableData,
                block.block_id,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey);
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
            queryClient.invalidateQueries(queryKey);
            setAddColumn(false);
            setNewColumnData({ name: "", entries: [] });
        },
    });

    const deleteRowMutation = useMutation({
        mutationFn: (row_id) => deleteRow(row_id),
        onSuccess: () => queryClient.invalidateQueries(queryKey),
    });

    const deleteColumnMutation = useMutation({
        mutationFn: (column_id) => deleteColumn(column_id),
        onSuccess: () => queryClient.invalidateQueries(queryKey),
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

    function handleColumnDelete(column_id: string) {
        deleteColumnMutation.mutate(column_id);
    }

    function handleRowNameChange(e) {
        e.preventDefault();
        setEditableRowName(e.target.value);
    }

    function handleColumnNameChange(e) {
        e.preventDefault();
        setEditableColumnName(e.target.value);
    }

    function saveNewRowName() {
        newRowNameMutation.mutate();
    }

    function saveNewColumnName() {
        newColumnNameMutation.mutate();
    }

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="row-header-cell">Row Name</th>
                            {tableData.columns.map((column, columnIndex) => (
                                <th
                                    key={column.column_id}
                                    className="table-header table-cell"
                                    onMouseEnter={() =>
                                        setActiveColumnId(column.column_id)
                                    }
                                    onMouseLeave={() =>
                                        setActiveColumnId(false)
                                    }
                                >
                                    <div className="column-header-content">
                                        {column.column_id !== editableColumn ? (
                                            <>{column.value}</>
                                        ) : (
                                            <input
                                                value={editableColumnName}
                                                onChange={(e) =>
                                                    handleColumnNameChange(e)
                                                }
                                                className="column-edit-input"
                                            />
                                        )}

                                        {activeColumnId ===
                                            column.column_id && (
                                            <div className="action-icons">
                                                {editableColumn ===
                                                column.column_id ? (
                                                    <Check
                                                        size={16}
                                                        className="edit-icon"
                                                        onClick={() =>
                                                            saveNewColumnName()
                                                        }
                                                    />
                                                ) : (
                                                    <Pencil
                                                        size={14}
                                                        className="edit-icon"
                                                        onClick={() => {
                                                            setEditableColumn(
                                                                column.column_id,
                                                            );
                                                            setEditableColumnName(
                                                                column.value,
                                                            );
                                                        }}
                                                    />
                                                )}
                                                <Trash2
                                                    size={14}
                                                    className="trash"
                                                    onClick={() =>
                                                        handleColumnDelete(
                                                            column.column_id,
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {addColumn && (
                                <th className="table-header">
                                    <input
                                        type="text"
                                        value={newColumnData.name}
                                        onChange={handleNewColumnName}
                                        placeholder="Column Name"
                                        className="column-input"
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
                                    onMouseLeave={() => setActiveRowId(false)}
                                >
                                    {/* row label*/}
                                    {tableData.rows[rowIndex].row_id !==
                                        editableRow &&
                                        tableData.rows[rowIndex].name}

                                    {/* input to edit row label */}
                                    {tableData.rows[rowIndex].row_id ===
                                        editableRow && (
                                        <input
                                            value={editableRowName}
                                            onChange={(e) =>
                                                handleRowNameChange(e)
                                            }
                                        />
                                    )}

                                    {/* action button */}
                                    {activeRowId ===
                                        tableData.rows[rowIndex].row_id && (
                                        <div className="action-icons">
                                            {editableRow ===
                                            tableData.rows[rowIndex].row_id ? (
                                                <Check
                                                    size={16}
                                                    className="edit-icon"
                                                    onClick={() =>
                                                        saveNewRowName()
                                                    }
                                                />
                                            ) : (
                                                <Pencil
                                                    size={14}
                                                    className="edit-icon"
                                                    onClick={() => {
                                                        setEditableRow(
                                                            tableData.rows[
                                                                rowIndex
                                                            ].row_id,
                                                        );
                                                        setEditableRowName(
                                                            tableData.rows[
                                                                rowIndex
                                                            ].name,
                                                        );
                                                    }}
                                                />
                                            )}
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
                                        </div>
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
