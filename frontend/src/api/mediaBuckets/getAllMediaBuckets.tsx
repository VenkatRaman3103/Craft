import { backendUrl } from "@/config";
import axios from "axios";

export const getAllMediaBuckets = async (bucket_id: string | undefined) => {
    let response;

    switch (bucket_id) {
        // root
        case undefined:
            response = await axios.get(`${backendUrl}/media-buckets/root`);
            break;

        // child
        default:
            response = await axios.get(
                `${backendUrl}/media-buckets/${bucket_id}`,
            );
            break;
    }

    return response.data;
};
