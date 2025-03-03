import { sampleBlocks } from "./queries/blocks.js";

async function seed() {
    await sampleBlocks();
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
