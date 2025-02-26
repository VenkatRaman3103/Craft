import { CollectionIntro } from "@/Components/CollectionIntro";
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
            {pagesList && (
                <CollectionIntro
                    collection={pagesList[0].collections}
                    collection_id={pagesList[0].collections.collection_id}
                    showNavBtn={false}
                />
            )}
        </div>
    );
};
