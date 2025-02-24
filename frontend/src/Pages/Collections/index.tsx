import { AddCollectionBtn } from "@/Components/AddCollectionBtn";
import { Folder } from "../../Components/Folder";
import "./index.scss";
import { useEffect, useState } from "react";
import { backendUrl } from "@/config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FolderPrompt } from "@/Components/FolderPromt";
import { useParams } from "react-router";

type optionsType = "draft" | "publish" | "unpublish";

type folderProp = {
    name: string;
    slug: string;
    status: optionsType;
    collection_id?: string;
    reference_id?: null | string;
};

export const CollectionsPage = () => {
    const referenceId = useParams();
    const [collections, setCollections] = useState<folderProp[]>([]);
    const [newCollection, setNewCollection] = useState(false);

    const fetchCollections = async () => {
        const response = await axios.get(`${backendUrl}/collections`);
        console.log(response.data, "response");
        setCollections(response.data);
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSaveCollection = async (collection: folderProp) => {
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

    async function handleDeleteCollection(name: string) {
        try {
            await axios.delete(`${backendUrl}/collections/${name}`);
            setCollections((prev) => prev.filter((item) => item.name != name));
        } catch (error) {
            console.log(error, "error in deleting the collection");
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

    console.log(collections, "collections");
    console.log(referenceId, "referenceId");

    return (
        <div className="collection-container">
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
                />
            )}
            <AddCollectionBtn setNewCollection={setNewCollection} />
        </div>
    );
};
