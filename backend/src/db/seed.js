import { db } from "../server/server.js";

async function seed() {
    // await insertDummyData();
}

seed().catch((error) => {
    console.log(error);
    process.exit(1);
});
