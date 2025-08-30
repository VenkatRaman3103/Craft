export const makeRelations = (collections, parentSlug = null) => {
    // NOTE: adding parent collection id and slug to the individual items
    for (let col of collections) {
        const children = col.elements || col.items || [];

        // sub-collections
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

        // sub-pages
        const subPages = children.filter((item) => item.kind == "pages");

        for (let subPage of subPages) {
            subPage.parent_collection_slug = col.slug;

            const subChildren = subPage.elements || subPage.items || [];

            for (let item of subChildren) {
                item.parent_sub_pages_slug = subPage.slug;
                item.parent_collection_slug = col.slug;
            }

            makeRelations(subChildren, subPage.slug);
        }

        console.log(subPages, "subPages");

        // sub-fields
        const subFields = children.filter((item) => item.kind == "fields");
        console.log(subFields, "subFields");
    }

    return collections;
};
