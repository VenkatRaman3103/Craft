import { sampleBlocks } from "./queries/blocks.js";
import { sampleChild } from "./queries/test/child.js";
import { sampleParent } from "./queries/test/parent.js";

async function seed() {
    await sampleParent();
    await sampleChild();
    // await sampleBlocks();
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
