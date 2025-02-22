import { sampleCollections } from "./queries/collection.js";

async function seed() {
    await sampleCollections();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
