export const makeRelations = (collections, parentSlug = null) => {
    for (let col of collections) {
        const subCollections = col.elements.filter((item) => {
            return item.kind == "collections";
        });

        for (let subCol of subCollections) {
            subCol.parent_collection_slug = col.slug;

            for (let item of subCol.items) {
                item.parent_sub_collection_slug = subCol.slug;
            }

            makeRelations(subCol.items, subCol.slug);
        }
    }

    return collections;
};
