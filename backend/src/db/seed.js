import { sampleCollections } from "./queries/collections.js";
import { deleteCollections } from "./queries/deleteCollectins.js";

async function seed() {
    // await sampleCollections();
    // await deleteCollections();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
