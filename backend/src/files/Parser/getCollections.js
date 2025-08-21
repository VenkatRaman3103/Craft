import { config } from "../../index.js";

export const getCollections = () => {
    const collections = config.read_config();

    console.log(collections.collections);
};

getCollections();
