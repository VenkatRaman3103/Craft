import "./index.scss";

export const PublishBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button className="btn btn-primary btn-lg" onClick={() => onClickFn()}>
            <div>Publish</div>
        </button>
    );
};
