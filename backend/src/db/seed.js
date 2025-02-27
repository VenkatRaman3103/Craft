import { db } from "../server/server.js";
import { sampleCollectionJoinPages } from "./queries/collectionJoinPages.js";
import { sampleCollections } from "./queries/collections.js";
import { deleteCollections } from "./queries/deleteCollectins.js";
import { insertDummyData, samplePages } from "./queries/pages.js";
import {
    blocks,
    blockTypes,
    fieldDefinitions,
    fieldValues,
    pages,
} from "./schema/pages.js";

async function seed() {
    // await samplePages();
    // await sampleCollectionJoinPages();
    // await sampleCollections();
    // await deleteCollections();
    // await insertDummyData();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
