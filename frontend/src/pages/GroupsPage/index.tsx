import { getGroups } from "@/api/getGroups";
import { useQuery } from "@tanstack/react-query";
import "./index.scss";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Group } from "@/features/Groups";
import { RenderModal } from "@/features/Modals/RenderModal";

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

    console.log(groupData, "groupData");

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
