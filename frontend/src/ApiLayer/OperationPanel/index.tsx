import { conditionTypes, operationTypes, operators } from "@/Data/apiEditor";
import { Plus, Trash2 } from "lucide-react";
import "./index.scss";

export const OperationsPanel = ({
    operations,
    availableFields,
    addOperation,
    removeOperation,
    updateOperation,
    addMapField,
    updateMapField,
    removeMapField,
}: any) => {
    return (
        <div className="drop-section operations-section">
            {operations.map((op, index) => (
                <div
                    key={op.id}
                    className={`operation-card ${index + 1 == 0 || index + 1 != operations.lenght ? "connection" : ""}`}
                >
                    <div className="operation-card__header">
                        <div className="operation-card__header-wrapper">
                            <span className="operation-badge">
                                Operation {index + 1}
                            </span>
                            <button
                                onClick={() => removeOperation(op.id)}
                                className="btn btn--danger btn--sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="filter-wrapper">
                            <select
                                value={op.type}
                                onChange={(e) =>
                                    updateOperation(op.id, {
                                        type: e.target.value,
                                    })
                                }
                                className="select select--operation-type"
                            >
                                {operationTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={op.conditionType}
                                onChange={(e) =>
                                    updateOperation(op.id, {
                                        conditionType: e.target.value,
                                    })
                                }
                                className="select select--condition-type"
                            >
                                {conditionTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {op.conditionType === "simple" ? (
                        <>
                            {op.type === "filter" && (
                                <div className="filter-controls">
                                    <select
                                        value={op.field}
                                        onChange={(e) =>
                                            updateOperation(op.id, {
                                                field: e.target.value,
                                            })
                                        }
                                        className="select"
                                    >
                                        <option value="">Select Field</option>
                                        {availableFields.map((field) => (
                                            <option
                                                key={field.value}
                                                value={field.value}
                                            >
                                                {field.label} ({field.type})
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={op.operator}
                                        onChange={(e) =>
                                            updateOperation(op.id, {
                                                operator: e.target.value,
                                            })
                                        }
                                        className="select"
                                    >
                                        {operators
                                            .filter(
                                                (o) =>
                                                    !["&&", "||"].includes(
                                                        o.value,
                                                    ),
                                            )
                                            .map((operator) => (
                                                <option
                                                    key={operator.value}
                                                    value={operator.value}
                                                >
                                                    {operator.label}
                                                </option>
                                            ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Value to compare"
                                        value={op.value}
                                        onChange={(e) =>
                                            updateOperation(op.id, {
                                                value: e.target.value,
                                            })
                                        }
                                        className="input"
                                    />
                                </div>
                            )}

                            {op.type === "map" && (
                                <div className="map-controls">
                                    <div className="map-controls__header">
                                        <span className="map-controls__label">
                                            Map Fields:
                                        </span>
                                        <button
                                            onClick={() => addMapField(op.id)}
                                            className="btn btn--accent btn--sm"
                                        >
                                            Add Field
                                        </button>
                                    </div>
                                    {op.mapFields.map((field, fieldIndex) => (
                                        <div
                                            key={fieldIndex}
                                            className="map-field"
                                        >
                                            <select
                                                value={field.type}
                                                onChange={(e) =>
                                                    updateMapField(
                                                        op.id,
                                                        fieldIndex,
                                                        {
                                                            type: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                                className="select select--map-type"
                                            >
                                                <option value="copy">
                                                    Copy Field
                                                </option>
                                                <option value="value">
                                                    Set Value
                                                </option>
                                                <option value="transform">
                                                    Transform
                                                </option>
                                            </select>

                                            {field.type === "copy" && (
                                                <>
                                                    <select
                                                        value={field.from}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    from: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="select"
                                                    >
                                                        <option value="">
                                                            Select source field
                                                        </option>
                                                        {availableFields.map(
                                                            (f) => (
                                                                <option
                                                                    key={
                                                                        f.value
                                                                    }
                                                                    value={
                                                                        f.value
                                                                    }
                                                                >
                                                                    {f.label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="To field (optional)"
                                                        value={field.to}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    to: e.target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                </>
                                            )}

                                            {field.type === "value" && (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Field name"
                                                        value={field.to}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    to: e.target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Static value"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                </>
                                            )}

                                            {field.type === "transform" && (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="Field name"
                                                        value={field.to}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    to: e.target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="item.field + 1"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            updateMapField(
                                                                op.id,
                                                                fieldIndex,
                                                                {
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                </>
                                            )}

                                            <button
                                                onClick={() =>
                                                    removeMapField(
                                                        op.id,
                                                        fieldIndex,
                                                    )
                                                }
                                                className="btn btn--danger btn--sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="custom-code">
                            <label className="custom-code__label">
                                Custom JavaScript Code:
                            </label>
                            <textarea
                                value={op.customCode}
                                onChange={(e) =>
                                    updateOperation(op.id, {
                                        customCode: e.target.value,
                                    })
                                }
                                placeholder={
                                    op.type === "filter"
                                        ? 'item.type === "text_field" && item.scope === "page"'
                                        : '{ ...item, processed: true, newField: item.value + "_modified" }'
                                }
                                className="custom-code__textarea"
                            />
                        </div>
                    )}
                </div>
            ))}

            <button onClick={addOperation} className="btn btn--secondary">
                <Plus size={16} />
                Add Operation
            </button>
        </div>
    );
};
