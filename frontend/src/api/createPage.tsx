import { backendUrl } from "@/config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const createNewCMSPage = async (pageTitle, collection_id, slug) => {
    const page_id = uuidv4();
    const newPage = {
        title: pageTitle,
        slug: slug,
        page_id,
    };

    await axios.post(`${backendUrl}/page`, newPage);

    await axios.post(`${backendUrl}/collection-page`, {
        collection_id,
        page_id,
    });

    await axios.post(
        `${backendUrl}/collection/${collection_id}/collection_items`,
        {
            reference_id: page_id,
            type: "page",
        },
    );

    return newPage;
};
