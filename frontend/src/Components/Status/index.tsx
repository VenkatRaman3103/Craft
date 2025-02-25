import { useEffect, useState } from "react";

type optionsType = "draft" | "publish" | "unpublish";

export const StatusOption = ({ status }: { status: optionsType }) => {
    console.log(status, "status");
    const [selectedStatus, setSelectedStatus] = useState<optionsType>("draft");
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setSelectedStatus(status);
    }, [status, setSelectedStatus]);

    // const handleMouseEnter = () => {
    //     setIsExpanded(true);
    // };
    //
    // const handleMouseLeave = () => {
    //     setIsExpanded(false);
    // };

    const handleStatusClick = (status: optionsType) => {
        setSelectedStatus(status);
    };

    const getStatusLabel = (status: optionsType) => {
        switch (status) {
            case "publish":
                return "Publish";
            case "unpublish":
                return "UnPublish";
            case "draft":
                return "Draft";
        }
    };

    return (
        <div
            className="status-container"
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={`status-wrapper ${selectedStatus}`}>
                {isExpanded ? (
                    <>
                        <div
                            className={`status-item publish ${selectedStatus === "publish" ? "active" : ""}`}
                            onClick={() => handleStatusClick("publish")}
                        >
                            Publish
                        </div>
                        <div
                            className={`status-item unpublish ${selectedStatus === "unpublish" ? "active" : ""}`}
                            onClick={() => handleStatusClick("unpublish")}
                        >
                            UnPublish
                        </div>
                        <div
                            className={`status-item draft ${selectedStatus === "draft" ? "active" : ""}`}
                            onClick={() => handleStatusClick("draft")}
                        >
                            Draft
                        </div>
                    </>
                ) : (
                    <div className={`status-item ${selectedStatus} active`}>
                        {getStatusLabel(selectedStatus)}
                    </div>
                )}
            </div>
        </div>
    );
};
