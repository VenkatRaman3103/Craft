import { backendUrl } from "@/config";
import axios from "axios";

export const getReferenceBlock = async (block_id) => {
    const referenceBlock = await axios.get(
        `${backendUrl}/reference/${block_id}`,
    );

    return referenceBlock.data;
};
