import { backendUrl } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Collection = () => {
    const { collection_id } = useParams();
    const [pagesList, setPagesList] = useState();

    useEffect(() => {
        async function getPages() {
            const response = await axios.get(
                `${backendUrl}/collection/${collection_id}`,
            );

            setPagesList(response.data);
        }
        getPages();
    }, [collection_id]);

    console.log(pagesList, "pagesList");

    return (
        <div>
            <div>Collection id: {collection_id}</div>
        </div>
    );
};
