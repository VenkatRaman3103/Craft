import { backendUrl } from "@/config";
import axios from "axios";

export const createApiConfiguration = async (payload: {
    name: string;
    url: string;
    description: string;
}) => {
    try {
        console.log("Original payload:", payload);
        const transformedPayload = {
            name: payload.name,
            apiUrl: payload.url,
            description: payload.description,
            parameters: [],
            operations: [],
            metadata: null,
        };
        console.log("Transformed payload:", transformedPayload);
        console.log("Backend URL:", backendUrl);
        const response = await axios.post(
            `${backendUrl}/api-config`,
            transformedPayload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Create API Configuration Error:", error);
    }
};
