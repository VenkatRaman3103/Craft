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
};

const ExplorerSection = ({
    icons,
    selectedAction,
    onSelect,
}: {
    icons: IconType[];
    selectedAction: string | null;
    onSelect: (action: string) => void;
}) => {
    const [hoveredAction, setHoveredAction] = React.useState<string | null>(
        null,
    );

    return (
        <div className="icons-container">
            {icons.map(({ Icon, actionKey }) => {
                const isHovered = hoveredAction === actionKey;
                const isSelected = selectedAction === actionKey;

                return (
                    <Icon
                        key={actionKey}
                        size={18}
                        strokeWidth={1.75}
                        color={
                            isHovered
                                ? darkFont
                                : isSelected
                                  ? darkFont
                                  : lightFont
                        }
                        className={`icon-item ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setHoveredAction(actionKey)}
                        onMouseLeave={() => setHoveredAction(null)}
                        onClick={() => onSelect(actionKey)}
                    />
                );
            })}
        </div>
    );
};

// Test

export const Explorer = ({ children }: { children: React.ReactNode }) => {
    const [isIsometric, setIsIsometric] = React.useState(false);
    const [selectedAction, setSelectedAction] =
        React.useState<string>("gallery");

    const handleSelectAction = (action: string) => {
        setSelectedAction((prev) => (prev === action ? "gallery" : action));
    };

    console.log(selectedAction, "selectedAction");

    return (
        <div className="explorer-container">
            <div className="explorer-wrapper">
                <div className="explorer-options-container">
                    <div className="explorer-options-wrapper">
                        {/* Header Section */}
                        <div className="explorer-header">
                            <ExplorerSection
                                icons={[
                                    {
                                        Icon: PanelLeftOpen,
                                        actionKey: "toggle",
                                    },
                                ]}
                                selectedAction={selectedAction}
                                onSelect={handleSelectAction}
                            />
                        </div>

                        {/* Actions Section */}
                        <ExplorerSection
                            icons={[
                                { Icon: PencilRuler, actionKey: "design" },
                                { Icon: DraftingCompass, actionKey: "edit" },
                                { Icon: Folder, actionKey: "folder" },
                                { Icon: FolderOpen, actionKey: "open-folder" },
                                { Icon: Database, actionKey: "database" },
                                { Icon: ListChecks, actionKey: "checklist" },
                            ]}
                            selectedAction={selectedAction}
                            onSelect={handleSelectAction}
                        />

                        {/* Settings Section */}
                        <ExplorerSection
                            icons={[
                                { Icon: Settings, actionKey: "settings" },
                                { Icon: UserRound, actionKey: "user" },
                                {
                                    Icon: GalleryVerticalEnd,
                                    actionKey: "gallery",
                                },
                            ]}
                            selectedAction={selectedAction}
                            onSelect={handleSelectAction}
                        />
                    </div>
                </div>
                <div
                    className={`explorer-options-wrapper ${selectedAction === "folder" ? "folder" : ""}`}
                ></div>
                <div
                    className={`content-container ${isIsometric ? "isometric" : ""}`}
                >
                    <div className="content-wrapper">{children}</div>
                </div>
            </div>
        </div>
    );
};
