import { backendUrl } from "@/config";
import axios from "axios";

export const createMediaBucket = async () => {
    const response = await axios.post(`${backendUrl}/media-buckets`);
    return response.data;
};
