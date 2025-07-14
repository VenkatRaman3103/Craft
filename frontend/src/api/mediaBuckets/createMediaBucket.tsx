import { backendUrl } from "@/config";
import axios from "axios";

export const createMediaBucket = async (name) => {
    console.log(name);
    const response = await axios.post(`${backendUrl}/media-buckets`, { name });
    return response.data;
};
