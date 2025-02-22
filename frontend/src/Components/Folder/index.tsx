import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import "./indes.scss";

const ThreeDotsIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="10" cy="5" r="1.5" fill="currentColor" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <circle cx="10" cy="15" r="1.5" fill="currentColor" />
    </svg>
);

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

export const Folder = () => {
    const [endpointValue, setEndpointValue] = useState("");
    const CHARACTER_LIMIT = 20;

    useEffect(() => {
        async function fetchUser() {
            const response = await axios.get(`${backendUrl}/users`);
            console.log(response.data);
        }
        fetchUser();
    }, []);

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

    return (
        <div className="folder-container">
            <div className="folder-wrapper">
                <div className="folder-info-container">
                    <div className="utils-wrapper">
                        <StatusOption />
                        <MoreOptionsMenu />
                    </div>
                    <div className="name-container">
                        <input
                            type="text"
                            placeholder="Folder name"
                            className="folder-name"
                        />
                        <input
                            type="text"
                            className="endpoint-name"
                            value={endpointValue}
                            onChange={handleEndpointChange}
                            maxLength={CHARACTER_LIMIT}
                            placeholder="/slug"
                            style={{
                                width: `calc(${Math.max(50, endpointValue.length * 8)}px + 8px)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

type optionsType = "draft" | "publish" | "unpublish";

const StatusOption = () => {
    const [selectedStatus, setSelectedStatus] = useState<optionsType>("draft");
    const [isExpanded, setIsExpanded] = useState(false);

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
