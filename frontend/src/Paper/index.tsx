import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import "./index.scss";
import { Select } from "./Drawer/Select";

const dummyData = ["option1", "option2", "option3"];
const defaultValue = dummyData[0];

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

    const updateClassName = (uid: string, newClassName: string) => {
        const updateTree = (nodes) =>
            nodes.map((node) =>
                node.uid === uid
                    ? {
                          ...node,
                          attributes: {
                              ...node.attributes,
                              className: newClassName,
                          },
                          children: updateTree(node.children),
                      }
                    : { ...node, children: updateTree(node.children) },
            );
        setElements((prev) => updateTree(prev));
    };

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
                    <input
                        value={node.attributes.className}
                        onChange={(e) =>
                            updateClassName(node.uid, e.target.value)
                        }
                        placeholder="Edit className"
                        style={{
                            marginBottom: "10px",
                            display: "block",
                            padding: "4px",
                        }}
                    />
                    <button onClick={() => addChild(node.uid)}>
                        add child
                    </button>
                    <button onClick={() => removeChild(node.uid)}>
                        delete element
                    </button>
                    <div className="element">element</div>
                    {node.children.map((child, i) => (
                        <React.Fragment key={i}>
                            {renderDocument(child)}
                        </React.Fragment>
                    ))}
                </Tag>
            </div>
        );
    }

    return (
        <>
            <div>
                <button onClick={addElement}>Add element</button>
                {elements.map((tag, i) => (
                    <React.Fragment key={i}>
                        {renderDocument(tag)}
                    </React.Fragment>
                ))}
            </div>
            <Select
                options={dummyData}
                defaultValue={dummyData[0]}
                update={""}
            />
        </>
    );
};
