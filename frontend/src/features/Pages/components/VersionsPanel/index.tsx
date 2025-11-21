import { useQuery } from "@tanstack/react-query";
import { getPageVersions } from "../../service/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const VersionsPanel = () => {
    const { pageData } = useSelector((state: RootState) => state.pageSlice);

    const { data: pageVersionData } = useQuery({
        queryFn: () => getPageVersions(pageData?.id),
        queryKey: ["pages-versions"],
    });

    console.log(pageVersionData, "pageVersionData");

    return (
        <div>
            {pageVersionData?.map((version) => (
                <>
                    <div>{version.created_by}</div>
                    <div>{version.version_number}</div>
                    <div>{version.published_at}</div>
                </>
            ))}
        </div>
    );
};
