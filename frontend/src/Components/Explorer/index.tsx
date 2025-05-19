import * as React from "react";
import "./index.scss";
import {
    Database,
    DraftingCompass,
    Folder,
    FolderOpen,
    ListChecks,
    PanelLeftOpen,
    PencilRuler,
    Settings,
    UserRound,
    GalleryVerticalEnd,
} from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";

type IconType = {
    Icon: React.ElementType;
    actionKey: string;
    label: string;
};

const ExplorerSection = ({
    icons,
    selectedAction,
    onSelect,
    expanded,
    renderSelectedContent,
    isMain,
}: {
    icons: IconType[];
    selectedAction: string | null;
    onSelect: (action: string) => void;
    expanded: boolean;
    isMain?: boolean;
    renderSelectedContent: (actionKey: string) => React.ReactNode;
}) => {
    const [hoveredAction, setHoveredAction] = React.useState<string | null>(
        null,
    );

    return (
        <div className={`icons-container ${isMain ? "middle" : ""}`}>
            {icons.map(({ Icon, actionKey, label }) => {
                const isHovered = hoveredAction === actionKey;
                const isSelected = selectedAction === actionKey;

                return (
                    <div
                        key={actionKey}
                        className={`section-wrapper ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setHoveredAction(actionKey)}
                        onMouseLeave={() => setHoveredAction(null)}
                        onClick={() => onSelect(actionKey)}
                    >
                        <div
                            className={`icon-item ${isSelected ? "selected" : ""}`}
                        >
                            <Icon
                                size={18}
                                strokeWidth={2}
                                color={
                                    isHovered
                                        ? darkFont
                                        : isSelected
                                          ? darkFont
                                          : lightFont
                                }
                            />
                            {/* {expanded && ( */}
                            {/*     <span */}
                            {/*         className={`icon-label ${isSelected || isHovered ? "selected" : ""}`} */}
                            {/*     > */}
                            {/*         {label} */}
                            {/*     </span> */}
                            {/* )} */}
                        </div>
                        {/* {expanded && isSelected && ( */}
                        {/*     <div className="section-content-wrapper"> */}
                        {/*         {renderSelectedContent(actionKey)} */}
                        {/*     </div> */}
                        {/* )} */}
                    </div>
                );
            })}
        </div>
    );
};

const DesignContent = () => (
    <div className="section-content">
        <h3>Design Tools</h3>
        <ul>
            <li>Wireframing</li>
            <li>UI Components</li>
            <li>Color Palette</li>
            <li>Typography</li>
            <li>Template Library</li>
        </ul>
    </div>
);

const EditContent = () => (
    <div className="section-content">
        <h3>Edit Options</h3>
        <ul>
            <li>Layout Editor</li>
            <li>Component Properties</li>
            <li>Animations</li>
            <li>Responsive Settings</li>
        </ul>
    </div>
);

const FolderContent = () => (
    <div className="section-content">
        <div>Project Files</div>
        <ul className="folder-tree">
            <li>
                <span>Project_1</span>
                <ul>
                    <li>index.html</li>
                    <li>styles.css</li>
                    <li>app.js</li>
                    <li>assets/</li>
                </ul>
            </li>
            <li>
                <span>Project_2</span>
                <ul>
                    <li>main.jsx</li>
                    <li>components/</li>
                </ul>
            </li>
        </ul>
    </div>
);

const OpenFolderContent = () => (
    <div className="section-content">
        <h3>Recent Projects</h3>
        <ul>
            <li>Dashboard UI (Last opened: Yesterday)</li>
            <li>Mobile App (Last opened: 3 days ago)</li>
            <li>E-commerce Site (Last opened: 1 week ago)</li>
        </ul>
    </div>
);

const DatabaseContent = () => (
    <div className="section-content">
        <h3>Data Sources</h3>
        <table className="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Users DB</td>
                    <td>MySQL</td>
                    <td>Connected</td>
                </tr>
                <tr>
                    <td>Products API</td>
                    <td>REST</td>
                    <td>Connected</td>
                </tr>
                <tr>
                    <td>Analytics</td>
                    <td>Firebase</td>
                    <td>Disconnected</td>
                </tr>
            </tbody>
        </table>
    </div>
);

const ChecklistContent = () => (
    <div className="section-content">
        <h3>Project Tasks</h3>
        <div className="task-items">
            <div className="task-item">
                <input type="checkbox" checked readOnly />
                <span className="completed">Design homepage layout</span>
            </div>
            <div className="task-item">
                <input type="checkbox" checked readOnly />
                <span className="completed">Create component library</span>
            </div>
            <div className="task-item">
                <input type="checkbox" />
                <span>Implement responsive design</span>
            </div>
            <div className="task-item">
                <input type="checkbox" />
                <span>Add dark mode support</span>
            </div>
        </div>
    </div>
);

const SettingsContent = () => (
    <div className="section-content">
        <h3>Settings</h3>
        <p>
            Go to <a href="#settings">Settings Page</a>
        </p>
    </div>
);

const UserContent = () => (
    <div className="section-content">
        <h3>User Profile</h3>
        <p>
            Go to <a href="#profile">Profile Page</a>
        </p>
    </div>
);

const GalleryContent = () => (
    <div className="section-content">
        <h3>Component Gallery</h3>
        <div className="gallery-grid">
            <div className="gallery-item">Button</div>
            <div className="gallery-item">Card</div>
            <div className="gallery-item">Input</div>
            <div className="gallery-item">Modal</div>
            <div className="gallery-item">Navbar</div>
            <div className="gallery-item">Dropdown</div>
            <div className="gallery-item">Table</div>
            <div className="gallery-item">Form</div>
        </div>
    </div>
);

export const Explorer = ({ children }: { children: React.ReactNode }) => {
    const [selectedAction, setSelectedAction] = React.useState<string | null>(
        null,
    );
    const [expanded, setExpanded] = React.useState(false);
    const [galleryMode, setGalleryMode] = React.useState(false);

    const handleSelectAction = (action: string) => {
        if (action === "toggle") {
            setExpanded(!expanded);
            if (!expanded) {
                setSelectedAction(null);
            }
        } else if (action === "gallery") {
            setExpanded(false);
            setSelectedAction(null);
            setGalleryMode(!galleryMode);
        } else if (action === selectedAction) {
            setSelectedAction(null);
            setExpanded(false);
        } else {
            setSelectedAction(action);
            setExpanded(true);
            setGalleryMode(false);
        }
    };

    const headerIcons = [
        {
            Icon: PanelLeftOpen,
            actionKey: "toggle",
            label: "Toggle Panel",
        },
    ];

    const actionIcons = [
        { Icon: PencilRuler, actionKey: "design", label: "Design" },
        { Icon: DraftingCompass, actionKey: "edit", label: "Edit" },
        { Icon: Folder, actionKey: "folder", label: "CMS" },
        // { Icon: FolderOpen, actionKey: "open-folder", label: "Open Project" },
        { Icon: Database, actionKey: "database", label: "Database" },
        { Icon: ListChecks, actionKey: "checklist", label: "Checklists" },
    ];

    const settingsIcons = [
        { Icon: Settings, actionKey: "settings", label: "Settings" },
        { Icon: UserRound, actionKey: "user", label: "User Profile" },
        { Icon: GalleryVerticalEnd, actionKey: "gallery", label: "Gallery" },
    ];

    const renderContent = (actionKey: string) => {
        switch (actionKey) {
            case "design":
                return <DesignContent />;
            case "edit":
                return <EditContent />;
            case "folder":
                return <FolderContent />;
            case "open-folder":
                return <OpenFolderContent />;
            case "database":
                return <DatabaseContent />;
            case "checklist":
                return <ChecklistContent />;
            case "settings":
                return <SettingsContent />;
            case "user":
                return <UserContent />;
            case "gallery":
                return <GalleryContent />;
            default:
                return null;
        }
    };

    return (
        <div className="explorer-container">
            <div className="explorer-wrapper">
                <div
                    className={`explorer-options-container ${expanded ? "expanded" : ""}`}
                >
                    <div
                        className={`explorer-options-wrapper ${selectedAction === "folder" ? "folder" : ""}`}
                    >
                        <div className="explorer-header">
                            <ExplorerSection
                                icons={headerIcons}
                                selectedAction={selectedAction}
                                onSelect={handleSelectAction}
                                expanded={expanded}
                                renderSelectedContent={renderContent}
                            />
                        </div>

                        <ExplorerSection
                            icons={actionIcons}
                            selectedAction={selectedAction}
                            onSelect={handleSelectAction}
                            expanded={expanded}
                            renderSelectedContent={renderContent}
                            isMain={true}
                        />

                        <ExplorerSection
                            icons={settingsIcons}
                            selectedAction={selectedAction}
                            onSelect={handleSelectAction}
                            expanded={expanded}
                            renderSelectedContent={renderContent}
                        />
                    </div>
                </div>
                <div className="content-container">
                    <div
                        className={`content-wrapper ${galleryMode ? "gallery-mode" : ""}`}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
