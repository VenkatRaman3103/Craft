import { backendUrl } from "@/config";
import axios from "axios";

export const getAllProjects = async () => {
    const response = await axios.get(`${backendUrl}/canvas/projects-canvas`);

    return response.data;
};
