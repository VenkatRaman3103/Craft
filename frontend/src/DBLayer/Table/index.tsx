import { getAllCollections } from "@/api/DBLayer/getAllCollections";
import { useQuery } from "@tanstack/react-query";

export const Table = () => {
    const { data } = useQuery({
        queryFn: () => getAllCollections(),
        queryKey: ["db-table"],
    });

    console.log(data, "dataTable");

    return (
        <div>
            <Row />
        </div>
    );
};

export const Row = () => {
    return (
        <div>
            <div>Row</div>
        </div>
    );
};
