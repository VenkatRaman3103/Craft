import { backendUrl } from "@/config";
import axios from "axios";

export async function getStructureContent() {
    try {
        const response = await axios.get(`${backendUrl}/structured-content`);

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getStructureContent",
            error: error,
        };

        return errorMessage;
    }
}
//http://localhost:5000/api/structured-content HTTP/1.1
