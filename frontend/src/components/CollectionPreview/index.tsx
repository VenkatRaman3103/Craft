export const CollectionPreview = ({ data }: any) => {
    return (
        <div>
            <div>{data.name}</div>
            <div>{data.description}</div>
        </div>
    );
};
