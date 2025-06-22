import { Trash2 } from "lucide-react";

interface ApiParam {
    name: string;
    description: string;
    type: "string" | "number" | "boolean" | "date";
    defaultValue?: string;
    options?: string[];
}

interface ParamsPanelProps {
    availableParams: ApiParam[];
    paramValues: Record<string, string>;
    updateParamValue: (paramName: string, value: string) => void;
    clearParam: (paramName: string) => void;
    clearAllParams: () => void;
    buildApiUrl: () => string;
    apiUrl: string;
}

export const ParamsPanel = ({
    availableParams,
    paramValues,
    updateParamValue,
    clearParam,
    clearAllParams,
    buildApiUrl,
    apiUrl,
}: ParamsPanelProps) => {
    const activeParamsCount = Object.values(paramValues).filter(Boolean).length;

    return (
        <div className="params-panel">
            <div className="params-panel__header">
                <h3 className="params-panel__title">URL Parameters</h3>
                <button
                    onClick={clearAllParams}
                    className="btn btn--danger btn--sm"
                    disabled={activeParamsCount === 0}
                >
                    Clear All
                </button>
            </div>

            <div className="params-table">
                {availableParams.map((param) => (
                    <div key={param.name} className="param-row">
                        <div className="param-info">
                            <div className="param-name">{param.name}</div>
                            <div className="param-description">
                                {param.description}
                            </div>
                        </div>

                        <div className="param-input">
                            {param.options ? (
                                <select
                                    value={paramValues[param.name] || ""}
                                    onChange={(e) =>
                                        updateParamValue(
                                            param.name,
                                            e.target.value,
                                        )
                                    }
                                    className="select"
                                >
                                    <option value="">
                                        Select {param.name}
                                    </option>
                                    {param.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={
                                        param.type === "date"
                                            ? "date"
                                            : param.type === "number"
                                              ? "number"
                                              : "text"
                                    }
                                    placeholder={
                                        param.defaultValue ||
                                        `Enter ${param.name}`
                                    }
                                    value={paramValues[param.name] || ""}
                                    onChange={(e) =>
                                        updateParamValue(
                                            param.name,
                                            e.target.value,
                                        )
                                    }
                                    className="input-field"
                                />
                            )}

                            {paramValues[param.name] && (
                                <button
                                    onClick={() => clearParam(param.name)}
                                    className="btn btn--danger btn--sm param-clear"
                                    title="Clear parameter"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(apiUrl || activeParamsCount > 0) && (
                <div className="url-preview">
                    <div className="url-preview__label">Final URL:</div>
                    <code className="url-preview__url">
                        {buildApiUrl() || apiUrl}
                    </code>
                </div>
            )}
        </div>
    );
};
