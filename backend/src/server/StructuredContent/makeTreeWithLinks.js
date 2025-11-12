export function makeTreeWithLinks(arr) {
    function walk(node) {
        let type;

        if (node.elements) {
            type = "collection";
        } else if (node.pages || (node.collections && node.parent_col_id)) {
            type = "element";
        } else if (node.collections) {
            type = "group";
        } else {
            type = "page";
        }

        const result = {
            id: node.id,
            name: node.title || node.name,
            type,
            ...(node.slug && { link: `/${node.slug}/${node.id}` }),
        };

        if (node.elements) {
            result.children = node.elements.map(walk);
        } else if (node.pages && node.pages.length > 0) {
            result.children = node.pages.map(walk);
        } else if (node.collections && node.collections.length > 0) {
            result.children = node.collections.map(walk);
        } else {
            result.children = [];
        }

        return result;
    }

    return arr.map(walk);
}
