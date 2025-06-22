import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, Edit, Trash2 } from "lucide-react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllApiConfigurations } from "@/api/apiLayer/getAllApiConfigurations";
import { createApiConfiguration } from "@/api/apiLayer/createApiConfiguration";
import { deleteApiConfiguration } from "@/api/apiLayer/deleteApiConfiguration";
import {
    updateApiConfigurationName,
    updateApiConfigurationDescription,
    updateApiConfigurationUrl,
} from "@/api/apiLayer/updateApiConfiguration";
import { ApiConfigurationType } from "@/Types/apiLayer/apiConfigurationType";
import { useNavigate } from "react-router";

export const ApiProjects = () => {
    const [menuPosition, setMenuPosition] = useState<{
        x: number;
        y: number;
        id: string;
    } | null>(null);

    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryFn: () => getAllApiConfigurations(),
        queryKey: ["api-configurations"],
    });

    const [addApiConfigPopup, setAddApiConfigPopup] = useState(false);
    const [editApiConfig, setEditApiConfig] =
        useState<ApiConfigurationType | null>(null);

    useEffect(() => {
        function handleClickOutsideContextMenu(event: MouseEvent) {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target as Node)
            ) {
                setMenuPosition(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutsideContextMenu);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideContextMenu,
            );
        };
    }, [contextMenuRef]);

    function handleRightClick(event: React.MouseEvent, configId: string) {
        event.preventDefault();
        event.stopPropagation();
        setMenuPosition({ x: event.pageX, y: event.pageY, id: configId });
    }

    const closeMenu = () => setMenuPosition(null);

    const handleEdit = (apiConfig: ApiConfigurationType) => {
        setEditApiConfig(apiConfig);
        closeMenu();
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        console.error("Query Error:", error);
        return (
            <div>
                Error loading API configurations:{" "}
                {error?.message || "Unknown error"}
            </div>
        );
    }

    const data = response?.data;

    if (!data || !Array.isArray(data)) {
        return (
            <div className="api-project-list-container">
                <div>No API configurations found or invalid data format.</div>
                <div>Data received: {JSON.stringify(response)}</div>
                {addApiConfigPopup ? (
                    <AddApiConfigPrompt
                        setAddApiConfigPopup={setAddApiConfigPopup}
                    />
                ) : editApiConfig ? (
                    <AddApiConfigPrompt
                        setAddApiConfigPopup={() => setEditApiConfig(null)}
                        editData={editApiConfig}
                    />
                ) : (
                    <div
                        className="api-project-folder-add"
                        onClick={() => setAddApiConfigPopup(true)}
                    >
                        <Plus />
                    </div>
                )}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="api-project-list-container">
                <div>No API configurations found. Create your first one!</div>
                {addApiConfigPopup ? (
                    <AddApiConfigPrompt
                        setAddApiConfigPopup={setAddApiConfigPopup}
                    />
                ) : editApiConfig ? (
                    <AddApiConfigPrompt
                        setAddApiConfigPopup={() => setEditApiConfig(null)}
                        editData={editApiConfig}
                    />
                ) : (
                    <div
                        className="api-project-folder-add"
                        onClick={() => setAddApiConfigPopup(true)}
                    >
                        <Plus />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="api-project-list-container">
            {data
                .filter(
                    (item: ApiConfigurationType) =>
                        !editApiConfig || item.id !== editApiConfig.id,
                )
                .map((item: ApiConfigurationType) => (
                    <ApiProject
                        key={item.id}
                        data={item}
                        handleRightClick={handleRightClick}
                        menuPosition={menuPosition}
                        closeMenu={closeMenu}
                        onEdit={handleEdit}
                        contextMenuRef={contextMenuRef}
                    />
                ))}

            {addApiConfigPopup ? (
                <AddApiConfigPrompt
                    setAddApiConfigPopup={setAddApiConfigPopup}
                />
            ) : editApiConfig ? (
                <AddApiConfigPrompt
                    setAddApiConfigPopup={() => setEditApiConfig(null)}
                    editData={editApiConfig}
                />
            ) : (
                <div
                    className="api-project-folder-add"
                    onClick={() => setAddApiConfigPopup(true)}
                >
                    <Plus />
                </div>
            )}
        </div>
    );
};

type ApiProjectType = {
    data: ApiConfigurationType;
    handleRightClick: any;
    menuPosition: any;
    closeMenu: any;
    onEdit: (apiConfig: ApiConfigurationType) => void;
    contextMenuRef: HTMLDivElement | null;
};

const ApiProject = ({
    data,
    menuPosition,
    handleRightClick,
    closeMenu,
    onEdit,
    contextMenuRef,
}: ApiProjectType) => {
    const navigate = useNavigate();
    const itemId = data.id || data.config_id || data.configuration_id;

    function pushUrl() {
        navigate(`${itemId}`);
    }

    return (
        <div
            className="api-project-folder-container"
            onClick={closeMenu}
            onContextMenu={(event) => handleRightClick(event, itemId)}
        >
            <div className="api-project-folder-header">
                <div className="api-status-indicator"></div>
                <button
                    className="api-project-expand-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        pushUrl();
                    }}
                >
                    <ArrowUpRight size={16} />
                </button>
            </div>

            <div className="api-project-folder-body">
                <div className="api-project-folder-name">
                    {data.name || data.configuration_name || "Unnamed"}
                </div>
                <div className="api-project-folder-description">
                    {data.description || "No description available"}
                </div>
                <div className="api-project-folder-url">
                    {data.url || data.apiUrl || "No URL"}
                </div>
            </div>

            {menuPosition?.id === itemId && (
                <div
                    style={{
                        position: "fixed",
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                        zIndex: 1000,
                    }}
                >
                    <ContextMenu
                        data={data}
                        closeMenu={closeMenu}
                        onEdit={onEdit}
                        contextMenuRef={contextMenuRef}
                    />
                </div>
            )}
        </div>
    );
};

type ContextMenuProps = {
    data: ApiConfigurationType;
    closeMenu: () => void;
    onEdit: (apiConfig: ApiConfigurationType) => void;
    contextMenuRef: HTMLDivElement | null;
};

export const ContextMenu = ({
    data,
    closeMenu,
    onEdit,
    contextMenuRef,
}: ContextMenuProps) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteApiConfiguration(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["api-configurations"],
            });
            closeMenu();
        },
    });

    function handleDeleteApiConfig(id: string) {
        if (
            confirm("Are you sure you want to delete this API configuration?")
        ) {
            deleteMutation.mutate(id);
        }
    }

    function handleEditApiConfig() {
        onEdit(data);
    }

    return (
        <div className="api-context-menu-container" ref={contextMenuRef}>
            <div
                className="api-context-menu-option"
                onClick={handleEditApiConfig}
            >
                <Edit size={14} />
                Edit
            </div>
            <div
                className="api-context-menu-option"
                onClick={() => handleDeleteApiConfig(data.id)}
            >
                <Trash2 size={14} />
                Delete
            </div>
        </div>
    );
};

type AddApiConfigPromptProps = {
    setAddApiConfigPopup: (value: boolean) => void;
    editData?: ApiConfigurationType | null;
};

export const AddApiConfigPrompt = ({
    setAddApiConfigPopup,
    editData = null,
}: AddApiConfigPromptProps) => {
    const [configName, setConfigName] = useState(editData?.name || "");
    const [configUrl, setConfigUrl] = useState(
        editData?.url || editData?.apiUrl || "",
    );
    const [configDescription, setConfigDescription] = useState(
        editData?.description || "",
    );

    const queryClient = useQueryClient();
    const isEditMode = !!editData;

    const createMutation = useMutation({
        mutationFn: (payload: {
            name: string;
            url: string;
            description: string;
        }) => createApiConfiguration(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-configurations"] });
            setConfigName("");
            setConfigUrl("");
            setConfigDescription("");
            setAddApiConfigPopup(false);
        },
        onError: (error) => {
            console.error("Failed to create API configuration:", error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (payload: {
            id: string;
            name: string;
            url: string;
            description: string;
        }) => {
            const promises = [];

            if (payload.name !== editData?.name) {
                promises.push(
                    updateApiConfigurationName(payload.id, {
                        name: payload.name,
                    }),
                );
            }

            const currentUrl = editData?.url || editData?.apiUrl;
            if (payload.url !== currentUrl) {
                promises.push(
                    updateApiConfigurationUrl(payload.id, { url: payload.url }),
                );
            }

            if (payload.description !== editData?.description) {
                promises.push(
                    updateApiConfigurationDescription(payload.id, {
                        description: payload.description,
                    }),
                );
            }

            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-configurations"] });
            setAddApiConfigPopup(false);
        },
        onError: (error) => {
            console.error("Failed to update API configuration:", error);
        },
    });

    const handleSubmit = () => {
        if (!configName.trim() || !configUrl.trim()) return;

        if (isEditMode) {
            updateMutation.mutate({
                id: editData.id,
                name: configName.trim(),
                url: configUrl.trim(),
                description: configDescription.trim(),
            });
        } else {
            createMutation.mutate({
                name: configName.trim(),
                url: configUrl.trim(),
                description: configDescription.trim(),
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
        if (e.key === "Escape") {
            setAddApiConfigPopup(false);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="api-add-project-inline-container">
            <input
                type="text"
                placeholder="Configuration Name *"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="api-inline-input"
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <input
                type="url"
                placeholder="API URL *"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                className="api-inline-input"
                onKeyDown={handleKeyDown}
            />
            <textarea
                placeholder="Description (optional)"
                value={configDescription}
                onChange={(e) => setConfigDescription(e.target.value)}
                className="api-inline-input description-input"
                onKeyDown={handleKeyDown}
            />
            <div className="api-btn-group">
                <button
                    onClick={handleSubmit}
                    className="api-inline-btn"
                    disabled={
                        isLoading || !configName.trim() || !configUrl.trim()
                    }
                >
                    {isLoading
                        ? isEditMode
                            ? "Updating..."
                            : "Creating..."
                        : isEditMode
                          ? "Update"
                          : "Create"}
                </button>
                <button
                    onClick={() => setAddApiConfigPopup(false)}
                    className="api-inline-btn cancel"
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
