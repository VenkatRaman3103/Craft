import React from "react";
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
    const [menuPosition, setMenuPosition] = useState<{
        x: number;
        y: number;
        id: string;
    } | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllProjects(),
        queryKey: ["project-canvas"],
    });

    const [addProjectPopup, setAddProjectPopup] = useState(false);

    function hadleRightClick(event: React.MouseEvent, project_id: string) {
        event.preventDefault();
        console.log(event.clientX);

        setMenuPosition({ x: event.pageX, y: event.pageY, id: project_id });
    }

    const closeMenu = () => setMenuPosition(null);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading projects.</div>;

    return (
        <div className="project-list-container">
            {data.map((item: dataType) => (
                <Project
                    key={item.project_id}
                    data={item}
                    hadleRightClick={hadleRightClick}
                    menuPosition={menuPosition}
                    closeMenu={closeMenu}
                />
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

type ProjectType = {
    data: dataType;
    hadleRightClick: any;
    menuPosition: any;
};

export const Project = ({
    data,
    menuPosition,
    hadleRightClick,
    closeMenu,
}: ProjectType) => {
    return (
        <div
            className="project-folder-continaer"
            onClick={() => closeMenu(null)}
            onContextMenu={(event) => hadleRightClick(event, data.project_id)}
        >
            <div className="project-folder-header">
                <ArrowUpRight />
            </div>
            <div className="project-folder-body">
                <div className="project-folder-name">{data.name}</div>
                <div className="project-folder-status">{data.status}</div>
            </div>
            {menuPosition?.id == data.project_id && (
                <div
                    className="project-menu"
                    style={{
                        position: "absolute",
                        top: `${menuPosition.y - 5}px`,
                        left: `${menuPosition.x + 10}px`,
                    }}
                >
                    {/* {data.project_id} */}
                </div>
            )}
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
