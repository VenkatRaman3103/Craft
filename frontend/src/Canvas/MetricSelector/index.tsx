import { useState } from "react";

export const MetricSelection = () => {
    const [selectedMetric, setSelectedMetric] = useState<
        "px" | "%" | "vw" | "vh"
    >("px");
    const [showMetricPopup, setShowMetricPopup] = useState(false);

    return (
        <div className="metric-selection">
            {showMetricPopup && (
                <div className="metric-selection-popup">
                    <div className="metric-option">px</div>
                    <div className="metric-option">%</div>
                    <div className="metric-option">vw</div>
                </div>
            )}
            <div className="divider"></div>
            <div
                className="metric-display"
                onClick={() => setShowMetricPopup(!showMetricPopup)}
            >
                {selectedMetric}
            </div>
        </div>
    );
};
