import { backendUrl } from "@/config";
import axios from "axios";

export const updateProjectNameById = async (id, payload) => {
    const response = await axios.patch(
        `${backendUrl}/canvas/projects-canvas/${id}/name`,
        payload,
    );
    return response.data;
};

export const updateProjectStatusById = async (id, payload) => {
    const response = await axios.patch(
        `${backendUrl}/canvas/projects-canvas/${id}/status`,
        payload,
    );
    return response.data;
};
