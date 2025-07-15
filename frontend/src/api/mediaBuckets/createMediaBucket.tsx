import { backendUrl } from "@/config";
import axios from "axios";

export const createMediaBucket = async (name, bucket_id) => {
    let response;

    switch (bucket_id) {
        // root
        case undefined:
            response = await axios.post(`${backendUrl}/media-buckets`, {
                name,
            });
            break;

        // child
        default:
            response = await axios.post(
                `${backendUrl}/media-buckets/${bucket_id}`,
                { name },
            );
            break;
    }

    return response.data;
};
