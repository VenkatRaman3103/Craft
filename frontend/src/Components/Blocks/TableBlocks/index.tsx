import { useQuery } from "@tanstack/react-query";
import { getColumns } from "./api";

export const TableBlock = ({ block }: any) => {
    const { data: tableData } = useQuery({
        queryFn: () => getColumns(block.block_id),
        queryKey: ["tableBlock", block.block_id],
    });

    console.log(tableData, "blockTable");
    return (
        <div>
            <div>Table</div>
        </div>
    );
};
