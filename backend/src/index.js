import "./server/app.js";
import { Connection } from "./server/server.js";

import { fileURLToPath } from "url";

// --- server ---
const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
    const connection = new Connection();
    connection.server();
    connection.database();
}
