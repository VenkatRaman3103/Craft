export const ToolBarHeader = ({
    updateElementStyles,
    updateElementMutation,
    selectedId,
    createElementMutation,
    deleteSelected,
    deleteElementMutation,
}) => {
    return (
        <div className="toolbar-header toolbar-section">
            <button
                className="save-changes-button header-button"
                onClick={updateElementStyles}
                disabled={
                    updateElementMutation.isPending || selectedId === null
                }
                style={{
                    backgroundColor:
                        !updateElementMutation.isPending && selectedId !== null
                            ? "#28a745"
                            : "#ccc",
                }}
            >
                {updateElementMutation.isPending ? "Saving..." : "Save Changes"}
            </button>

            {createElementMutation.isPending && (
                <div className="creating-status">Creating element...</div>
            )}

            <button
                className="delete-button header-button"
                onClick={deleteSelected}
                disabled={
                    selectedId === null || deleteElementMutation.isPending
                }
                style={{
                    backgroundColor:
                        selectedId !== null && !deleteElementMutation.isPending
                            ? "#dc3545"
                            : "#ccc",
                    cursor:
                        selectedId !== null && !deleteElementMutation.isPending
                            ? "pointer"
                            : "not-allowed",
                }}
            >
                {deleteElementMutation.isPending ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
};
