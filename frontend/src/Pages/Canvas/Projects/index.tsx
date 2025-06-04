import React, { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProjects } from "@/api/canvas/getAllProjects";
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

            {addProjectPopup ? (
                <AddProjectPrompt setAddProjectPopup={setAddProjectPopup} />
            ) : (
                <div
                    className="project-folder-add"
                    onClick={() => setAddProjectPopup(true)}
                >
                    <Plus />
                </div>
            )}
        </div>
    );
};

type ProjectType = {
    data: dataType;
    hadleRightClick: any;
    menuPosition: any;
    closeMenu: any;
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
            {menuPosition?.id === data.project_id && (
                <div
                    className="project-menu"
                    style={{
                        position: "absolute",
                        top: `${menuPosition.y - 5}px`,
                        left: `${menuPosition.x + 10}px`,
                    }}
                >
                    {/**/}
                </div>
            )}
        </div>
    );
};

export const AddProjectPrompt = ({ setAddProjectPopup }) => {
    const [projectName, setProjectName] = useState("");
    const [projectStatus, setProjectStatus] = useState("");

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload) => createProjects(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-canvas"] });
            setProjectName("");
            setProjectStatus("");
            setAddProjectPopup(false);
        },
    });

    const handleSubmit = () => {
        if (!projectName.trim()) return;
        createMutation.mutate({
            name: projectName.trim(),
            status: projectStatus.trim(),
        });
    };

    return (
        <div className="add-project-inline-container">
            <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="inline-input"
            />
            <input
                type="text"
                placeholder="Project Status"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="inline-input"
            />
            <div>
                <button onClick={handleSubmit} className="inline-btn">
                    Create
                </button>
                <button
                    onClick={() => setAddProjectPopup(false)}
                    className="inline-btn cancel"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
