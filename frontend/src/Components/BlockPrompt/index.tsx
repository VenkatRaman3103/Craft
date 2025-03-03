export const BlockPrompt = ({ newBlockTitle, handleInputChange }) => {
    return (
        <div className="block-container">
            <div className="block-wrapper">
                <div className={`block-header-container`}>
                    <div className="block-header-wrapper">
                        <input
                            className="block-type"
                            value={newBlockTitle}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <div className="ellipsis-container"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// BlockPrompt
