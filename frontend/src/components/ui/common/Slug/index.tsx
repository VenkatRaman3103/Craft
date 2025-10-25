import "./index.scss";

export const Slug = ({ slug }: { slug: string }) => {
    return (
        <div className="slug-label">
            slug: <span>{slug}</span>
        </div>
    );
};
