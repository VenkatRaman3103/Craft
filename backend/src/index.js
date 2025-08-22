import "./server/app.js";
import { Connection } from "./server/server.js";
import { ConfigManager } from "./files/ConfigManager/index.js";
import { initialize } from "./files/Parser/initialize.js";

import { fileURLToPath } from "url";
// import { dirname } from "path";

// --- config ---
export const config = new ConfigManager();
// config.log();
// config.load_config();
// console.log(config.read_config());

initialize();

// --- server ---
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
    const connection = new Connection();
    connection.server();
    connection.database();
}
