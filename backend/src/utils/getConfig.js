import { cmsConfig } from "../../tmp/cms.config.js";

export const getConfig = () => {
    const config = cmsConfig();
    return config;
};
