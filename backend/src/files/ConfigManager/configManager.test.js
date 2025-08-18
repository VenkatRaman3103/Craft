import { describe, expect, it } from "vitest";
import { ConfigManager } from ".";

describe("ConfigManager test", () => {
    const config = new ConfigManager();

    it("should have correct file, dir, config file name, working directory, temp path, and config path", () => {
        const fileName =
            "/home/venkat/Code/Projects/Craft/Craft/backend/src/files/ConfigManager/index.js";

        expect(config.__filename).toBe(fileName);
    });
});
