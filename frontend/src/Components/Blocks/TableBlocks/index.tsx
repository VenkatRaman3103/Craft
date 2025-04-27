import { useQuery } from "@tanstack/react-query";
import { getColumns, getTableData } from "./api";
import { useEffect, useState } from "react";

export const TableBlock = ({ block }: any) => {
    // const [columns, setColumns] = useState();
    // const [rows, setRows] = useState();
    const [height, setHeight] = useState();
    const { data: tableData } = useQuery({
        queryFn: () => getTableData(block.block_id),
        queryKey: ["tableBlock", block.block_id],
    });

    useEffect(() => {
        const getHeight = (data) => {
            let height = 0;

            data.map((colum) => {
                let tempHeight = 0;
                colum.rows.map((row) => {
                    tempHeight = tempHeight + 1;
                });
                if (tempHeight > height) {
                    height = tempHeight;
                }
            });
            return height;
        };

        setHeight(getHeight(tableData));
    }, [tableData]);

    console.log(tableData, "blockTable");
    return (
        <div>
            <table>
                <thead>
                    {tableData?.map((item, ind) => (
                        <th key={ind}>{item.value}</th>
                    ))}
                </thead>
                <tbody>
                    {Array.from({ length: height }).map((item) => {
                        return <tr>{}</tr>;
                    })}
                    {tableData?.map((item, ind) => {
                        return (
                            <>
                                {item.rows.length > 0 ? (
                                    item.rows.map((row) => {
                                        return <tr key={ind}>{row.value}</tr>;
                                    })
                                ) : (
                                    <tr>Hello world</tr>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
