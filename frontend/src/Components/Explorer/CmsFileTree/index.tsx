import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCollections, getCollectionById } from "@/api/explorer";
import {
    ChevronDown,
    ChevronRight,
    Cuboid,
    Folder,
    FolderClosed,
    FolderOpen,
} from "lucide-react";
import "./index.scss";
import { darkFont } from "@/Styles/base";
import { useNavigate, useSearchParams } from "react-router";
import { useLocation } from "react-router";

export const CMSFileTree = () => {
    const { data: rootCollections } = useQuery({
        queryFn: () => getAllCollections(),
        queryKey: ["cms-filetree"],
    });

    const location = useLocation();
    const activeCollectionId =
        location.pathname.split("/")[location.pathname.split("/").length - 1];

    return (
        <div className="filetree-container">
            <div className="filetree-header-container">
                <div className="header-icon">
                    <Cuboid size={24} />
                </div>
                <div>Content</div>
            </div>
            <ul className="filetree-content">
                {rootCollections?.map((collection) => (
                    <CollectionFolder
                        key={collection.collection_id}
                        collectionId={collection.collection_id}
                        name={collection.name}
                        activeCollectionId={activeCollectionId}
                    />
                ))}
            </ul>
        </div>
    );
};

const CollectionFolder = ({
    collectionId,
    name,
    activeCollectionId,
    onInPath,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInPath, setIsInPath] = useState(false);
    const [autoOpenDone, setAutoOpenDone] = useState(false);

    const isActive = activeCollectionId === collectionId;

    const { data } = useQuery({
        queryFn: () => getCollectionById(collectionId),
        queryKey: ["cms-folder", collectionId],
        enabled: isOpen || isActive || isInPath,
    });

    const navigate = useNavigate();

    const childCollections =
        data?.filter((item) => item.reference_id === collectionId) || [];

    useEffect(() => {
        if (!autoOpenDone) {
            if (isActive) {
                setIsOpen(true);
                setAutoOpenDone(true);
            }

            if (childCollections.length > 0) {
                const hasActiveChild = childCollections.some(
                    (child) => child.collection_id === activeCollectionId,
                );

                if (hasActiveChild) {
                    setIsInPath(true);
                    setIsOpen(true);
                    setAutoOpenDone(true);
                    if (onInPath) onInPath();
                }
            }
        }
    }, [
        isActive,
        childCollections,
        activeCollectionId,
        autoOpenDone,
        onInPath,
    ]);

    const onChildInPath = () => {
        setIsInPath(true);
        if (!autoOpenDone) {
            setIsOpen(true);
            setAutoOpenDone(true);
        }
        if (onInPath) onInPath();
    };
    const pushUrl = (url) => {
        if (url) {
            navigate(`collections/${url}`);
        }
    };

    const toggleFolder = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li>
            <div className={`folder ${isActive ? "active" : ""} `}>
                <span onClick={toggleFolder}>
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
                        <Folder
                            size={16}
                            className="folder-icon"
                            fill="#444444"
                        />
                    )}
                </span>
                <span
                    className={`folder-name ${isActive ? "active" : ""}`}
                    onClick={() => pushUrl(collectionId)}
                >
                    {name}
                </span>
            </div>
            {isOpen && childCollections.length > 0 && (
                <ul>
                    {childCollections.map((childCollection) => (
                        <CollectionFolder
                            key={childCollection.collection_id}
                            collectionId={childCollection.collection_id}
                            name={childCollection.name}
                            activeCollectionId={activeCollectionId}
                            onInPath={onChildInPath}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export const Folders = ({ collectionId }) => {
    const { data } = useQuery({
        queryFn: () => getCollectionById(collectionId),
        queryKey: ["cms-folder-filetree", collectionId],
    });

    return (
        <div>
            <div>{data?.name}</div>
        </div>
    );
};
