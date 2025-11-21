import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPageVersions, revertPageData } from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import "./index.scss";
import { RevertBtn } from "@/components/ui/Buttons/RevertBtn";
import { getDate } from "../../utils/getDate";
import { useRevert } from "../../service/mutation";

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
        <div className="page versions-list-container">
            {pageVersionData?.map((version) => (
                <VersionInfo version={version} />
            ))}
        </div>
    );
};

export const VersionInfo = ({ version }) => {
    const reverting = useRevert(version.page_id);

    function handleRevert() {
        reverting.mutate(version.id);
    }

    return (
        <div className="versin-container">
            <div className="versin-content">
                <div>{version.created_by}</div>
                <div>{getDate(version.published_at)}</div>
            </div>
            <RevertBtn onClickFn={handleRevert} />
        </div>
    );
};
