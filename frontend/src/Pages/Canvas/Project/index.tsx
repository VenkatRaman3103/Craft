import { useParams } from "react-router";

export const Project = () => {
    const { project_id } = useParams();

    return (
        <div>
            <div>{project_id}</div>
        </div>
    );
};
