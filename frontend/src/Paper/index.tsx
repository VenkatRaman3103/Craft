import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.scss";
export const Paper = () => {
    return (
        <div>
            <Sketch />
        </div>
    );
};

const createNewTag = () => ({
    uid: uuid(),
    tag: "div",
    attributes: {
        id: "tag_id",
        className: "tag_class",
    },
    style: {
        border: "1px solid white",
        padding: "10px",
        margin: "10px",
    },
    children: [],
});

export const Sketch = () => {
    const [elements, setElements] = useState<any>([]);

    function addElement() {
        setElements([...elements, createNewTag()]);
    }

    function addChild(uid) {
        function addChildToTree(nodes) {
            return nodes.map((node) => {
                if (node.uid == uid) {
                    return {
                        ...node,
                        children: [...node.children, createNewTag()],
                    };
                }

                return {
                    ...node,
                    children: addChildToTree(node.children),
                };
            });
        }

        setElements((prev) => addChildToTree(prev));
    }

    function removeChild(uid) {
        function removeChildFromTree(nodes) {
            return nodes
                .filter((node) => node.uid !== uid)
                .map((node) => {
                    return {
                        ...node,
                        children: removeChildFromTree(node.children),
                    };
                });
        }

        setElements((prev) => removeChildFromTree(prev));
    }

    function renderDocument(node) {
        const Tag = node.tag;

        return (
            <div>
                <Tag {...node.attributes} style={node.style}>
                    <button onClick={() => addChild(node.uid)}>
                        add child
                    </button>
                    <button onClick={() => removeChild(node.uid)}>
                        delete element
                    </button>
                    <div className="element">element</div>
                    {node.children.map((node, i) => (
                        <React.Fragment key={i}>
                            {renderDocument(node)}
                        </React.Fragment>
                    ))}
                </Tag>
            </div>
        );
    }

    return (
        <div>
            <button onClick={addElement}>Add element</button>
            {elements.map((tag, i) => (
                <React.Fragment key={i}>{renderDocument(tag)}</React.Fragment>
            ))}
        </div>
    );
};
