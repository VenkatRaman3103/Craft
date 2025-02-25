import { useParams } from "react-router";

export const Pages = () => {
    const params = useParams();
    const collectionName = params["collection_id"];

    return (
        <div>
            <div>{collectionName}</div>
        </div>
    );
};
