import { backendUrl } from "@/config";
import axios from "axios";

export const uploadImage = async (file, mediaBucketId) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log(mediaBucketId, "mediaBucketId uploadImage");

    let response;
    switch (mediaBucketId) {
        // root upload
        case undefined:
        case null:
            response = await axios.post(`${backendUrl}/uploads`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            break;
        // parent bucket upload
        default:
            response = await axios.post(
                `${backendUrl}/uploads/${mediaBucketId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            break;
    }
    return response.data;
};
