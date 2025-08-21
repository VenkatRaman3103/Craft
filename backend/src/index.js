import "./server/app.js";
import { Connection } from "./server/server.js";
import { ConfigManager } from "./files/ConfigManager/index.js";

// --- file ---
export const config = new ConfigManager();
// config.log();
// config.load_config();
// console.log(config.read_config());

// --- server ---
if (import.meta.main) {
    const connection = new Connection();
    connection.server();
    connection.database();
}
