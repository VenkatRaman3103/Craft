import { AddCollectionBtn } from "@/Components/AddCollectionBtn";
import { Folder } from "../../Components/Folder";
import "./index.scss";
import { useEffect, useState } from "react";
import { backendUrl } from "@/config";
import axios from "axios";

type optionsType = "draft" | "publish" | "unpublish";

type folderProp = {
    name: string;
    slug: string;
    status: optionsType;
};

export const CollectionsPage = () => {
    const [collections, setcollections] = useState([]);

    useEffect(() => {
        async function getCollections() {
            const response = await axios.get(`${backendUrl}/collections`);

            console.log("collections", response.data);
            setcollections(response.data);
        }

        getCollections();
    }, []);

    return (
        <div className="collection-container">
            {collections.map((item: folderProp, ind) => (
                <Folder
                    key={ind}
                    name={item.name}
                    slug={item.slug}
                    status={item.status}
                />
            ))}
            <AddCollectionBtn />
        </div>
    );
};
