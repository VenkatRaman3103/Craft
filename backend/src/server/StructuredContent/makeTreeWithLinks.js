export function makeTreeWithLinks(arr) {
    function walk(node) {
        const result = {
            id: node.id,
            name: node.name,
            type: "pages",
            ...(node.slug && {
                link: `/${node.slug}/${node.id}`,
            }),
        };

        if (node.collections) {
            result.type = "collections";
            result.children = node.collections.map(walk);
        } else if (node.elements) {
            result.type = "elements";
            result.children = node.elements.map(walk);
        } else if (node.pages) {
            result.type = "pages";
            result.children = node.pages.map(walk);
        } else {
            result.children = [];
        }

        return result;
    }

    return arr.map(walk);
}
