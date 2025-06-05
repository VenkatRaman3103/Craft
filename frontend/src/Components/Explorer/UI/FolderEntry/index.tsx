import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import React from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";

type FolderEntryType = {
    isOpen: boolean;
    collectionId: string;
    name: string;
    setToggleState: React.Dispatch<React.SetStateAction<boolean>>;
    toggleState: boolean;
    endpoint: string;
};

export const FolderEntry: React.FC<FolderEntryType> = ({
    isOpen,
    collectionId,
    name,
    setToggleState,
    toggleState,
    endpoint,
}) => {
    const location = useLocation();
    const activeCollectionId =
        location.pathname.split("/")[location.pathname.split("/").length - 1];

    const isActive = activeCollectionId === collectionId;

    const navigate = useNavigate();

    const pushUrl = (url: string) => {
        if (url) {
            navigate(`${endpoint}/${url}`);
        }
    };

    const toggleFolder = (
        setToggleState: React.Dispatch<React.SetStateAction<boolean>>,
        toggleState: boolean,
    ) => {
        setToggleState(!toggleState);
    };

    return (
        <div className={`folder ${isActive ? "active" : ""} `}>
            <span onClick={() => toggleFolder(setToggleState, toggleState)}>
                {isOpen ? (
                    <ChevronDown size={14} className="chev-folder-icon" />
                ) : (
                    <ChevronRight size={14} className="chev-folder-icon" />
                )}
            </span>
            <span>
                {isOpen ? (
                    <FolderOpen
                        size={16}
                        className="folder-icon"
                        fill="#444444"
                    />
                ) : (
                    <Folder size={16} className="folder-icon" fill="#444444" />
                )}
            </span>
            <span
                className={`folder-name ${isActive ? "active" : ""}`}
                onClick={() => pushUrl(collectionId)}
            >
                {name}
            </span>
        </div>
    );
};
