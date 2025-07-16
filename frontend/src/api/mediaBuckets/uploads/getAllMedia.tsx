import { backendUrl } from "@/config";
import axios from "axios";
import { defaults } from "lodash";

export const getAllMedia = async (bucket_id) => {
    let response;
    switch (bucket_id) {
        // root
        case undefined:
        case null:
            response = await axios.get(`${backendUrl}/uploads`);
            break;

        // parent buckets
        default:
            response = await axios.get(
                `${backendUrl}/uploads/${bucket_id}/media-bucket`,
            );
    }

    return response.data;
};
