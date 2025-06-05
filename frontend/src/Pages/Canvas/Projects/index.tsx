import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProjects } from "@/api/canvas/getAllProjects";
import { createProjects } from "@/api/canvas/createProjects";
import { deleteProjects } from "@/api/canvas/deleteProjects";
import {
    updateProjectNameById,
    updateProjectStatusById,
} from "@/api/canvas/updateProjects";

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

    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllProjects(),
        queryKey: ["project-canvas"],
    });

    const [addProjectPopup, setAddProjectPopup] = useState(false);
    const [editProject, setEditProject] = useState<dataType | null>(null);

    useEffect(() => {
        function handleClickOutsideContextMenu(event: MouseEvent) {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target as Node)
            ) {
                setMenuPosition(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutsideContextMenu);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideContextMenu,
            );
        };
    }, [contextMenuRef]);

    function hadleRightClick(event: React.MouseEvent, project_id: string) {
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY, id: project_id });
    }

    const closeMenu = () => setMenuPosition(null);

    const handleEdit = (project: dataType) => {
        setEditProject(project);
        closeMenu();
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading projects.</div>;

    return (
        <div className="project-list-container">
            {data
                .filter(
                    (item: dataType) =>
                        !editProject ||
                        item.project_id !== editProject.project_id,
                )
                .map((item: dataType) => (
                    <Project
                        key={item.project_id}
                        data={item}
                        hadleRightClick={hadleRightClick}
                        menuPosition={menuPosition}
                        closeMenu={closeMenu}
                        onEdit={handleEdit}
                        contextMenuRef={contextMenuRef}
                    />
                ))}

            {addProjectPopup ? (
                <AddProjectPrompt setAddProjectPopup={setAddProjectPopup} />
            ) : editProject ? (
                <AddProjectPrompt
                    setAddProjectPopup={() => setEditProject(null)}
                    editData={editProject}
                />
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
    onEdit: (project: dataType) => void;
    contextMenuRef: HTMLDivElement | null;
};

export const Project = ({
    data,
    menuPosition,
    hadleRightClick,
    closeMenu,
    onEdit,
    contextMenuRef,
}: ProjectType) => {
    return (
        <div
            className="project-folder-continaer"
            onClick={() => closeMenu()}
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
                    style={{
                        position: "absolute",
                        top: `${menuPosition.y - 5}px`,
                        left: `${menuPosition.x + 10}px`,
                    }}
                >
                    <ContextMenu
                        data={data}
                        closeMenu={closeMenu}
                        onEdit={onEdit}
                        contextMenuRef={contextMenuRef}
                    />
                </div>
            )}
        </div>
    );
};

type ContextMenuProps = {
    data: dataType;
    closeMenu: () => void;
    onEdit: (project: dataType) => void;
    contextMenuRef: HTMLDivElement | null;
};

export const ContextMenu = ({
    data,
    closeMenu,
    onEdit,
    contextMenuRef,
}: ContextMenuProps) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProjects(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["project-canvas"],
            });
            closeMenu();
        },
    });

    function handleDeleteProject(id: string) {
        deleteMutation.mutate(id);
    }

    function handleEditProject() {
        onEdit(data);
    }

    return (
        <div className="context-menu-container" ref={contextMenuRef}>
            <div className="context-menu-option" onClick={handleEditProject}>
                edit
            </div>
            <div
                className="context-menu-option"
                onClick={() => handleDeleteProject(data.project_id)}
            >
                delete
            </div>
        </div>
    );
};

type AddProjectPromptProps = {
    setAddProjectPopup: (value: boolean) => void;
    editData?: dataType | null;
};

export const AddProjectPrompt = ({
    setAddProjectPopup,
    editData = null,
}: AddProjectPromptProps) => {
    const [projectName, setProjectName] = useState(editData?.name || "");
    const [projectStatus, setProjectStatus] = useState(editData?.status || "");

    const queryClient = useQueryClient();
    const isEditMode = !!editData;

    const createMutation = useMutation({
        mutationFn: (payload: { name: string; status: string }) =>
            createProjects(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-canvas"] });
            setProjectName("");
            setProjectStatus("");
            setAddProjectPopup(false);
        },
        onError: (error) => {
            console.error("Failed to create project:", error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (payload: {
            id: string;
            name: string;
            status: string;
        }) => {
            const promises = [];

            if (payload.name !== editData?.name) {
                promises.push(
                    updateProjectNameById(payload.id, { name: payload.name }),
                );
            }

            if (payload.status !== editData?.status) {
                promises.push(
                    updateProjectStatusById(payload.id, {
                        status: payload.status,
                    }),
                );
            }

            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-canvas"] });
            setAddProjectPopup(false);
        },
        onError: (error) => {
            console.error("Failed to update project:", error);
        },
    });

    const handleSubmit = () => {
        if (!projectName.trim()) return;

        if (isEditMode) {
            updateMutation.mutate({
                id: editData.project_id,
                name: projectName.trim(),
                status: projectStatus.trim(),
            });
        } else {
            createMutation.mutate({
                name: projectName.trim(),
                status: projectStatus.trim(),
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

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
                <button
                    onClick={handleSubmit}
                    className="inline-btn"
                    disabled={isLoading}
                >
                    {isLoading
                        ? isEditMode
                            ? "Updating..."
                            : "Creating..."
                        : isEditMode
                          ? "Update"
                          : "Create"}
                </button>
                <button
                    onClick={() => setAddProjectPopup(false)}
                    className="inline-btn cancel"
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
