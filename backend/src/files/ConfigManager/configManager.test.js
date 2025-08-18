import fs from "fs";
import { describe, expect, it } from "vitest";
import { ConfigManager } from ".";

describe("ConfigManager test", () => {
    const config = new ConfigManager();

    it("should have correct file, dir path", () => {
        const fileName =
            "/home/venkat/Code/Projects/Craft/Craft/backend/src/files/ConfigManager/index.js";

        const dirName =
            "/home/venkat/Code/Projects/Craft/Craft/backend/src/files/ConfigManager";

        expect(config.__filename).toBe(fileName);
        expect(config.__dirname).toBe(dirName);
    });

    it("should have correct config file name", () => {
        const configFile = "cms.config.js";

        expect(config.config_file_name).toBe(configFile);
    });

    it("should have correct config path", () => {
        const configPath =
            "/home/venkat/Code/Projects/Craft/Craft/backend/tmp/cms.config.js";

        expect(config.config_path).toBe(configPath);
    });

    it("should have created config file", () => {
        config.load_config();

        expect(fs.existsSync(config.config_path)).toBe(true);
    });

    it("should have default config content", () => {
        const config_file = fs.readFileSync(
            "/home/venkat/Code/Projects/Craft/Craft/backend/tmp/cms.config.js",
            "utf8",
        );

        expect(config_file).not.toBe(null);
    });
});
