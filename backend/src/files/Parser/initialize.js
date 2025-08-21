import { config } from "../../index.js";
import { syncCollections } from "./collections/syncCollections.js";

export async function initialize() {
    // const config_data = await config.read_config();
    // console.log(config_data);

    config.onChange(async (config_data) => {
        const collections = config_data.collections;

        const new_collections = await syncCollections(collections);

        console.log(new_collections);

        // // TODO: database connection
        // const database = config_data.database;
        //
        // // TODO: admin panel default setting
        // const adminPanel = config_data.adminPanel;
        //
        // // TODO: plugins
        // const plugins = config_data.plugins;
        //
        // // TODO: workflows
        // const workflows = config_data.workflows;
        //
        // // TODO: globals
        // const globals = config_data.globals;
    });
}
