import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import "./indes.scss";
import { ThreeDotsIcon } from "@/assets/ThreeDotsIcon";
import * as React from "react";

type optionsType = "draft" | "publish" | "unpublish";

type folderProp = {
    name: string;
    status: optionsType;
    slug: string;
};

export const Folder: React.FC<folderProp> = ({ name, status, slug }) => {
    const [isEditable, setisEditable] = useState(false);

    const [endpointValue, setEndpointValue] = useState(slug);
    const CHARACTER_LIMIT = 20;

    const handleEndpointChange = (e) => {
        const newValue = e.target.value.toLowerCase().replace(/\s+/g, "-");
        if (newValue.length <= CHARACTER_LIMIT) {
            setEndpointValue(
                newValue.startsWith("/") ? newValue : "/" + newValue,
            );
        } else {
            console.log(
                `Character limit exceeded. Maximum ${CHARACTER_LIMIT} characters allowed.`,
            );
        }
    };

    async function sendRepose() {
        try {
            const bodyData = {
                name: "TestHome",
                status: "publish",
                slug: "/home",
            };

            const response = await axios.post(
                `${backendUrl}/collections`,
                bodyData,
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error(
                "Error inserting collection:",
                error.response?.data || error,
            );
        }
    }

    return (
        <>
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
                                    value={name}
                                    style={{
                                        pointerEvents: !isEditable
                                            ? "none"
                                            : "auto",
                                        opacity: !isEditable ? 1 : 1,
                                    }}
                                />
                                <MoreOptionsMenu />
                            </div>
                            <input
                                type="text"
                                className="endpoint-name"
                                value={endpointValue}
                                onChange={handleEndpointChange}
                                maxLength={CHARACTER_LIMIT}
                                readOnly={!isEditable}
                                placeholder="/slug"
                                style={{
                                    width: `calc(${Math.max(50, endpointValue.length * 8)}px + 8px)`,
                                    pointerEvents: !isEditable
                                        ? "none"
                                        : "auto",
                                    opacity: !isEditable ? 1 : 1,
                                }}
                            />
                        </div>

                        <div className="utils-wrapper">
                            <StatusOption status={status} />
                        </div>
                    </div>
                </div>
            </div>

            {/* <button onClick={sendRepose}>Send</button> */}
        </>
    );
};

const MoreOptionsMenu = () => {
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
                            onClick={() => handleOptionClick("edit")}
                        >
                            Edit Folder
                        </button>
                        <button
                            className="menu-item"
                            onClick={() => handleOptionClick("duplicate")}
                        >
                            Duplicate
                        </button>
                        <button
                            className="menu-item delete"
                            onClick={() => handleOptionClick("delete")}
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
    const [selectedStatus, setSelectedStatus] = useState<optionsType | null>(
        null,
    );
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
