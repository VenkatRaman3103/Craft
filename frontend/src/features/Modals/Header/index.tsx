import "./index.scss";

export const ModalHeader = ({ label }: { label: string }) => {
    return (
        <div className="modal-header field-section">
            <div>{label}</div>
        </div>
    );
};
