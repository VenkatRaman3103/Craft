export const DualColorLabel = ({
    title,
    value,
}: {
    title: string;
    value: string;
}) => {
    return (
        <div className="label-title">
            {title}: <span>{value}</span>
        </div>
    );
};
