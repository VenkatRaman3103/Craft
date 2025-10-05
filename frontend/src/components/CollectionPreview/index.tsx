import "./index.scss";

export const CollectionPreview = ({ data }: any) => {
    return (
        <div className="collection-preview-container">
            <div className="collection-preview-wrapper">
                <div>{data.name}</div>
                <div>{data.description}</div>
                <div className="new-collection-button-wrapper">
                    <div>+</div>
                </div>
            </div>
        </div>
    );
};
