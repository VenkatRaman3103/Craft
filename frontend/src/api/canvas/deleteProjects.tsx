import { backendUrl } from "@/config";
import axios from "axios";

export const deleteProjects = (id: string) => {
    const response = axios.delete(`${backendUrl}/canvas/projects-canvas/${id}`);
    console.log(response);
};
