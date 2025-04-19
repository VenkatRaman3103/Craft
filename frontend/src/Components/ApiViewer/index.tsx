import { getApiPreviewData } from "@/api/getApiPreviewData";
import { useQuery } from "@tanstack/react-query";
import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useMemo,
} from "react";
import "./index.scss";
import { Triangle } from "lucide-react";

const HighlightContext = createContext({
    highlightedPath: "",
    setHighlightedPath: () => {},
});

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

function generateLineNumbers(obj) {
    const lineMap = new Map();
    let lineCounter = 1;

    function traverse(object, path = "") {
        if (!object || typeof object !== "object") return;

        Object.keys(object).forEach((key) => {
            const currentPath = path ? `${path}.${key}` : key;
            lineMap.set(currentPath, lineCounter++);

            if (object[key] !== null && typeof object[key] === "object") {
                traverse(object[key], currentPath);
            }
        });
    }

    traverse(obj);
    return lineMap;
}

export const ApiViewer = () => {
    const [expandedPaths, setExpandedPaths] = useState(new Set());
    const [highlightedPath, setHighlightedPath] = useState("");
    const { data: apiData } = useQuery({
        queryKey: ["api-preview"],
        queryFn: () => getApiPreviewData(),
    });

    const [treeHeight, setTreeHeight] = useState();

    const lineNumbersMap = useMemo(() => {
        if (!apiData) return new Map();
        return generateLineNumbers(apiData);
    }, [apiData]);

    useEffect(() => {
        if (apiData) {
            setTreeHeight(calculateTreeHeight(apiData, "name"));

            const allPaths = getAllPaths(apiData);
            setExpandedPaths(new Set(allPaths));
        }
    }, [apiData]);

    function getAllPaths(obj, currentPath = "") {
        if (!obj || typeof obj !== "object") return [];

        let paths = [];
        Object.keys(obj).forEach((key) => {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            paths.push(newPath);

            if (typeof obj[key] === "object" && obj[key] !== null) {
                paths = [...paths, ...getAllPaths(obj[key], newPath)];
            }
        });

        return paths;
    }

    const togglePath = (path) => {
        setExpandedPaths((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    };

    const isPathExpanded = (path) => {
        return expandedPaths.has(path);
    };

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
                    isExpanded={isPathExpanded(path)}
                    toggleExpand={() => togglePath(path)}
                    lineNumber={lineNumbersMap.get(path) || 0}
                    lineNumbersMap={lineNumbersMap}
                />
            );
        }
        return Object.keys(object).map((key, index) => {
            const currentPath = path ? `${path}.${key}` : key;
            const isFirst = isFirstCall && index === 0;

            if (typeof object[key] === "object" && object[key] !== null) {
                const isExpanded = isPathExpanded(currentPath);
                return (
                    <div className="node" key={key}>
                        <Entries
                            value={currentPath}
                            displayValue={key}
                            displayDepth={level}
                            lineNumbersMap={lineNumbersMap}
                            isFirst={isFirst}
                            isExpandable={true}
                            treeHeight={treeHeight}
                            apiData={apiData}
                            isExpanded={isExpanded}
                            toggleExpand={() => togglePath(currentPath)}
                            lineNumber={lineNumbersMap.get(currentPath) || 0}
                        />
                        {isExpanded && (
                            <div className="child-node">
                                {renderTree(
                                    object[key],
                                    currentPath,
                                    level + 1,
                                    false,
                                )}
                            </div>
                        )}
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
                        lineNumber={lineNumbersMap.get(currentPath) || 0}
                        lineNumbersMap={lineNumbersMap}
                    />
                );
            }
        });
    }

    if (!apiData) {
        return <div>loading</div>;
    }

    const contextValue = {
        highlightedPath,
        setHighlightedPath,
        highlightedLineNumber: highlightedPath
            ? lineNumbersMap.get(highlightedPath) || 0
            : 0,
        isPathRelated: (
            currentPath,
            highlightPath,
            currentLineNumber,
            highlightLineNumber,
        ) => {
            if (!highlightPath) return false;

            if (currentPath === highlightPath) return true;

            if (highlightPath.startsWith(currentPath + ".")) return true;

            if (currentPath.startsWith(highlightPath + ".")) return true;

            if (currentLineNumber < highlightLineNumber) {
                const currentSegments = currentPath.split(".");
                const highlightSegments = highlightPath.split(".");

                let commonPrefixLength = 0;
                while (
                    commonPrefixLength < currentSegments.length &&
                    commonPrefixLength < highlightSegments.length &&
                    currentSegments[commonPrefixLength] ===
                        highlightSegments[commonPrefixLength]
                ) {
                    commonPrefixLength++;
                }

                return (
                    commonPrefixLength > 0 &&
                    currentSegments.length <= highlightSegments.length
                );
            }

            return false;
        },
    };

    return (
        <HighlightContext.Provider value={contextValue}>
            <div className="entries-container">
                <div className="entries-wrapper">{renderTree(apiData)}</div>
            </div>
        </HighlightContext.Provider>
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
    isExpanded = true,
    toggleExpand,
    lineNumber,
    lineNumbersMap,
}: any) => {
    const { highlightedPath, setHighlightedPath } =
        useContext(HighlightContext);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (isExpandable) {
            setIsCollapsed(!isExpanded);
        }
    }, [isExpanded, isExpandable]);

    const handleToggle = () => {
        if (isExpandable && toggleExpand) {
            toggleExpand();
        }
    };

    const displayName = displayValue || value.split(".").pop();

    const [subTreeHeight, setSubTreeHeight] = useState();

    useEffect(() => {
        setSubTreeHeight(treeHeight - calculateTreeHeight(apiData, value));
    }, [apiData, treeHeight, value]);

    const isDirectlyHighlighted = highlightedPath === value;

    const isAncestorOfHighlighted =
        highlightedPath &&
        highlightedPath.startsWith(value + ".") &&
        value !== highlightedPath;

    const isDescendantOfHighlighted =
        highlightedPath &&
        value.startsWith(highlightedPath + ".") &&
        value !== highlightedPath;

    const isHighlighted =
        isDirectlyHighlighted ||
        isAncestorOfHighlighted ||
        isDescendantOfHighlighted;

    const handleMouseEnter = () => {
        setHighlightedPath(value);
    };

    const handleMouseLeave = () => {
        setHighlightedPath("");
    };

    return (
        <div
            className={`bar ${isHighlighted ? "bar-highlighted" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="key-opetions">
                <div className="foo">
                    <div className="line-number">{lineNumber}</div>
                    {isExpandable && (
                        <div className="depth-indicator">{subTreeHeight}</div>
                    )}
                    <div
                        className={`access-key-indicator ${isHighlighted ? "highlighted" : ""}`}
                    >
                        <div className="access-key-indicator-label">
                            {value}
                        </div>
                    </div>
                </div>

                <div className="markers">
                    <div
                        className={`marker ${isHighlighted ? "highlighted" : ""}`}
                    ></div>
                </div>

                <div className="collapseable-btn" onClick={handleToggle}>
                    {isExpandable && (
                        <Triangle
                            size={16}
                            style={{
                                transform: isCollapsed
                                    ? "rotate(0deg)"
                                    : "rotate(180deg)",
                                transition: "transform 0.2s ease-in-out",
                                cursor: "pointer",
                                color: isHighlighted
                                    ? "var(--highlight-color, #3498db)"
                                    : undefined,
                            }}
                        />
                    )}
                </div>
            </div>

            <div
                className={`entry ${isCollapsed ? "collapsed" : ""} ${isHighlighted ? "highlighted" : ""}`}
            >
                <div className="object-name-wrapper">
                    <div className="strips-container">
                        {Array.from({ length: displayDepth }).map((_, ind) => (
                            <div
                                className={`strip 
                                    ${ind + 1 == displayDepth ? "end" : ""} 
                                    // ${ind + 1 >= highlightedPath.split(".").length ? "highlighted" : ""}
                                    ${isHighlighted && ind + 1 >= highlightedPath.split(".").length ? "highlight" : ""}
                                `}
                                key={ind}
                            >
                                <div className="depth-indicator">
                                    {/* {`${highlightedPath.split(".").length} ${ind + 1}`} */}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className={`branching ${isHighlighted ? "highlighted" : ""}`}
                        style={{
                            zIndex: `${isHighlighted ? 2 : 0}`,
                        }}
                    ></div>
                    <div
                        className={`circle ${isDirectlyHighlighted ? "highlighted" : ""}`}
                        onClick={isExpandable ? handleToggle : undefined}
                        style={isExpandable ? { cursor: "pointer" } : {}}
                    ></div>
                    <div
                        className={`value ${isDirectlyHighlighted ? "highlighted" : ""}`}
                    >
                        {displayName}
                    </div>
                </div>
            </div>
        </div>
    );
};
