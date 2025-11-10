export function makeTreeWithLinks(arr) {
    function walk(node) {
        let type;

        if (node.collections) type = "group";
        else if (node.elements) type = "collection";
        else if (node.pages) type = "element";
        else type = "page";

        const result = {
            id: node.id,
            name: node.title || node.name,
            type,
            ...(node.slug && {
                link: `/${node.slug}/${node.id}`,
            }),
        };

        if (node.collections) {
            result.children = node.collections.map(walk);
        } else if (node.elements) {
            result.children = node.elements.map(walk);
        } else if (node.pages) {
            result.children = node.pages.map(walk);
        } else {
            result.children = [];
        }

        return result;
    }

    return arr.map(walk);
}
