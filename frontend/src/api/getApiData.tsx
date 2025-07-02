import { servicesUrl } from "@/config";
import axios from "axios";

export const getApiData = async (id) => {
    const response = await axios.get(`${servicesUrl}/api/page/${id}`);
    return response.data;
};
