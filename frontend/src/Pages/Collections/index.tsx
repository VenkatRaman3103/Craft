import { AddCollectionBtn } from "@/Components/AddCollectionBtn";
import { Folder } from "../../Components/Folder";
import "./index.scss";

export const Collection = () => {
    return (
        <div className="collection-container">
            <Folder />
            <AddCollectionBtn />
        </div>
    );
};
