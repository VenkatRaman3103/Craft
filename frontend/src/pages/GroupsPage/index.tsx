import { getGroups } from "@/api/getGroups";
import { Group } from "@/components/Group";
import { useQuery } from "@tanstack/react-query";

export const GroupsPage = () => {
    const { data: groupData } = useQuery({
        queryKey: ["groups"],
        queryFn: () => getGroups(),
    });

    console.log(groupData, "data---");

    if (!groupData) {
        return <div>groups loading...</div>;
    }

    return (
        <div>
            {groupData.map((group: any) => (
                <Group data={group} />
            ))}
        </div>
    );
};
