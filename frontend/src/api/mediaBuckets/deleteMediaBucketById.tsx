import { backendUrl } from "@/config";
import axios from "axios";

export const deleteMediaBucketById = (id) => {
    const response = axios.delete(`${backendUrl}/media-buckets/${id}`);
    return response.data;
};
