export const RevertBtn = ({ onClickFn }: { onClickFn: any }) => {
    return (
        <button className="btn btn-primary btn-lg" onClick={onClickFn}>
            Revert
        </button>
    );
};
