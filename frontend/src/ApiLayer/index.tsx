import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Plus,
    Play,
    Upload,
    Eye,
    EyeOff,
    RefreshCw,
    Settings,
    Save,
    Edit3,
    Check,
    X,
} from "lucide-react";
import "./index.scss";
import { ParamsPanel } from "./ParamsPanel";
import { OperationsPanel } from "./OperationPanel";
import {
    useApiConfigurations,
    useApiConfigurationWithDetails,
    useCreateApiConfiguration,
    useUpdateApiConfiguration,
    useUpdateApiOperation,
    useCreateApiOperation,
    useDeleteApiOperation,
    useSaveApiResult,
    useUpdateApiOperationOrders,
} from "./useApiEditor.ts";
import { availableParams } from "@/Data/apiEditor.ts";
import DataPreview from "./DataPreview/index.tsx";

interface MapField {
    from: string;
    to: string;
    value: string;
    type: "copy" | "value" | "transform";
}

interface Operation {
    id: number;
    type: "filter" | "map";
    conditionType: "simple" | "custom";
    field: string;
    operator: string;
    value: string;
    customCode: string;
    mapFields: MapField[];
    executionOrder?: number;
}

interface Field {
    value: string;
    label: string;
    type: string;
}

interface ApiParam {
    name: string;
    description: string;
    type: "string" | "number" | "boolean" | "date";
    defaultValue?: string;
    options?: string[];
}

interface ApiParamValue {
    [key: string]: string;
}

export const ApiEditor: React.FC = () => {
    const { api_id } = useParams<{ api_id: string }>();
    const navigate = useNavigate();

    const [jsonData, setJsonData] = useState<any[]>([]);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [result, setResult] = useState<any[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [showParams, setShowParams] = useState<boolean>(false);
    const [apiUrl, setApiUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [paramValues, setParamValues] = useState<ApiParamValue>({});

    const [configName, setConfigName] = useState<string>("");
    const [configDescription, setConfigDescription] = useState<string>("");
    const [isEditingConfig, setIsEditingConfig] = useState<boolean>(false);
    const [tempConfigName, setTempConfigName] = useState<string>("");
    const [tempConfigDescription, setTempConfigDescription] =
        useState<string>("");

    const currentConfigId =
        api_id === "new" ? null : parseInt(api_id || "0", 10);
    const isNewConfig = api_id === "new";
    const isValidConfigId = currentConfigId && !isNaN(currentConfigId);

    const { data: configurations } = useApiConfigurations();
    const { data: configDetails, isLoading: isLoadingConfig } =
        useApiConfigurationWithDetails(isValidConfigId ? currentConfigId : 0);
    const createConfigMutation = useCreateApiConfiguration();
    const updateConfigMutation = useUpdateApiConfiguration();
    const createOperationMutation = useCreateApiOperation();
    const updateOperationMutation = useUpdateApiOperation();
    const deleteOperationMutation = useDeleteApiOperation();
    const saveResultMutation = useSaveApiResult();
    const updateOperationOrdersMutation = useUpdateApiOperationOrders();

    const parseUrlParameters = (
        url: string,
    ): { baseUrl: string; params: ApiParamValue } => {
        try {
            const urlObj = new URL(url);
            const params: ApiParamValue = {};

            urlObj.searchParams.forEach((value, key) => {
                params[key] = value;
            });

            const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

            return { baseUrl, params };
        } catch (error) {
            return { baseUrl: url, params: {} };
        }
    };

    const getBaseUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch (error) {
            return url;
        }
    };

    useEffect(() => {
        if (
            api_id &&
            api_id !== "new" &&
            (!currentConfigId || isNaN(currentConfigId))
        ) {
            setError("Invalid API configuration ID");
        }
    }, [api_id, currentConfigId]);

    useEffect(() => {
        if (configDetails && isValidConfigId) {
            const {
                configuration,
                parameters,
                operations: dbOperations,
            } = configDetails;
            setConfigName(configuration.name);
            setConfigDescription(configuration.description || "");

            const { baseUrl, params } = parseUrlParameters(
                configuration.apiUrl,
            );
            setApiUrl(baseUrl);
            setParamValues(params);

            const convertedOperations = dbOperations.map((op) => ({
                id: op.id,
                type: op.type,
                conditionType: op.conditionType,
                field: op.field || "",
                operator: op.operator || "===",
                value: op.value || "",
                customCode: op.customCode || "",
                mapFields: op.mapFields || [
                    { from: "", to: "", value: "", type: "copy" as const },
                ],
                executionOrder: op.executionOrder,
            }));

            setOperations(convertedOperations);
        }
    }, [configDetails, isValidConfigId]);

    useEffect(() => {
        if (isNewConfig) {
            setConfigName("");
            setConfigDescription("");
            setApiUrl("");
            setOperations([]);
            setJsonData([]);
            setResult([]);
            setShowResults(false);
            setParamValues({});
            setError("");
        }
    }, [isNewConfig]);

    const handleApiUrlChange = (newUrl: string) => {
        const { baseUrl, params } = parseUrlParameters(newUrl);
        setApiUrl(baseUrl);

        setParamValues((prevParams) => ({
            ...prevParams,
            ...params,
        }));
    };

    const availableFields: Field[] = useMemo(() => {
        if (jsonData.length === 0) return [];
        const firstItem = jsonData[0];
        const fields: Field[] = [];

        const extractFields = (obj: any, prefix = "") => {
            Object.keys(obj).forEach((key) => {
                const fullPath = prefix ? `${prefix}.${key}` : key;
                const value = obj[key];

                fields.push({
                    value: fullPath,
                    label: fullPath,
                    type: typeof value,
                });

                if (
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
                ) {
                    extractFields(value, fullPath);
                }
            });
        };

        extractFields(firstItem);
        return fields;
    }, [jsonData]);

    const buildApiUrl = () => {
        if (!apiUrl.trim()) return "";

        const url = new URL(apiUrl);
        Object.entries(paramValues).forEach(([key, value]) => {
            if (value && value.trim()) {
                url.searchParams.set(key, value.trim());
            }
        });

        return url.toString();
    };

    const updateParamValue = (paramName: string, value: string) => {
        setParamValues((prev) => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const clearParam = (paramName: string) => {
        setParamValues((prev) => {
            const updated = { ...prev };
            delete updated[paramName];
            return updated;
        });
    };

    const clearAllParams = () => {
        setParamValues({});
    };

    const fetchApiData = async () => {
        const finalUrl = buildApiUrl();
        if (!finalUrl) {
            setError("Please enter a valid API URL");
            return;
        }

        setIsLoading(true);
        setError("");
        const startTime = Date.now();

        try {
            const response = await fetch(finalUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;

            let processedData = data;

            if (!Array.isArray(data)) {
                if (data.data && Array.isArray(data.data)) {
                    processedData = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    processedData = data.results;
                } else if (data.items && Array.isArray(data.items)) {
                    processedData = data.items;
                } else {
                    processedData = [data];
                }
            }

            setJsonData(processedData);
            setShowPreview(true);
            setError("");

            if (isValidConfigId) {
                saveResultMutation.mutate({
                    configId: currentConfigId,
                    parameterValues: paramValues,
                    rawData: data,
                    processedData: processedData,
                    responseStatus: response.status,
                    responseTime: responseTime,
                });
            }
        } catch (err: any) {
            setError(`Failed to fetch data: ${err.message}`);
            setJsonData([]);

            if (isValidConfigId) {
                saveResultMutation.mutate({
                    configId: currentConfigId,
                    parameterValues: paramValues,
                    errorMessage: err.message,
                    responseStatus: 0,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const startEditingConfig = () => {
        setTempConfigName(configName);
        setTempConfigDescription(configDescription);
        setIsEditingConfig(true);
    };

    const cancelEditingConfig = () => {
        setTempConfigName("");
        setTempConfigDescription("");
        setIsEditingConfig(false);
    };

    const confirmEditingConfig = () => {
        setConfigName(tempConfigName);
        setConfigDescription(tempConfigDescription);
        setIsEditingConfig(false);
        setTempConfigName("");
        setTempConfigDescription("");
    };

    const saveConfiguration = async () => {
        if (!configName.trim() || !apiUrl.trim()) {
            setError("Configuration name and API URL are required");
            return;
        }

        try {
            const fullApiUrl = buildApiUrl();

            const configData = {
                name: configName.trim(),
                description: configDescription.trim(),
                apiUrl: fullApiUrl,
                result: result,
                operations: operations.map((op, index) => ({
                    type: op.type,
                    conditionType: op.conditionType,
                    field: op.field,
                    operator: op.operator,
                    value: op.value,
                    customCode: op.customCode,
                    mapFields: op.mapFields,
                    executionOrder: index,
                })),
            };

            if (isNewConfig) {
                const result =
                    await createConfigMutation.mutateAsync(configData);
                const newConfigId = result.data.configuration.id;
                navigate(`/api-layer/${newConfigId}`, { replace: true });
            } else if (isValidConfigId) {
                await updateConfigMutation.mutateAsync({
                    id: currentConfigId,
                    data: configData,
                });
            }

            setError("");
        } catch (err: any) {
            setError(`Failed to save configuration: ${err.message}`);
        }
    };

    const addOperation = async () => {
        const newOp: Operation = {
            id: Date.now(),
            type: "filter",
            conditionType: "simple",
            field: "",
            operator: "===",
            value: "",
            customCode: "",
            mapFields: [{ from: "", to: "", value: "", type: "copy" }],
            executionOrder: operations.length,
        };

        if (isValidConfigId) {
            try {
                const result = await createOperationMutation.mutateAsync({
                    configId: currentConfigId,
                    data: {
                        type: newOp.type,
                        conditionType: newOp.conditionType,
                        field: newOp.field,
                        operator: newOp.operator,
                        value: newOp.value,
                        customCode: newOp.customCode,
                        mapFields: newOp.mapFields,
                        executionOrder: newOp.executionOrder || 0,
                    },
                });
                newOp.id = result.data.id;
            } catch (err) {
                console.error("Failed to save operation:", err);
            }
        }

        setOperations([...operations, newOp]);
    };

    const updateOperation = async (id: number, updates: Partial<Operation>) => {
        const updatedOperations = operations.map((op) =>
            op.id === id ? { ...op, ...updates } : op,
        );
        setOperations(updatedOperations);

        if (isValidConfigId) {
            try {
                await updateOperationMutation.mutateAsync({
                    id,
                    configId: currentConfigId,
                    data: {
                        type: updates.type,
                        conditionType: updates.conditionType,
                        field: updates.field,
                        operator: updates.operator,
                        value: updates.value,
                        customCode: updates.customCode,
                        mapFields: updates.mapFields,
                        executionOrder: updates.executionOrder,
                    },
                });
            } catch (err) {
                console.error("Failed to update operation:", err);
            }
        }
    };

    const removeOperation = async (id: number) => {
        setOperations(operations.filter((op) => op.id !== id));

        if (isValidConfigId) {
            try {
                await deleteOperationMutation.mutateAsync({
                    id,
                    configId: currentConfigId,
                });
            } catch (err) {
                console.error("Failed to delete operation:", err);
            }
        }
    };

    const addMapField = (operationId: number) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = [
                ...operation.mapFields,
                { from: "", to: "", value: "", type: "copy" as const },
            ];
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const updateMapField = (
        operationId: number,
        index: number,
        updates: Partial<MapField>,
    ) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = operation.mapFields.map((field, i) =>
                i === index ? { ...field, ...updates } : field,
            );
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const removeMapField = (operationId: number, index: number) => {
        const operation = operations.find((op) => op.id === operationId);
        if (operation) {
            const newMapFields = operation.mapFields.filter(
                (_, i) => i !== index,
            );
            updateOperation(operationId, { mapFields: newMapFields });
        }
    };

    const executeOperations = () => {
        if (jsonData.length === 0) {
            alert("Please load data first");
            return;
        }

        try {
            let result = [...jsonData];

            operations.forEach((op) => {
                if (op.type === "filter") {
                    if (op.conditionType === "simple") {
                        result = result.filter((item) => {
                            const fieldValue = op.field
                                .split(".")
                                .reduce(
                                    (obj: any, key: string) => obj?.[key],
                                    item,
                                );
                            const compareValue = op.value;

                            switch (op.operator) {
                                case "===":
                                    return fieldValue === compareValue;
                                case "!==":
                                    return fieldValue !== compareValue;
                                case ">":
                                    return (
                                        Number(fieldValue) >
                                        Number(compareValue)
                                    );
                                case "<":
                                    return (
                                        Number(fieldValue) <
                                        Number(compareValue)
                                    );
                                case ">=":
                                    return (
                                        Number(fieldValue) >=
                                        Number(compareValue)
                                    );
                                case "<=":
                                    return (
                                        Number(fieldValue) <=
                                        Number(compareValue)
                                    );
                                case "includes":
                                    if (Array.isArray(fieldValue))
                                        return fieldValue.includes(
                                            compareValue,
                                        );
                                    return String(fieldValue).includes(
                                        String(compareValue),
                                    );
                                case "startsWith":
                                    return String(fieldValue).startsWith(
                                        String(compareValue),
                                    );
                                case "endsWith":
                                    return String(fieldValue).endsWith(
                                        String(compareValue),
                                    );
                                default:
                                    return false;
                            }
                        });
                    } else {
                        const filterFunction = new Function(
                            "item",
                            `return ${op.customCode || "true"}`,
                        );
                        result = result.filter(filterFunction);
                    }
                } else if (op.type === "map") {
                    if (op.conditionType === "simple") {
                        result = result.map((item) => {
                            const newItem: any = {};
                            op.mapFields.forEach((field) => {
                                if (field.type === "copy" && field.from) {
                                    const value = field.from
                                        .split(".")
                                        .reduce(
                                            (obj: any, key: string) =>
                                                obj?.[key],
                                            item,
                                        );
                                    newItem[field.to || field.from] = value;
                                } else if (field.type === "value" && field.to) {
                                    newItem[field.to] = field.value;
                                } else if (
                                    field.type === "transform" &&
                                    field.to
                                ) {
                                    const transformFunction = new Function(
                                        "item",
                                        `return ${field.value}`,
                                    );
                                    newItem[field.to] = transformFunction(item);
                                }
                            });
                            return Object.keys(newItem).length > 0
                                ? newItem
                                : item;
                        });
                    } else {
                        const mapFunction = new Function(
                            "item",
                            `return ${op.customCode || "item"}`,
                        );
                        result = result.map(mapFunction);
                    }
                }
            });

            setResult(result);
            setShowResults(true);

            if (isValidConfigId) {
                saveResultMutation.mutate({
                    configId: currentConfigId,
                    parameterValues: paramValues,
                    processedData: result,
                    rawData: jsonData,
                });
            }
        } catch (error: any) {
            alert(`Error executing operations: ${error.message}`);
        }
    };

    const activeParamsCount = Object.keys(paramValues).filter(
        (key) => paramValues[key] && paramValues[key].trim(),
    ).length;

    if (isLoadingConfig && isValidConfigId) {
        return (
            <div className="api-editor">
                <div className="loading-state">
                    <RefreshCw size={24} className="spinning" />
                    <p>Loading configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="api-editor">
            <div className="api-editor__left-panel">
                <div className="drop-section config-section">
                    <div className="config-header">
                        <div className="config-title-section">
                            <div className="config-display">
                                <div className="config-title-row">
                                    <h3 className="config-title">
                                        {isNewConfig
                                            ? "New Configuration"
                                            : configName ||
                                              "Unnamed Configuration"}
                                    </h3>
                                    <button
                                        onClick={startEditingConfig}
                                        className="btn btn--secondary btn--sm edit-config-btn"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                                {configDescription && (
                                    <p className="config-description-display">
                                        {configDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="config-actions">
                            <button
                                onClick={saveConfiguration}
                                className="btn btn--success btn--sm"
                                disabled={
                                    createConfigMutation.isPending ||
                                    updateConfigMutation.isPending
                                }
                            >
                                <Save size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                <div className="drop-section data-input-section">
                    <div className="section__controls">
                        <div className="api-input-group">
                            <input
                                type="text"
                                placeholder="Enter API URL (e.g., https://api.example.com/page/123)"
                                value={apiUrl}
                                onChange={(e) =>
                                    handleApiUrlChange(e.target.value)
                                }
                                className="input api-url-input"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="url-action-buttons-wrapper">
                            <span className="data-count">
                                {jsonData.length > 0
                                    ? `${jsonData.length} items loaded`
                                    : "No data loaded"}
                            </span>
                            <div className="url-action-buttons">
                                {availableParams.length > 0 && (
                                    <button
                                        onClick={() =>
                                            setShowParams(!showParams)
                                        }
                                        className={`btn btn--params ${showParams ? "btn--params--active" : ""}`}
                                    >
                                        <Settings size={16} />
                                        Params{" "}
                                        {activeParamsCount > 0 &&
                                            `(${activeParamsCount})`}
                                    </button>
                                )}
                                <button
                                    onClick={fetchApiData}
                                    className="btn btn--primary"
                                    disabled={isLoading || !apiUrl.trim()}
                                >
                                    {isLoading ? (
                                        <RefreshCw
                                            size={16}
                                            className="spinning"
                                        />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    Get
                                </button>
                            </div>
                        </div>

                        {showParams && availableParams.length > 0 && (
                            <ParamsPanel
                                availableParams={availableParams}
                                paramValues={paramValues}
                                updateParamValue={updateParamValue}
                                clearParam={clearParam}
                                clearAllParams={clearAllParams}
                                buildApiUrl={buildApiUrl}
                                apiUrl={apiUrl}
                            />
                        )}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {jsonData.length > 0 && (
                        <div className="preview-container">
                            <div className="preview-container__header">
                                <span className="preview-container__title">
                                    Data Preview
                                </span>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="preview-container__toggle"
                                >
                                    {showPreview ? (
                                        <EyeOff size={14} />
                                    ) : (
                                        <Eye size={14} />
                                    )}
                                    {showPreview ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showPreview && (
                                <div className="preview-container__content">
                                    <pre className="json-preview">
                                        {JSON.stringify(jsonData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {jsonData.length > 0 && (
                    <OperationsPanel
                        operations={operations}
                        availableFields={availableFields}
                        addOperation={addOperation}
                        removeOperation={removeOperation}
                        updateOperation={updateOperation}
                        addMapField={addMapField}
                        updateMapField={updateMapField}
                        removeMapField={removeMapField}
                    />
                )}

                {jsonData.length > 0 && (
                    <button
                        onClick={executeOperations}
                        className="btn btn--success btn--execute"
                    >
                        <Play size={16} />
                        Execute Operations
                    </button>
                )}
            </div>

            {isEditingConfig && (
                <div className="modal-overlay" onClick={cancelEditingConfig}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">Edit Configuration</h3>
                            <button
                                onClick={cancelEditingConfig}
                                className="modal-close-btn"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label
                                    htmlFor="config-name"
                                    className="form-label"
                                >
                                    Configuration Name *
                                </label>
                                <input
                                    id="config-name"
                                    type="text"
                                    placeholder="Enter configuration name"
                                    value={tempConfigName}
                                    onChange={(e) =>
                                        setTempConfigName(e.target.value)
                                    }
                                    className="input modal-input"
                                />
                            </div>
                            <div className="form-group">
                                <label
                                    htmlFor="config-description"
                                    className="form-label"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="config-description"
                                    placeholder="Enter description (optional)"
                                    value={tempConfigDescription}
                                    onChange={(e) =>
                                        setTempConfigDescription(e.target.value)
                                    }
                                    className="textarea modal-textarea"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={cancelEditingConfig}
                                className="btn btn--secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmEditingConfig}
                                className="btn btn--success"
                                disabled={!tempConfigName.trim()}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="api-editor__right-panel">
                {showResults ? (
                    <div className="drop-section results-section">
                        <div className="section__header">
                            <h2 className="section__title">Results</h2>
                            <div className="section__controls">
                                <span className="results-count">
                                    {result.length} items (from{" "}
                                    {jsonData.length} original)
                                </span>
                            </div>
                        </div>
                        <DataPreview
                            data={result}
                            maxDepth={10}
                            showCopyButton={true}
                        />
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__content">
                            <Play size={48} className="empty-state__icon" />
                            <p className="empty-state__title">
                                Execute operations to see results
                            </p>
                            <p className="empty-state__description">
                                Load data and configure operations on the left
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
