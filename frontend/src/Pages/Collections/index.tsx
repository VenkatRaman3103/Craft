import { AddCollectionBtn } from "@/Components/AddCollectionBtn";
import { Folder } from "../../Components/Folder";
import "./index.scss";
import { useEffect, useState } from "react";
import { backendUrl } from "@/config";
import axios from "axios";
import { FolderPrompt } from "@/Components/FolderPromt";

type optionsType = "draft" | "publish" | "unpublish";

type folderProp = {
    name: string;
    slug: string;
    status: optionsType;
};

export const CollectionsPage = () => {
    const [collections, setCollections] = useState<folderProp[]>([]);
    const [newCollection, setNewCollection] = useState(false);

    const fetchCollections = async () => {
        const response = await axios.get(`${backendUrl}/collections`);
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
        } catch (error) {
            console.error(
                "Error inserting collection:",
                error.response?.data || error,
            );
        }
    };

    return (
        <div className="collection-container">
            {collections.map((item, ind) => (
                <Folder
                    key={ind}
                    name={item.name}
                    slug={item.slug}
                    status={item.status}
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
