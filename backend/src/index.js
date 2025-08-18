// import { ConfigManager } from "./ConfigManager";

import { Connection } from "./server/server.js";
import { ConfigManager } from "./files/ConfigManager/index.js";

// --- file ---
const config = new ConfigManager();
config.log();
config.load_config();
config.read_config();

// --- server ---
// const connection = new Connection();
// connection.server();
// connection.database();
