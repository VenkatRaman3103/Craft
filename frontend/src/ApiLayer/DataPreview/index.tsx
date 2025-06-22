import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff } from "lucide-react";
import "./index.scss";

interface DataPreviewProps {
    data: any;
    maxDepth?: number;
    showCopyButton?: boolean;
}

interface DataItemProps {
    data: any;
    path?: string;
    depth?: number;
    maxDepth?: number;
    isLast?: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({
    data,
    maxDepth = 10,
    showCopyButton = true,
}) => {
    const [viewMode, setViewMode] = useState<"structured" | "json">("json");
    const [copiedPath, setCopiedPath] = useState<string>("");

    const copyToClipboard = (text: string, path: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPath(path);
        setTimeout(() => setCopiedPath(""), 2000);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "structured" ? "json" : "structured");
    };

    return (
        <div className="data-preview">
            <div className="data-preview__header">
                <button
                    onClick={toggleViewMode}
                    className="data-preview__toggle"
                    title={`Switch to ${viewMode === "structured" ? "JSON" : "Structured"} view`}
                >
                    {viewMode === "structured" ? (
                        <EyeOff size={16} />
                    ) : (
                        <Eye size={16} />
                    )}
                    {viewMode === "structured" ? "Structured" : "JSON"}
                </button>
            </div>

            <div className="data-preview__content">
                {viewMode === "structured" ? (
                    <StructuredView
                        data={data}
                        maxDepth={maxDepth}
                        onCopy={showCopyButton ? copyToClipboard : undefined}
                        copiedPath={copiedPath}
                    />
                ) : (
                    <JsonView
                        data={data}
                        onCopy={showCopyButton ? copyToClipboard : undefined}
                    />
                )}
            </div>
        </div>
    );
};

const StructuredView: React.FC<{
    data: any;
    maxDepth: number;
    onCopy?: (text: string, path: string) => void;
    copiedPath: string;
}> = ({ data, maxDepth, onCopy, copiedPath }) => {
    return (
        <div className="structured-view">
            <DataItem
                data={data}
                path=""
                depth={0}
                maxDepth={maxDepth}
                onCopy={onCopy}
                copiedPath={copiedPath}
            />
        </div>
    );
};

const JsonView: React.FC<{
    data: any;
    onCopy?: (text: string, path: string) => void;
}> = ({ data, onCopy }) => {
    const jsonString = JSON.stringify(data, null, 2);

    return (
        <div className="json-view">
            {onCopy && (
                <button
                    onClick={() => onCopy(jsonString, "json")}
                    className="json-view__copy-btn"
                    title="Copy JSON"
                >
                    <Copy size={14} />
                </button>
            )}
            <pre className="json-view__content">{jsonString}</pre>
        </div>
    );
};

const DataItem: React.FC<
    DataItemProps & {
        onCopy?: (text: string, path: string) => void;
        copiedPath?: string;
    }
> = ({
    data,
    path = "",
    depth = 0,
    maxDepth = 10,
    isLast = true,
    onCopy,
    copiedPath,
}) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const getDataType = (value: any): string => {
        if (value === null) return "null";
        if (Array.isArray(value)) return "array";
        return typeof value;
    };

    const formatValue = (value: any): string => {
        if (value === null) return "null";
        if (value === undefined) return "undefined";
        if (typeof value === "string") return `"${value}"`;
        if (typeof value === "boolean") return value.toString();
        if (typeof value === "number") return value.toString();
        if (Array.isArray(value)) return `Array(${value.length})`;
        if (typeof value === "object")
            return `Object(${Object.keys(value).length})`;
        return String(value);
    };

    const isExpandable = (value: any): boolean => {
        return (
            (Array.isArray(value) && value.length > 0) ||
            (typeof value === "object" &&
                value !== null &&
                Object.keys(value).length > 0)
        );
    };

    const renderPrimitiveValue = (
        key: string,
        value: any,
        currentPath: string,
    ) => {
        const displayValue = formatValue(value);
        const dataType = getDataType(value);

        return (
            <div key={currentPath} className={`data-row data-row--${dataType}`}>
                <div className="data-row__key">
                    {onCopy && (
                        <button
                            onClick={() => onCopy(currentPath, currentPath)}
                            className={`data-row__copy-btn ${copiedPath === currentPath ? "copied" : ""}`}
                            title="Copy path"
                        >
                            <Copy size={12} />
                        </button>
                    )}
                    <span className="data-row__path">
                        {currentPath || "root"}
                    </span>
                </div>
                <div className="data-row__value">
                    <span className={`data-value data-value--${dataType}`}>
                        {displayValue}
                    </span>
                    {onCopy && (
                        <button
                            onClick={() =>
                                onCopy(String(value), `${currentPath}_value`)
                            }
                            className={`data-row__copy-btn ${copiedPath === `${currentPath}_value` ? "copied" : ""}`}
                            title="Copy value"
                        >
                            <Copy size={12} />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderComplexValue = (
        key: string,
        value: any,
        currentPath: string,
    ) => {
        const dataType = getDataType(value);
        const itemCount = Array.isArray(value)
            ? value.length
            : Object.keys(value).length;

        if (depth >= maxDepth) {
            return renderPrimitiveValue(
                key,
                `${dataType}(${itemCount}) - Max depth reached`,
                currentPath,
            );
        }

        return (
            <div key={currentPath} className="data-group">
                <div
                    className={`data-row data-row--${dataType} data-row--expandable`}
                >
                    <div className="data-row__key">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="data-row__expand-btn"
                            title={isExpanded ? "Collapse" : "Expand"}
                        >
                            {isExpanded ? (
                                <ChevronDown size={14} />
                            ) : (
                                <ChevronRight size={14} />
                            )}
                        </button>
                        {onCopy && (
                            <button
                                onClick={() => onCopy(currentPath, currentPath)}
                                className={`data-row__copy-btn ${copiedPath === currentPath ? "copied" : ""}`}
                                title="Copy path"
                            >
                                <Copy size={12} />
                            </button>
                        )}
                        <span className="data-row__path">
                            {currentPath || "root"}
                        </span>
                    </div>
                    <div className="data-row__value">
                        <span className={`data-value data-value--${dataType}`}>
                            {formatValue(value)}
                        </span>
                        {onCopy && (
                            <button
                                onClick={() =>
                                    onCopy(
                                        JSON.stringify(value),
                                        `${currentPath}_value`,
                                    )
                                }
                                className={`data-row__copy-btn ${copiedPath === `${currentPath}_value` ? "copied" : ""}`}
                                title="Copy value as JSON"
                            >
                                <Copy size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="data-group__children">
                        {Array.isArray(value)
                            ? value.map((item, index) => {
                                  const childPath = currentPath
                                      ? `${currentPath}[${index}]`
                                      : `[${index}]`;
                                  return isExpandable(item) ? (
                                      <DataItem
                                          key={childPath}
                                          data={item}
                                          path={childPath}
                                          depth={depth + 1}
                                          maxDepth={maxDepth}
                                          isLast={index === value.length - 1}
                                          onCopy={onCopy}
                                          copiedPath={copiedPath}
                                      />
                                  ) : (
                                      renderPrimitiveValue(
                                          `[${index}]`,
                                          item,
                                          childPath,
                                      )
                                  );
                              })
                            : Object.entries(value).map(
                                  ([childKey, childValue], index, entries) => {
                                      const childPath = currentPath
                                          ? `${currentPath}.${childKey}`
                                          : childKey;
                                      return isExpandable(childValue) ? (
                                          <DataItem
                                              key={childPath}
                                              data={childValue}
                                              path={childPath}
                                              depth={depth + 1}
                                              maxDepth={maxDepth}
                                              isLast={
                                                  index === entries.length - 1
                                              }
                                              onCopy={onCopy}
                                              copiedPath={copiedPath}
                                          />
                                      ) : (
                                          renderPrimitiveValue(
                                              childKey,
                                              childValue,
                                              childPath,
                                          )
                                      );
                                  },
                              )}
                    </div>
                )}
            </div>
        );
    };

    if (!isExpandable(data)) {
        return renderPrimitiveValue("", data, path);
    }

    return renderComplexValue("", data, path);
};

export default DataPreview;
