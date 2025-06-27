import { getAllCollections } from "@/api/DBLayer/getAllCollections";
import { useQuery } from "@tanstack/react-query";

export type CollectionType = {
    collection_id: string;
    createdAt: string;
    name: string;
    reference_id: string | null;
    slug: string;
    status: string;
    type: string | null;
};

export const Table = () => {
    const { data } = useQuery({
        queryFn: () => getAllCollections(),
        queryKey: ["db-table"],
    });

    console.log(data, "dataTable");

    return (
        <div>
            <table>
                <thead>
                    {Object.keys(data[0]).map((item, ind) => (
                        <td key={ind}>{item}</td>
                    ))}
                </thead>
                <tbody>
                    {data.map((row: CollectionType) => (
                        <tr key={row.collection_id}>
                            {Object.values(row).map((column, ind) => (
                                <td key={ind}>{column}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const Row = () => {
    return (
        <div className="row-container">
            <div>Row</div>
        </div>
    );
};
