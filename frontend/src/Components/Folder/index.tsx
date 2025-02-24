import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, baseUrl } from "../../config";
import "./indes.scss";
import { ThreeDotsIcon } from "@/assets/ThreeDotsIcon";
import * as React from "react";

type optionsType = "draft" | "publish" | "unpublish";

type collectionType = {
    name: string;
    status: optionsType;
    slug: string;
    collection_id?: string;
};

type folderProp = collectionType & actionsType;

type actionsType = {
    onDelete: (name: string) => void;
    handleDuplicating: (data: collectionType) => Promise<void>;
};

export const Folder: React.FC<folderProp> = ({
    name,
    status,
    slug,
    collection_id,
    onDelete,
    handleDuplicating,
}) => {
    const [data, setData] = useState<collectionType>({
        name: "",
        slug: "",
        status: "draft",
        collection_id: "",
    });
    const [copyOfData, setcopyOfData] = useState(data);

    const [isEditable, setisEditable] = useState(false);

    const [endpointValue, setEndpointValue] = useState(slug);
    const CHARACTER_LIMIT = 20;

    useEffect(() => {
        setData({
            name,
            status,
            slug,
            collection_id,
        });
    }, [name, status, slug, collection_id]);

    useEffect(() => {
        setcopyOfData(data);
    }, [isEditable, data]);

    const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toLowerCase().replace(/\s+/g, "-");

        if (newValue.length <= CHARACTER_LIMIT) {
            setEndpointValue(
                newValue.startsWith("/") ? newValue : "/" + newValue,
            );

            if (isEditable) {
                setData((prevData) => ({
                    ...prevData,
                    slug: newValue.startsWith("/") ? newValue : "/" + newValue,
                }));
            }
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isEditable) {
            setData((prevData) => ({
                ...prevData,
                name: e.target.value,
            }));
        }
    };

    function handleDelete() {
        onDelete(name);
    }

    async function handleSave() {
        if (!data.collection_id) {
            console.error("Error: collection_id is missing");
            return;
        }

        try {
            const response = await axios.put(
                `${backendUrl}/collections/${data.collection_id}`,
                {
                    name: data.name,
                    slug: data.slug,
                    status: data.status,
                },
            );

            console.log("(frontend) updated collection: ", response.data);
            setisEditable(false);
        } catch (error) {
            console.error(
                `(frontend) error in updating the collection ${data.name}:`,
                error,
            );
        }
    }

    function handleCancel() {
        setData(copyOfData);
        setisEditable(false);
    }

    console.log(collection_id, name, "collection_id");
    console.log(data, "dataCollection");

    function handleNavigation() {
        window.location.href = `${baseUrl}/collections/${data.collection_id}`;
    }

    return (
        <div className="main-container">
            <div className="folder-container">
                <div className="folder-wrapper">
                    <div className="folder-info-container">
                        <div className="name-container">
                            <div className="test-wrapper">
                                <input
                                    type="text"
                                    placeholder="Folder name"
                                    className="folder-name"
                                    readOnly={!isEditable}
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e)}
                                    style={{
                                        pointerEvents: !isEditable
                                            ? "none"
                                            : "auto",
                                        opacity: !isEditable ? 1 : 1,
                                    }}
                                />
                                <MoreOptionsMenu
                                    onDelete={handleDelete}
                                    setisEditable={setisEditable}
                                    handleDuplicating={handleDuplicating}
                                    data={data}
                                />
                            </div>
                            <input
                                type="text"
                                className="endpoint-name"
                                value={data.slug}
                                onChange={handleEndpointChange}
                                maxLength={CHARACTER_LIMIT}
                                readOnly={!isEditable}
                                placeholder="/slug"
                                style={{
                                    width: `calc(${Math.max(50, endpointValue?.length * 8)}px + 8px)`,
                                    pointerEvents: !isEditable
                                        ? "none"
                                        : "auto",
                                    opacity: !isEditable ? 1 : 1,
                                }}
                            />
                        </div>

                        <div className="utils-wrapper">
                            <StatusOption status={status} />
                            <button onClick={handleNavigation}>Open</button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditable && (
                <div className="prompt-button-container">
                    <button
                        className="save-btn action-btn"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="cancel-btn action-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

type MoreOptionsMenuProp = actionsType & {
    data: collectionType;
    setisEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

const MoreOptionsMenu: React.FC<MoreOptionsMenuProp> = ({
    onDelete,
    setisEditable,
    handleDuplicating,
    data,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (action: string) => {
        console.log(`Selected action: ${action}`);
        setIsOpen(false);
    };

    return (
        <div className="more-options-container">
            <button
                onClick={toggleMenu}
                className={`more-options-button ${isOpen ? "active" : ""}`}
            >
                <ThreeDotsIcon />
            </button>
            {isOpen && (
                <div className="more-options-menu">
                    <div className="menu-items">
                        <button
                            className="menu-item"
                            onClick={() => {
                                setisEditable(true);
                                handleOptionClick("edit");
                            }}
                        >
                            Edit Folder
                        </button>
                        <button
                            className="menu-item"
                            onClick={() => {
                                handleDuplicating(data);
                                handleOptionClick("duplicate");
                            }}
                        >
                            Duplicate
                        </button>
                        <button
                            className="menu-item delete"
                            onClick={() => {
                                onDelete(data.name);
                                handleOptionClick("delete");
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusOption = ({ status }: { status: optionsType }) => {
    console.log(status, "status");
    const [selectedStatus, setSelectedStatus] = useState<optionsType>("draft");
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setSelectedStatus(status);
    }, [status]);

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    const handleStatusClick = (status: optionsType) => {
        setSelectedStatus(status);
    };

    const getStatusLabel = (status: optionsType) => {
        switch (status) {
            case "publish":
                return "Publish";
            case "unpublish":
                return "UnPublish";
            case "draft":
                return "Draft";
        }
    };

    return (
        <div
            className="status-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={`status-wrapper ${selectedStatus}`}>
                {isExpanded ? (
                    <>
                        <div
                            className={`status-item publish ${selectedStatus === "publish" ? "active" : ""}`}
                            onClick={() => handleStatusClick("publish")}
                        >
                            Publish
                        </div>
                        <div
                            className={`status-item unpublish ${selectedStatus === "unpublish" ? "active" : ""}`}
                            onClick={() => handleStatusClick("unpublish")}
                        >
                            UnPublish
                        </div>
                        <div
                            className={`status-item draft ${selectedStatus === "draft" ? "active" : ""}`}
                            onClick={() => handleStatusClick("draft")}
                        >
                            Draft
                        </div>
                    </>
                ) : (
                    <div className={`status-item ${selectedStatus} active`}>
                        {getStatusLabel(selectedStatus)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Folder;
