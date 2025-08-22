export const makeRelations = (collections, parentSlug = null) => {
    for (let col of collections) {
        const subCollections = col.elements.filter((item) => {
            return item.kind == "collections";
        });

        console.log(subCollections);
    }

    return collections;
};
