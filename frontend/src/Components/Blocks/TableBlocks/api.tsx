import { backendUrl } from "@/config";
import axios from "axios";

export const getColumns = async (table_id: string) => {
    const columnsResponse = await axios.get(
        `${backendUrl}/table/columns/${table_id}`,
    );
    return columnsResponse.data;
};

export const getRows = async (table_id: string) => {
    const rowsResponse = await axios.get(
        `${backendUrl}/table/rows/${table_id}`,
    );
    return rowsResponse.data;
};

export const getEntriesByColumnId = async (column_id: string) => {
    const entriesResponse = await axios.get(
        `${backendUrl}/table/entries/${column_id}/column`,
    );
    return entriesResponse.data;
};

export const getEntriesByRowId = async (row_id: string) => {
    const entriesResponse = await axios.get(
        `${backendUrl}/table/entries/${row_id}/row`,
    );
    return entriesResponse.data;
};

export const getEntry = async (row_id: string, column_id: string) => {
    const entryResponse = await axios.get(
        `${backendUrl}/table/entries/${row_id}/${column_id}/row/column`,
    );
    return entryResponse.data;
};

export const getTableData = async (block_id: string) => {
    const columns = await getColumns(block_id);
    const rows = await getRows(block_id);
    const rowsWithNames = rows.map((row, index) => ({
        ...row,
        name: row.value || `Row ${index + 1}`,
    }));
    const tableData: any = {
        columns: columns,
        rows: rowsWithNames,
        grid: [],
    };
    for (const row of rowsWithNames) {
        const rowEntries = await getEntriesByRowId(row.row_id);
        const rowData = columns.map((column) => {
            const entry = rowEntries.find(
                (entry) => entry.column_id === column.column_id,
            );
            return entry ? entry.value : null;
        });
        tableData.grid.push({
            row_id: row.row_id,
            cells: rowData,
        });
    }
    return tableData;
};

export const createNewRowWithEntries = async (rowData, tableData, table_id) => {
    // const table_id = tableData.columns[0].table_id;
    const rowResponse = await axios.post(
        `${backendUrl}/table/rows/${table_id}`,
        { value: rowData[0] },
    );
    const newRowId = rowResponse.data.row_id;

    for (let ind = 1; ind < rowData.length; ind++) {
        if (ind <= tableData.columns.length && rowData[ind]) {
            await axios.post(
                `${backendUrl}/table/entries/${newRowId}/${tableData.columns[ind - 1].column_id}`,
                { value: rowData[ind] },
            );
        }
    }

    return rowResponse.data;
};

export const createNewColumnWithEntries = async (
    columnData,
    tableData,
    table_id,
) => {
    // const table_id = tableData.columns[0].table_id;

    const columnResponse = await axios.post(
        `${backendUrl}/table/columns/${table_id}`,
        { value: columnData.name },
    );
    const newColumnId = columnResponse.data.column_id;

    for (let i = 0; i < tableData.rows.length; i++) {
        const rowId = tableData.rows[i].row_id;
        const entryValue = columnData.entries[i] || "";

        await axios.post(
            `${backendUrl}/table/entries/${rowId}/${newColumnId}`,
            { value: entryValue },
        );
    }

    return columnResponse.data;
};

export const deleteRow = async (rowId: string) => {
    const rowResponse = await axios.delete(
        `${backendUrl}/table/rows/${rowId}/row`,
    );
    const entriesResponse = await axios.delete(
        `${backendUrl}/table/entries/${rowId}/row`,
    );
};

export const deleteColumn = async (columnId: string) => {
    const columnResponse = await axios.delete(
        `${backendUrl}/table/columns/${columnId}/column`,
    );
    const entriesResponse = await axios.delete(
        `${backendUrl}/table/entries/${columnId}/column`,
    );
};
