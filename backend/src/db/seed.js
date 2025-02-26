import { sampleCollectionJoinPages } from "./queries/collectionJoinPages.js";
import { sampleCollections } from "./queries/collections.js";
import { deleteCollections } from "./queries/deleteCollectins.js";
import { samplePages } from "./queries/pages.js";

async function seed() {
    await samplePages();
    await sampleCollectionJoinPages();
    // await sampleCollections();
    // await deleteCollections();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
