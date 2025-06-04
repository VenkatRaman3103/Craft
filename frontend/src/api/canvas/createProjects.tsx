import { backendUrl } from "@/config";
import axios from "axios";

export const createProjects = async (payload) => {
    const response = await axios.post(
        `${backendUrl}/canvas/projects-canvas`,
        payload,
    );

    return response.data;
};
