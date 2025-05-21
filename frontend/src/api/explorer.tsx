import { backendUrl } from "@/config";
import axios from "axios";

export const getAllCollections = async () => {
    const response = await axios.get(`${backendUrl}/collections`);
    return response.data.filter(
        (collection) => collection.reference_id == null,
    );
};

export const getCollectionById = async (id) => {
    const response = await axios.get(
        `${backendUrl}/collections/references/${id}`,
    );
    console.log(response.data, "getCollectionById");

    return response.data;
};
