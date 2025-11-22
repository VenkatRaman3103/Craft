import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPageVersions, revertPageData } from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import "./index.scss";
import { RevertBtn } from "@/components/ui/Buttons/RevertBtn";
import { getDate } from "../../utils/getDate";
import { useRevert } from "../../service/mutation";
import { GitCommitHorizontal } from "lucide-react";

export const VersionsPanel = () => {
    const { pageData } = useSelector((state: RootState) => state.pageSlice);

    const { data: pageVersionData } = useQuery({
        queryFn: () => getPageVersions(pageData?.id),
        queryKey: ["pages-versions", pageData.id],
    });

    if (!pageVersionData) {
        return <div>Loading</div>;
    }

    console.log(pageVersionData, "pageVersionData");

    return (
        <div className="page versions-panel-container">
            <div className="versions-list-container">
                {pageVersionData?.map((version) => (
                    <VersionInfo version={version} />
                ))}
            </div>
        </div>
    );
};

export const VersionInfo = ({ version }) => {
    const reverting = useRevert(version.page_id);

    function handleRevert() {
        reverting.mutate(version.id);
    }

    return (
        <div className="version-container">
            <TimeStamp time={version.published_at} />
            <div className="version-wrapper">
                <div className="time-label">
                    {getDate(version.published_at)}
                </div>
                <div className="versin-content">
                    <div className="user-infor-version">
                        <div className="user-profile"></div>
                        <div>{version.created_by}</div>
                    </div>
                    <RevertBtn onClickFn={handleRevert} />
                </div>
            </div>
        </div>
    );
};

export const TimeStamp = ({ time }: any) => {
    return (
        <div className="circle">
            <GitCommitHorizontal size={32} strokeWidth={1.5} />
        </div>
    );
};
