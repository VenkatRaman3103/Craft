import { groupsTable } from "../../../db/schema/index.js";
import { db } from "../../../server/server.js";

export const syncGroups = async (groups) => {
    // create groups is not exist in the db
    const dbGroups = await db.select().from(groupsTable);
    console.log(groups, dbGroups, "groups");

    for (let config_group of groups) {
        const isExist = dbGroups.find((g) => g.name == config_group.name);
        console.log(isExist, "isExist");

        if (isExist == undefined) {
            await db.insert(groupsTable).values({
                name: config_group.name,
                description: config_group.description,
                heading: config_group.heading,
            });
        }
    }

    // TODO: update groups
    // TODO: delete groups
};
