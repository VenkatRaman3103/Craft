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

const columnOrder: (keyof CollectionType)[] = [
    "slug",
    "collection_id",
    "createdAt",
    "name",
    "reference_id",
    "status",
    "type",
];

export const Table = () => {
    const { data = [] } = useQuery({
        queryFn: () => getAllCollections(),
        queryKey: ["db-table"],
    });

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {columnOrder.map((colName) => (
                            <th key={colName}>{colName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: CollectionType) => (
                        <tr key={row.collection_id}>
                            {columnOrder.map((colName) => (
                                <td key={colName}>{row[colName]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const Cell = () => {
    return (
        <div>
            <div>Cell</div>
        </div>
    );
};
