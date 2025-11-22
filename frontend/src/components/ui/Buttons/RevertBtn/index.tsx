export const RevertBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button className="btn btn-secondary btn-lg" onClick={onClickFn}>
            Revert
        </button>
    );
};
