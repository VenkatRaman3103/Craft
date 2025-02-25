import { AddCollectionBtn } from "@/Components/AddCollectionBtn";
import { Folder } from "../../Components/Folder";
import "./index.scss";
import { useEffect, useState } from "react";
import { backendUrl } from "@/config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FolderPrompt } from "@/Components/FolderPromt";
import { useParams } from "react-router";
import * as React from "react";

type optionsType = "draft" | "publish" | "unpublish";

type folderProp = {
    name: string;
    slug: string;
    status: optionsType;
    collection_id: string;
    reference_id?: null | string;
};

export const Collections = () => {
    const referenceId = useParams();
    const [collections, setCollections] = useState<folderProp[]>([]);
    const [newCollection, setNewCollection] = useState(false);

    const [parentCollection, setParentCollection] = useState<any>();
    const [showTypeSelect, setShowTypeSelect] = useState(false);

    const fetchCollections = async () => {
        const response = await axios.get(`${backendUrl}/collections`);
        console.log(response.data, "response");
        setCollections(response.data);
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSaveCollection = async (collection: folderProp) => {
        console.log(collection, "collectionResponse");
        try {
            await axios.post(`${backendUrl}/collections`, collection, {
                headers: { "Content-Type": "application/json" },
            });
            setCollections((prev) => [...prev, collection]);
            setNewCollection(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Error inserting collection:",
                    error.response?.data || error.message,
                );
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    async function handleDeleteCollection(collection_id: string) {
        try {
            const collectionToDelete = collections.find(
                (item) => item.collection_id === collection_id,
            );

            if (!collectionToDelete) {
                console.error("Collection not found.");
                return;
            }

            const childResponse = await axios.get(
                `${backendUrl}/collections/references/${collection_id}`,
            );

            const childCollections = childResponse.data;
            console.log("Child collections to update:", childCollections);

            const parentReferenceId = collectionToDelete.reference_id;

            for (const childCollection of childCollections) {
                await axios.patch(
                    `${backendUrl}/collections/${childCollection.collection_id}`,
                    {
                        reference_id: parentReferenceId,
                    },
                );
            }

            await axios.delete(`${backendUrl}/collections/${collection_id}`);

            setCollections((prev) => {
                const filtered = prev.filter(
                    (item) => item.collection_id !== collection_id,
                );

                return filtered.map((item) => {
                    if (item.reference_id === collection_id) {
                        return { ...item, reference_id: parentReferenceId };
                    }
                    return item;
                });
            });
        } catch (error) {
            console.error("Error in handling collection deletion:", error);
        }
    }

    type collectionType = {
        name: string;
        status: optionsType;
        slug: string;
        collection_id?: string;
    };

    async function handleDuplicating(data: collectionType) {
        const collectionId = uuidv4();

        try {
            const newCollection = {
                ...data,
                collection_id: collectionId,
                reference_id: referenceId.collection_id
                    ? referenceId.collection_id
                    : null,
                name: `${data.name} new`,
            };

            await axios.post(`${backendUrl}/collections`, newCollection, {
                headers: { "Content-Type": "application/json" },
            });

            setCollections((prev) => [...prev, newCollection]);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(
                    "Error in Duplicating the collection: ",
                    error.response?.data || error.message,
                );
            } else {
                console.error("Unknown Error");
            }
        }
    }

    useEffect(() => {
        async function getParentCollection() {
            if (referenceId.collection_id) {
                const response = await axios.get(
                    `${backendUrl}/collections/collection/${referenceId.collection_id}`,
                );
                setParentCollection(response.data[0]);
            }
        }

        getParentCollection();
    }, [referenceId]);

    useEffect(() => {
        setShowTypeSelect(
            parentCollection?.type == null ||
                parentCollection?.type == undefined
                ? true
                : false,
        );
    }, [parentCollection]);

    return (
        <div className="collection-container">
            <div className="parent-collection-container">
                <div className="parent-collection-wrapper">
                    <div className="">
                        <div>
                            {referenceId.collection_id
                                ? referenceId.collection_id
                                : "Root Folder"}
                        </div>
                    </div>
                    {showTypeSelect && (
                        <div className="select-type-wrapper">
                            <TypeSelectBtn
                                icon={"icon"}
                                heading={"Static Page"}
                                description={"description"}
                                type={"static-page"}
                            />
                            <TypeSelectBtn
                                icon={"icon"}
                                heading={"Dynamic Page"}
                                description={"description"}
                                type={"dynamic-page"}
                            />
                            <TypeSelectBtn
                                icon={"icon"}
                                heading={"Content"}
                                description={"description"}
                                type={"content"}
                            />
                            <TypeSelectBtn
                                icon={"icon"}
                                heading={"Media"}
                                description={"description"}
                                type={"media"}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="divider"></div>
            <div className="collection-wrapper">
                {collections
                    .filter((item) =>
                        referenceId.collection_id
                            ? item.reference_id === referenceId.collection_id
                            : item.reference_id === null,
                    )
                    .map((item, ind) => (
                        <Folder
                            key={ind}
                            name={item.name}
                            slug={item.slug}
                            status={item.status}
                            collection_id={item.collection_id}
                            onDelete={handleDeleteCollection}
                            handleDuplicating={handleDuplicating}
                        />
                    ))}
                {newCollection && (
                    <FolderPrompt
                        onSave={handleSaveCollection}
                        onCancel={() => setNewCollection(false)}
                        referenceId={
                            referenceId.collection_id
                                ? referenceId.collection_id
                                : null
                        }
                    />
                )}
                <AddCollectionBtn setNewCollection={setNewCollection} />
            </div>
        </div>
    );
};

type collectionType =
    | "static-page"
    | "dynamic-page"
    | "content"
    | "media"
    | null;

type TypeSelectBtnProp = {
    icon: string;
    heading: string;
    description: string;
    type: collectionType;
};

const TypeSelectBtn: React.FC<TypeSelectBtnProp> = ({
    icon,
    heading,
    description,
    type,
}) => {
    return (
        <div className="type-option-container">
            <div className="type-option-wrapper">
                <div className="icon">{icon}</div>
                <div className="heading">{heading}</div>
                <div className="description">{description}</div>
            </div>
        </div>
    );
};
