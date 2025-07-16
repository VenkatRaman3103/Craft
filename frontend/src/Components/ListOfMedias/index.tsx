import { Grid2x2, Rows3, Rows4 } from "lucide-react";
import "./index.scss";
import { useState } from "react";

const viewTypes = ["small", "media", "large"];

export const ListOfMedias = ({ medias }) => {
    const [activeViewType, setActiveViewType] = useState(viewTypes[0]);

    const Icon = {
        small: <Rows4 size={18} />,
        media: <Rows3 size={18} />,
        large: <Grid2x2 size={18} />,
    };

    return (
        <div className="list-of-media-wrapper">
            <div className="list-of-media-header">
                <div className="spacer"></div>
                <div className="list-of-media-viewer-container">
                    {viewTypes.map((item, ind) => (
                        <div
                            key={ind}
                            className={`viewtype-icon ${item == activeViewType ? "active" : ""}`}
                        >
                            {Icon[item]}
                        </div>
                    ))}
                </div>
            </div>
            {Array.from({ length: 10 }).map((item, ind) => (
                <div className="media-itself-container" key={ind}>
                    {ind + 1}
                </div>
            ))}
        </div>
    );
};
