export const makeRelations = (collections, parentSlug = null) => {
    for (let col of collections) {
        const children = col.elements || col.items || [];

        const subCollections = children.filter(
            (item) => item.kind === "collections",
        );

        for (let subCol of subCollections) {
            subCol.parent_collection_slug = col.slug;

            const subChildren = subCol.elements || subCol.items || [];
            for (let item of subChildren) {
                item.parent_sub_collection_slug = subCol.slug;
                item.parent_collection_slug = col.slug;
            }

            makeRelations(subChildren, subCol.slug);
        }
    }

    return collections;
};
