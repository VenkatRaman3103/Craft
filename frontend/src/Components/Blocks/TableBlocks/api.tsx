import { backendUrl } from "@/config";
import axios from "axios";

export const getColumns = async (table_id: string) => {
    const columnsResponse = await axios.get(
        `${backendUrl}/table/columns/${table_id}`,
    );

    return columnsResponse.data;
};
