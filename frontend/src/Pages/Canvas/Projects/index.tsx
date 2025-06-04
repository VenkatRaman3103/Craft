import { ArrowUpRight, Plus } from "lucide-react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProjects } from "@/api/canvas/getAllProjects";
import { useState } from "react";
import { createProjects } from "@/api/canvas/createProjects";

type dataType = {
    project_id: string;
    name: string;
    status: string;
};

export const Projects = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllProjects(),
        queryKey: ["project-canvas"],
    });

    const [addProjectPopup, setAddProjectPopup] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading projects.</div>;

    return (
        <div className="project-list-container">
            {data.map((item: dataType) => (
                <Project key={item.project_id} data={item} />
            ))}
            {addProjectPopup && (
                <>
                    <div
                        className="popup-backdrop"
                        onClick={() => setAddProjectPopup(false)}
                    />
                    <AddProjectPopup setAddProjectPopup={setAddProjectPopup} />
                </>
            )}
            <div
                className="project-folder-add"
                onClick={() => setAddProjectPopup(!addProjectPopup)}
            >
                <Plus />
            </div>
        </div>
    );
};

export const AddProjectPopup = ({ setAddProjectPopup }) => {
    const [projectName, setProjectName] = useState("");
    const [projectStatus, setProjectStatus] = useState("");

    function handleNameChange(even) {
        event?.preventDefault();

        setProjectName(even.target.value);
    }

    function handleStatusChange(even) {
        event?.preventDefault();

        setProjectStatus(even.target.value);
    }

    const queryClient = useQueryClient();

    const creatMuatation = useMutation({
        mutationFn: (payload) => createProjects(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-canvas"] });
        },
    });

    function handleCreateProject() {
        const payload = {
            name: projectName,
            status: projectStatus,
        };
        creatMuatation.mutate(payload);
    }

    function handleCancel() {
        setProjectName("");
        setProjectStatus("");
        setAddProjectPopup(false);
    }

    return (
        <div className="add-project-popup-container">
            <div className="project-name-container input-container">
                <label>Project Name</label>
                <input
                    type="text"
                    placeholder="Enter the project name"
                    value={projectName}
                    onChange={(event) => handleNameChange(event)}
                    className="project-name-input"
                />
            </div>

            <div className="project-status-container input-container">
                <label>Project Status</label>
                <input
                    type="text"
                    placeholder="Enter the project status"
                    value={projectStatus}
                    onChange={(event) => handleStatusChange(event)}
                    className="project-name-input"
                />
            </div>
            <div className="project-popup-action-btns-container">
                <div
                    className="project-popup-create action-btn"
                    onClick={() => handleCreateProject()}
                >
                    create
                </div>
                <div
                    className="project-popup-cancel action-btn"
                    onClick={() => handleCancel()}
                >
                    cancel
                </div>
            </div>
        </div>
    );
};

type ProjectType = {
    data: dataType;
};

export const Project = ({ data }: ProjectType) => {
    return (
        <div className="project-folder-continaer">
            <div className="project-folder-header">
                <ArrowUpRight />
            </div>
            <div className="project-folder-body">
                <div className="project-folder-name">{data.name}</div>
                <div className="project-folder-status">{data.status}</div>
            </div>
        </div>
    );
};
