import { config } from "../../index.js";

export const getCollections = () => {
    const collections = config.read_config();

    return collections.collections;
};

// getCollections();
