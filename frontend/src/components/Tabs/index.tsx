import "./index.scss";

export const Tabs = ({ tab_items, activeTab, setActiveTab }) => {
    return (
        <div className="modal-tabs-container">
            <div className="modal-tabs-wrapper">
                <div className="spacer tab"></div>
                {tab_items.map((tab) => (
                    <div
                        className={`tab ${activeTab == tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    );
};
