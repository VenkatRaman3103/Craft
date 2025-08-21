import path, { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";

export class ConfigManager {
    constructor() {
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = dirname(this.__filename);

        this.config_file_name = "cms.config.js";
        this.working_directory = process.cwd();

        this.temp_path = "/home/venkat/Code/Projects/Craft/Craft/backend/tmp/";
        this.config_path = path.join(this.temp_path, this.config_file_name);

        this.cachedConfig = null;
        this.listeners = new Set();

        this.load_config();
        this.watch_config();
    }

    // private
    get_default_config_content() {
        const config_file_path = path.join(
            this.__dirname,
            "default_config_content.js",
        );
        return fs.readFileSync(config_file_path, "utf8");
    }

    load_config() {
        if (!fs.existsSync(this.config_path)) {
            console.log("Creating config file", this.config_path);

            const config_content = this.get_default_config_content();
            fs.writeFileSync(this.config_path, config_content, "utf8");

            console.log("Config file created");
        } else {
            console.log("Config file exists", fs.existsSync(this.config_path));
        }
    }

    log() {
        console.log(this.__filename);
        console.log(this.__dirname);
        console.log(this.config_path);
    }

    async read_config() {
        const fileUrl = pathToFileURL(this.config_path).href;
        const module = await import(fileUrl + `?update=${Date.now()}`);
        this.cachedConfig = module.cmsConfig();
        return this.cachedConfig;
    }

    watch_config() {
        fs.watchFile(this.config_path, { interval: 200 }, async () => {
            console.log("Config file changed, reloading...");
            const newConfig = await this.read_config();

            this.listeners.forEach((cb) => cb(newConfig));
        });
    }

    get_config() {
        return this.cachedConfig;
    }

    onChange(callback) {
        this.listeners.add(callback);
    }
}
