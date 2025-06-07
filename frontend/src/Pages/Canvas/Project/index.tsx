import { StoreState } from "@/store/store";
import { getProjectById } from "@/api/canvas/getProjectById";
import { updatePages } from "@/store/canvas/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

export const Project = () => {
    const { project_id } = useParams();

    const { pages } = useSelector((state: StoreState) => state.canvasProject);

    const dispatch = useDispatch();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", project_id],
        queryFn: () => getProjectById(project_id!),
        onSuccess: (data) => {
            dispatch(updatePages(data.pages));
        },
    });

    if (!project_id) {
        return <div>Project ID not found</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading project</div>;
    }

    console.log(pages, "pages: store");
    console.log(data, "pages: api");

    return (
        <div>
            <div>{project_id}</div>
            {pages?.map((item) => <div key={item.page_id}>{item.name}</div>)}
        </div>
    );
};
