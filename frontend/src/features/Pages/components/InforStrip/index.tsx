import { DualColorLabel } from "@/components/ui/common/DualColorLabel";

export const InforStrip = ({ updatedAt, createdAt }) => {
    return (
        <div className="info-container">
            <DualColorLabel title="created_at" value={updatedAt} />
            <DualColorLabel title="updated_at" value={createdAt} />
        </div>
    );
};
