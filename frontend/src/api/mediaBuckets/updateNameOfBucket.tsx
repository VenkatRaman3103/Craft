import { backendUrl } from "@/config";
import axios from "axios";

export const updateNameOfBucket = async (id, name) => {
    console.log(id, name);
    const response = await axios.patch(
        `${backendUrl}/media-buckets/${id}/name`,
        { name },
    );
};
