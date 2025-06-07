import { backendUrl } from "@/config";
import axios from "axios";

export type CanvasPagePayload = {
    name: string;
    status: string;
    project_id?: string;
};

export const createPage = async (payload: CanvasPagePayload) => {
    const response = await axios.post(`${backendUrl}/canvas/pages`, payload);
    return response;
};
