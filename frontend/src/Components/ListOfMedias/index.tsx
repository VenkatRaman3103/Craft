import { Grid2x2, Rows3, Rows4 } from "lucide-react";
import "./index.scss";
import { useState } from "react";
import { backendUrl } from "@/config";

const viewTypes = ["small", "media", "large"];

export const ListOfMedias = ({ medias }) => {
    const [activeViewType, setActiveViewType] = useState(viewTypes[0]);

    const Icon = {
        small: <Rows4 size={18} />,
        media: <Rows3 size={18} />,
        large: <Grid2x2 size={18} />,
    };

    /// HANDLERS
    function getImageUrl(media) {
        let tempLength = media.path.split("/").length;
        const fileName = media.path.split("/")[tempLength - 1];
        const urlString = `${backendUrl}/uploads/${fileName}`;
        return urlString;
    }

    return (
        <div className="list-of-media-wrapper">
            <div className="list-of-media-header">
                <div className="spacer"></div>
                <div className="list-of-media-viewer-container">
                    {viewTypes.map((item, ind) => (
                        <div
                            key={ind}
                            className={`viewtype-icon ${item == activeViewType ? "active" : ""}`}
                            onClick={() => setActiveViewType(item)}
                        >
                            {Icon[item]}
                        </div>
                    ))}
                </div>
            </div>
            {medias?.map((item, ind) => (
                <div className="media-itself-container" key={ind}>
                    <img className="media-preview" src={getImageUrl(item)} />
                </div>
            ))}
        </div>
    );
};
