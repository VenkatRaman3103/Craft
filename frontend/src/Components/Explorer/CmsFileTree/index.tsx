import React, { useEffect, useState } from "react";
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
import is from "date-fns/esm/locale/is/index.js";
import { FolderEntry } from "../UI/FolderEntry";

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

    return (
        <li>
            <FolderEntry
                isOpen={isOpen}
                collectionId={collectionId}
                name={name}
                setToggleState={setIsOpen}
                toggleState={isOpen}
                endpoint="collection"
            />
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
