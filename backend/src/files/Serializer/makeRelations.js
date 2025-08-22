export const makeRelations = (collections, parentSlug = null) => {
    for (let col of collections) {
        if (parentSlug) {
            col.parent_collection_slug = parentSlug;
        } else {
            col.parent_collection_slug = null;
        }

        if (col.sub_collections.length > 0) {
            makeRelations(col.sub_collections, col.slug);
        }
    }

    return collections;
};
