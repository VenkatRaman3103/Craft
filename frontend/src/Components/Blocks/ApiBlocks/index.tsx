import React, { useState, useEffect } from "react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JSONField } from "@/Components/Fields/JsonField";
import { getApiBlock, saveBlock } from "./api";

export const ApiBlock = ({ block }) => {
    const { data: apiBlockData } = useQuery({
        queryFn: () => getApiBlock(block.block_id),
        queryKey: ["apiBlock", block.block_id],
    });

    const [url, setUrl] = useState("");
    const [jsonResponse, setJsonResponse] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();

    const apiBlockMutate = useMutation({
        mutationFn: (payload) => saveBlock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["apiBlock"]);
            setIsSaving(true);
            setTimeout(() => {
                setIsSaving(false);
                setEditMode(false);
            }, 1500);
        },
    });

    useEffect(() => {
        if (apiBlockData) {
            setUrl(apiBlockData.url || "");
            if (apiBlockData.response) {
                try {
                    setJsonResponse(JSON.parse(apiBlockData.response));
                } catch (e) {
                    setJsonResponse({ error: "Invalid JSON response" });
                }
            }
        }
    }, [apiBlockData]);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleFetchApi = async () => {
        if (!url) return;
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            setJsonResponse(data);
        } catch (error) {
            setJsonResponse({ error: "Failed to fetch data from API" });
        } finally {
            setIsLoading(false);
        }
    };

    function handleSave() {
        const payload = {
            url: url,
            response: JSON.stringify(jsonResponse),
            block_id: block.block_id,
        };
        setIsSaving(true);
        apiBlockMutate.mutate(payload);
    }

    function toggleEditMode() {
        setEditMode(!editMode);
    }

    const jsonData = {
        value: jsonResponse || {},
    };

    return (
        <div className="api-block-container">
            <div className="api-block-wrapper">
                <div className="url-input-row">
                    <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        className="url-input"
                        placeholder="Enter API URL"
                        disabled={!editMode}
                    />
                    <button
                        onClick={handleFetchApi}
                        className="fetch-button"
                        disabled={!editMode || !url || isLoading}
                    >
                        {isLoading ? "Loading..." : "Fetch"}
                    </button>
                </div>
                <div className="json-container">
                    <div className="json-view">
                        <JSONField data={jsonData} />
                    </div>
                </div>
                <button
                    className={`action-button ${editMode ? "save-button" : "edit-button"}`}
                    onClick={editMode ? handleSave : toggleEditMode}
                    disabled={isSaving}
                >
                    {isSaving ? "Saved!" : editMode ? "Save" : "Edit"}
                </button>
            </div>
        </div>
    );
};
