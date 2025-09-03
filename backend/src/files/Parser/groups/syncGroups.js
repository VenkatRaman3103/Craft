import { eq } from "drizzle-orm";
import { groupsTable } from "../../../db/schema/index.js";
import { db } from "../../../server/server.js";

export const syncGroups = async (groups) => {
    // groups from db
    const dbGroups = await db.select().from(groupsTable);

    // create groups is not exist in the db
    for (let config_group of groups) {
        const isExist = dbGroups.find((g) => g.name == config_group.name);

        if (isExist == undefined) {
            await db.insert(groupsTable).values({
                name: config_group.name,
                description: config_group.description,
                heading: config_group.heading,
            });
        }
    }

    // update groups
    for (let config_group of groups) {
        const g = await db.query.groupsTable.findFirst({
            where: eq(groupsTable.name, config_group.name),
        });

        if (
            config_group.name != g.name ||
            config_group.description != g.description ||
            config_group.heading != g.heading
        ) {
            await db
                .update(groupsTable)
                .set({
                    name: config_group.name,
                    heading: config_group.heading,
                    description: config_group.description,
                })
                .where(eq(groupsTable.name, g.name));
        }
    }

    // delete groups
    for (let db_group of dbGroups) {
        const isExist = groups.find((item) => item.name == db_group.name);

        if (isExist == undefined) {
            await db
                .delete(groupsTable)
                .where(eq(groupsTable.name, db_group.name));
        }
    }
};
