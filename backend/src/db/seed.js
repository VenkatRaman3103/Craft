import { db } from "../server/server.js";
import {
    createArrayBlocks,
    createArrayTemplate,
} from "./queries/arrayBlock/dummyData.js";
// import { sampleBlocks } from "./queries/blocks.js";
// import { samplePages } from "./queries/pages.js";
// import { sampleChild } from "./queries/test/child.js";
// import { sampleParent } from "./queries/test/parent.js";
// import { blocks } from "./schema/blocks.js";
// import { textFields } from "./schema/fields.js";
// import { page_items, pages } from "./schema/pages.js";
// import { v4 as uuidv4 } from "uuid";

async function seed() {
    await createArrayTemplate();
    // await createArrayBlocks();

    // await db.delete(blocks);
    // await samplePages();
    // await db.delete(pages);
    // await db.delete(page_items);
    // await db.delete(textFields);
    // await db.delete(blocks);
    //
    // await getPages();
    // await sampleParent();
    // await sampleChild();
    // await sampleBlocks();
    // await sampleCollectionJoinPages();
    // await sampleCollections();
    // await deleteCollections();
    // await insertDummyData();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
