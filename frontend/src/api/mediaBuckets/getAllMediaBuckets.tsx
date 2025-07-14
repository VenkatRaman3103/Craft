import { backendUrl } from "@/config";
import axios from "axios";

export const getAllMediaBuckets = async () => {
    const response = await axios.get(`${backendUrl}/media-buckets`);
    return response.data;
};
