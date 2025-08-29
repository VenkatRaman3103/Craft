import "./index.scss";

export const SlugLabel = ({ label }: { label: string }) => {
    return (
        <p className="slug-label">
            slug: <span>{label}</span>
        </p>
    );
};
