import { backendUrl } from "@/config";
import axios from "axios";

export const updateApiConfigurationName = async (
    id: string,
    payload: { name: string },
) => {
    const response = await axios.patch(
        `${backendUrl}/api-config/${id}/name`,
        payload,
    );
    return response.data;
};

export const updateApiConfigurationUrl = async (
    id: string,
    payload: { url: string },
) => {
    const response = await axios.patch(
        `${backendUrl}/api-config/${id}/url`,
        payload,
    );
    return response.data;
};

export const updateApiConfigurationDescription = async (
    id: string,
    payload: { description: string },
) => {
    const response = await axios.patch(
        `${backendUrl}/api-config/${id}/description`,
        payload,
    );
    return response.data;
};

export const updateApiConfigurationStatus = async (
    id: string,
    payload: { status: string },
) => {
    const response = await axios.patch(
        `${backendUrl}/api-config/${id}/status`,
        payload,
    );
    return response.data;
};

export const updateApiConfiguration = async (
    id: string,
    payload: {
        name?: string;
        url?: string;
        status?: string;
        description?: string;
    },
) => {
    const response = await axios.patch(
        `${backendUrl}/api-config/${id}`,
        payload,
    );
    return response.data;
};
