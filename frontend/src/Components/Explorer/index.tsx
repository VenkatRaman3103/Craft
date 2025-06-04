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
    FileText,
    Image,
    Code,
    File,
} from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { CMSFileTree } from "./CmsFileTree";

type IconType = {
    Icon: React.ElementType;
    actionKey: string;
    label: string;
    url?: string;
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

    const navigate = useNavigate();

    const pushUrl = (url) => {
        if (url) {
            navigate(url);
        }
    };

    return (
        <div className={`icons-container ${isMain ? "middle" : ""}`}>
            {icons.map(({ Icon, actionKey, label, url }) => {
                const isHovered = hoveredAction === actionKey;
                const isSelected = selectedAction === actionKey;

                return (
                    <div
                        key={actionKey}
                        className={`section-wrapper ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setHoveredAction(actionKey)}
                        onMouseLeave={() => setHoveredAction(null)}
                        onClick={() => {
                            onSelect(actionKey);
                            pushUrl(url);
                        }}
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
                            {expanded && (
                                <span
                                    className={`icon-label ${isSelected || isHovered ? "selected" : ""}`}
                                >
                                    {label}
                                </span>
                            )}
                        </div>
                        {expanded && isSelected && (
                            <div className="section-content-wrapper">
                                {renderSelectedContent(actionKey)}
                            </div>
                        )}
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

const DesignFileTree = () => (
    <div className="file-tree-container">
        <h3>Design Files</h3>
        <ul className="file-tree">
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Designs
                </span>
                <ul>
                    <li className="file-tree-file">
                        <FileText size={14} strokeWidth={2} /> homepage.sketch
                    </li>
                    <li className="file-tree-file">
                        <Image size={14} strokeWidth={2} /> logo.svg
                    </li>
                    <li className="file-tree-file">
                        <FileText size={14} strokeWidth={2} /> color-palette.pdf
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Assets
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Image size={14} strokeWidth={2} /> hero-image.png
                    </li>
                    <li className="file-tree-file">
                        <Image size={14} strokeWidth={2} /> icons.svg
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Wireframes
                </span>
                <ul>
                    <li className="file-tree-file">
                        <FileText size={14} strokeWidth={2} /> mobile.sketch
                    </li>
                    <li className="file-tree-file">
                        <FileText size={14} strokeWidth={2} /> tablet.sketch
                    </li>
                    <li className="file-tree-file">
                        <FileText size={14} strokeWidth={2} /> desktop.sketch
                    </li>
                </ul>
            </li>
        </ul>
    </div>
);

const EditFileTree = () => (
    <div className="file-tree-container">
        <h3>Edit Files</h3>
        <ul className="file-tree">
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Components
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> Button.jsx
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> Card.jsx
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> Navbar.jsx
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Layouts
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> MainLayout.jsx
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> DashboardLayout.jsx
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Styles
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> global.css
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> theme.css
                    </li>
                </ul>
            </li>
        </ul>
    </div>
);

const DatabaseFileTree = () => (
    <div className="file-tree-container">
        <h3>Database Files</h3>
        <ul className="file-tree">
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Models
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> User.js
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> Product.js
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> Order.js
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Migrations
                </span>
                <ul>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> 001_initial.sql
                    </li>
                    <li className="file-tree-file">
                        <Code size={14} strokeWidth={2} /> 002_add_users.sql
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Backups
                </span>
                <ul>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} />{" "}
                        db_backup_2025-05-15.sql
                    </li>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} />{" "}
                        db_backup_2025-05-10.sql
                    </li>
                </ul>
            </li>
        </ul>
    </div>
);

const ChecklistFileTree = () => (
    <div className="file-tree-container">
        <h3>Task Files</h3>
        <ul className="file-tree">
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Project Tasks
                </span>
                <ul>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} /> sprint-1.md
                    </li>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} /> sprint-2.md
                    </li>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} /> backlog.md
                    </li>
                </ul>
            </li>
            <li className="file-tree-folder">
                <span>
                    <FolderOpen size={16} strokeWidth={2} /> Documentation
                </span>
                <ul>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} /> project-plan.pdf
                    </li>
                    <li className="file-tree-file">
                        <File size={14} strokeWidth={2} /> requirements.md
                    </li>
                </ul>
            </li>
        </ul>
    </div>
);

export const Explorer = ({ children }: { children: React.ReactNode }) => {
    const [selectedAction, setSelectedAction] = React.useState<string | null>(
        null,
    );
    const [expanded, setExpanded] = React.useState(false);
    const [galleryMode, setGalleryMode] = React.useState(false);
    const [showFileTree, setShowFileTree] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const path = location.pathname.substring(1);
        if (path) {
            const pathToActionMap = {
                canvas: "design",
                api: "edit",
                collections: "cms",
                database: "database",
                checklist: "checklist",
                settings: "settings",
                user: "user",
                gallery: "gallery",
            };

            const actionKey = pathToActionMap[path];
            if (actionKey) {
                setSelectedAction(actionKey);
                // setShowFileTree(true);
            }
        }
    }, [location.pathname]);

    const handleSelectAction = (action: string) => {
        if (action === "toggle") {
            setExpanded(!expanded);
            return;
        }

        if (selectedAction === action) {
            setShowFileTree(!showFileTree);
        } else {
            setSelectedAction(action);
            setShowFileTree(true);
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
        {
            Icon: PencilRuler,
            actionKey: "design",
            label: "Design",
            url: "/canvas/projects",
        },
        {
            Icon: DraftingCompass,
            actionKey: "edit",
            label: "Edit",
            url: "/api",
        },
        {
            Icon: Folder,
            actionKey: "cms",
            label: "CMS",
            url: "/collections",
        },

        {
            Icon: Database,
            actionKey: "database",
            label: "Database",
            url: "/database",
        },
        {
            Icon: ListChecks,
            actionKey: "checklist",
            label: "Checklists",
            url: "/checklist",
        },
    ];

    const settingsIcons = [
        {
            Icon: Settings,
            actionKey: "settings",
            label: "Settings",
            url: "/settings",
        },
        {
            Icon: UserRound,
            actionKey: "user",
            label: "User Profile",
            url: "/user",
        },
        {
            Icon: GalleryVerticalEnd,
            actionKey: "gallery",
            label: "Gallery",
            url: "/gallery",
        },
    ];

    const renderContent = (actionKey: string) => {
        switch (actionKey) {
            case "design":
                return <DesignContent />;
            case "edit":
                return <EditContent />;
            case "cms":
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

    const renderFileTree = () => {
        if (!showFileTree) return null;

        switch (selectedAction) {
            case "design":
                return <DesignFileTree />;
            case "edit":
                return <EditFileTree />;
            case "cms":
                return <CMSFileTree />;
            case "database":
                return <DatabaseFileTree />;
            case "checklist":
                return <ChecklistFileTree />;
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
                        className={`explorer-options-wrapper ${selectedAction === "cms" ? "folder" : ""}`}
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

                <div
                    className={`file-tree-section ${showFileTree ? "active" : ""}`}
                >
                    {renderFileTree()}
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
