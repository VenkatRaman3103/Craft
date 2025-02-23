import { useState } from "react";
import "./index.scss";

type FolderPromptProps = {
    onSave: (collection: {
        name: string;
        slug: string;
        status: "draft" | "publish" | "unpublish";
    }) => void;
    onCancel: () => void;
};

export const FolderPrompt = ({ onSave, onCancel }: FolderPromptProps) => {
    const [folderName, setFolderName] = useState("");
    const [slug, setSlug] = useState("");
    const CHARACTER_LIMIT = 20;

    const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toLowerCase().replace(/\s+/g, "-");
        if (newValue.length <= CHARACTER_LIMIT) {
            setSlug(newValue.startsWith("/") ? newValue : "/" + newValue);
        } else {
            console.log(
                `Character limit exceeded. Maximum ${CHARACTER_LIMIT} characters allowed.`,
            );
        }
    };

    const handleSave = () => {
        onSave({
            name: folderName,
            slug: slug,
            status: "publish",
        });
    };

    return (
        <div className="prompt-prompt-container">
            <div className="prompt-folder-container">
                <div className="prompt-folder-wrapper">
                    <div className="prompt-folder-info-container">
                        <div className="prompt-name-container">
                            <div className="prompt-test-wrapper">
                                <input
                                    type="text"
                                    placeholder="Folder name"
                                    className="prompt-folder-name"
                                    value={folderName}
                                    onChange={handleFolderChange}
                                />
                            </div>
                            <input
                                type="text"
                                className="prompt-endpoint-name"
                                value={slug}
                                onChange={handleEndpointChange}
                                maxLength={CHARACTER_LIMIT}
                                placeholder="/slug"
                                style={{
                                    width: `calc(${Math.max(50, slug.length * 8)}px + 8px)`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="prompt-button-container">
                <button onClick={handleSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};
