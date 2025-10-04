export const Group = ({ data }: any) => {
    return (
        <div>
            <h1 className="heading">{data.title}</h1>
            <p className="description">{data.description}</p>
        </div>
    );
};
