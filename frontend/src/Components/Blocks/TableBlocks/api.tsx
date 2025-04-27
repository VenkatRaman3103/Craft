import { backendUrl } from "@/config";
import axios from "axios";

export const getColumns = async (table_id: string) => {
    const columnsResponse = await axios.get(
        `${backendUrl}/table/columns/${table_id}`,
    );

    return columnsResponse.data;
};

export const getRows = async (column_id: string) => {
    const rowResponse = await axios.get(
        `${backendUrl}/table/rows/${column_id}`,
    );

    return rowResponse.data;
};

export const getTableData = async (block_id) => {
    const columns = await getColumns(block_id);

    const tableData = Promise.all(
        columns.map(async (column) => {
            const rows = await getRows(column.column_id);
            return {
                ...column,
                rows: rows,
            };
        }),
    );
    return tableData;
};
