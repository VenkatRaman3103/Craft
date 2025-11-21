import { backendUrl } from "@/config";
import axios from "axios";
import { NewPageType } from "../types/PagesType";

export async function getPagesByElementId(elementId: string | null) {
    try {
        const response = await axios.get(
            `${backendUrl}/pages/${elementId}/element`,
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPagesByElementId",
            error: error,
        };

        return errorMessage;
    }
}

export async function createNewPage({
    name,
    slug,
    description,
    element_id,
}: NewPageType) {
    try {
        const response = await axios.post(
            `${backendUrl}/pages/${element_id}/element`,
            {
                name,
                slug,
                description,
            },
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "createNewPage",
            error: error,
        };

        return errorMessage;
    }
}

export async function getPageByPageId(page_id: string | undefined) {
    try {
        const response = await axios.get(`${backendUrl}/pages/${page_id}`);

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPagesByElementId",
            error: error,
        };

        return errorMessage;
    }
}

export async function createNewSection({
    referenceId,
    name,
    type,
    position,
}: any) {
    try {
        const response = await axios.post(
            `${backendUrl}/sections/${referenceId}/page`,
            {
                name,
                type,
                position,
            },
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "createNewSection",
            error: error,
        };

        return errorMessage;
    }
}

// page versions
export async function getPageVersions(page_id: string) {
    try {
        const response = await axios.get(
            `${backendUrl}/pages-version/${page_id}`,
        );
        console.log(response.data, "page_id getPageVersions");

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPageVersions",
            error: error,
        };

        return errorMessage;
    }
}

// create new version for the page
export async function createNewPageVersion(obj) {
    const { page_id, version_number, page_data, published_at, created_by } =
        obj;

    try {
        const response = await axios.post(
            `${backendUrl}/pages-version/${page_id}`,
            {
                page_id,
                version_number,
                page_data,
                published_at,
                created_by,
            },
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPageVersions",
            error: error,
        };

        return errorMessage;
    }
}
