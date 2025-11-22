import "./index.scss";

export const PublishBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button
            className="btn btn-secondary btn-lg"
            onClick={() => onClickFn()}
        >
            <div>Publish</div>
        </button>
    );
};
