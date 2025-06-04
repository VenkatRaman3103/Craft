import { useState } from "react";

export const PublishFeature = ({
    elements,
    elementWidth,
    elementHeight,
    elementRadius,
    topRightRadius,
    topLeftRadius,
    bottomRightRadius,
    bottomLeftRadius,
    toggleAllSide_radius,
    elementBorderStyle,
    toggleAllSide_width,
    elementBoderWidth,
    leftWidth,
    rightWidth,
    topWidth,
    bottomWidth,
}: any) => {
    const [published, setPublished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePublish = () => {
        console.log("Publishing...", { elements });
    };

    const openPublishedSite = () => {
        console.log("Opening published site...");
    };

    if (!published) {
        return (
            <button
                className="publish-button"
                onClick={handlePublish}
                disabled={isLoading || elements.length === 0}
            >
                {isLoading ? "Publishing..." : "Publish"}
            </button>
        );
    } else {
        return (
            <div className="publish-actions">
                <button className="view-button" onClick={openPublishedSite}>
                    View
                </button>
                <button
                    className="republish-button"
                    onClick={() => setPublished(false)}
                >
                    Republish
                </button>
            </div>
        );
    }
};
