// import { ConfigManager } from "./ConfigManager";

import { Connection } from "./server/server.js";
import { ConfigManager } from "./files/ConfigManager.js";

// --- file ---
const config = new ConfigManager();
config.log();
config.get_default_config_content();
config.load_config();

// --- server ---
// const connection = new Connection();
// connection.server();
// connection.database();
