import { getApiPreviewData } from "@/api/getApiPreviewData";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import "./index.scss";
import { Triangle } from "lucide-react";

function calculateTreeHeight(tree, targetPath) {
    const pathParts = targetPath.split(".");

    let currentNode = tree;
    for (const part of pathParts) {
        if (!currentNode || typeof currentNode !== "object") {
            return 0;
        }
        currentNode = currentNode[part];
    }

    if (currentNode === undefined) {
        return 0;
    }

    if (currentNode === null || typeof currentNode !== "object") {
        return 1;
    }

    return 1 + countAllNodes(currentNode);
}

function countAllNodes(node) {
    if (node === null || typeof node !== "object") {
        return 1;
    }

    let count = 0;
    for (const key in node) {
        count += countAllNodes(node[key]);
    }

    return count;
}
export const ApiViewer = () => {
    const [apiResponse, setApiResponse] = useState();
    const { data: apiData } = useQuery({
        queryKey: ["api-preview"],
        queryFn: () => getApiPreviewData(),
    });

    const [treeHeight, setTreeHeight] = useState<number>();

    // setting the tree height
    useEffect(() => {
        setTreeHeight(calculateTreeHeight(apiData, "name"));
    }, [apiData]);

    function renderTree(object, path = "", level = 0, isFirstCall = true) {
        if (!object) return null;
        if (typeof object === "string") {
            return (
                <Entries
                    value={path}
                    displayDepth={level}
                    isFirst={isFirstCall}
                    treeHeight={treeHeight}
                    apiData={apiData}
                />
            );
        }
        return Object.keys(object).map((key, index) => {
            const currentPath = path ? `${path}.${key}` : key;
            const isFirst = isFirstCall && index === 0;
            if (typeof object[key] === "object" && object[key] !== null) {
                return (
                    <div className="node" key={key}>
                        <Entries
                            value={currentPath}
                            displayValue={key}
                            displayDepth={level}
                            isFirst={isFirst}
                            isExpandable={true}
                            treeHeight={treeHeight}
                            apiData={apiData}
                        />
                        <div className="child-node">
                            {renderTree(
                                object[key],
                                currentPath,
                                level + 1,
                                false,
                            )}
                        </div>
                    </div>
                );
            } else {
                return (
                    <Entries
                        value={currentPath}
                        displayValue={key}
                        displayDepth={level}
                        isFirst={isFirst}
                        key={currentPath}
                        treeHeight={treeHeight}
                        apiData={apiData}
                    />
                );
            }
        });
    }

    if (!apiData) {
        return <div>loading</div>;
    }

    return (
        <div className="entries-container">
            <div className="entries-wrapper">{renderTree(apiData)}</div>
        </div>
    );
};

const Entries = ({
    value,
    displayValue,
    displayDepth,
    isFirst,
    isExpandable = false,
    treeHeight,
    apiData,
}: any) => {
    const [isObejct, setIsObejct] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    const displayName = displayValue || value.split(".").pop();

    const [subTreeHeight, setSubTreeHeight] = useState();

    useEffect(() => {
        setSubTreeHeight(treeHeight - calculateTreeHeight(apiData, value));
    }, [apiData, treeHeight, value]);

    return (
        <div className="bar">
            <div className="key-opetions">
                <div className="foo">
                    {isExpandable && (
                        <div className="depth-indicator">{subTreeHeight}</div>
                    )}
                    <div className="depth-indicator">{displayDepth}</div>
                    <div className="access-key-indicator">
                        <div className="access-key-indicator-label">
                            {value}
                        </div>
                    </div>
                </div>

                <div className="markers">
                    <div className="marker"></div>
                </div>
            </div>

            <div
                className={`entry ${isCollapsed ? "collapsed" : ""}`}
                // style={{ marginLeft: isFirst ? 0 : `${displayDepth * 100}px` }}
            >
                <div className="object-name-wrapper">
                    <div className="strips-container">
                        {Array.from({ length: displayDepth }).map((_, ind) => (
                            <div
                                className={`strip 
                                            ${ind + 1 == displayDepth ? "end" : ""} 
                                            ${typeof apiData[value] == "object" ? "obj" : ""}
                                        `}
                                key={ind}
                            ></div>
                        ))}
                    </div>
                    <div className="branching"></div>
                    <div className="circle"></div>
                    <div className="value">{displayName}</div>
                </div>
            </div>
        </div>
    );
};
