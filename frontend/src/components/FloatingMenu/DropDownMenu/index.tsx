import "./index.scss";

export const DropDownMenu = ({ options, menuRef }) => {
    return (
        <div className="drop-down-menu-container" ref={menuRef}>
            {options.map((opt) => (
                <div
                    className={`drop-down-menu-option ${opt.name}`}
                    onClick={() => opt.func()}
                >
                    <div className="drop-down-menu-option-icon">{opt.icon}</div>
                    <div className="drop-down-menu-option-label">
                        {opt.label}
                    </div>
                </div>
            ))}
        </div>
    );
};
