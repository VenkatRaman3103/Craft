import "./index.scss";

export const AddCollectionBtn = ({ setNewCollection }) => {
    return (
        <div
            className="add-collection-btn-container"
            onClick={() => setNewCollection(true)}
        >
            <div className="add-collection-btn-wrapper">
                <div className="">add collection</div>
            </div>
        </div>
    );
};
