import { getGroups } from "@/api/getGroups";
import { Group } from "@/components/Group";
import { useQuery } from "@tanstack/react-query";
import "./index.scss";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { RenderModal } from "@/components/Modals/RenderModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const GroupsPage = () => {
    const { data: groupData } = useQuery({
        queryKey: ["groups"],
        queryFn: () => getGroups(),
    });

    const { active: isModalActive, type: modalType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    if (!groupData) {
        return <div>groups loading...</div>;
    }

    return (
        <>
            <TopBar />
            <SideBar />
            <div className="page">
                {groupData.map((group: any) => (
                    <Group data={group} />
                ))}
            </div>
            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
