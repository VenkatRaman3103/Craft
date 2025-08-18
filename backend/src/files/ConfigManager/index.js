import { cmsConfig } from "../../../tmp/cms.config.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export class ConfigManager {
    constructor() {
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);

        this.config_file_name = "cms.config.js";
        this.working_directory = process.cwd();

        // this.temp_path = "/home/venkat/Code/Projects/Craft/project";
        this.temp_path = "/home/venkat/Code/Projects/Craft/Craft/backend/tmp/";

        this.config_path = path.join(this.temp_path, this.config_file_name);
    }

    // private
    get_default_config_content() {
        const config_file_path = path.join(
            this.__dirname,
            "default_config_content.js",
        );

        const content = fs.readFileSync(
            config_file_path,
            "utf8",
            (err, data) => (err ? console.log(err) : data),
        );

        return content;
    }

    load_config() {
        if (!fs.existsSync(this.config_path)) {
            console.log("Creating config file", this.config_path);

            const config_content = this.get_default_config_content();
            fs.writeFileSync(this.config_path, config_content, "utf8");

            console.log("Config file created", config_content);
        } else {
            console.log("Config file exists", fs.existsSync(this.config_path));
        }
    }

    log() {
        console.log(this.__filename);
        console.log(this.__dirname);
        console.log(this.config_path);
    }

    // read the config file
    read_config() {
        const config_content = cmsConfig();

        return config_content;
    }
}
