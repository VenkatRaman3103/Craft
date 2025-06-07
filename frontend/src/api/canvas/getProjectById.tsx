import { backendUrl } from "@/config";
import axios from "axios";

export const getProjectById = async (project_id: string) => {
    const response = await axios.get(
        `${backendUrl}/canvas/projects-canvas/${project_id}`,
    );

    return response.data;
};
