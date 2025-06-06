import { FolderOpen, FileText, Image, Cuboid } from "lucide-react";
import { FolderEntry } from "../UI/FolderEntry";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/api/canvas/getAllProjects";
import { dataType } from "@/Types/canvas/projectType";

export const DesignFileTree = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllProjects(),
        queryKey: ["project-canvas"],
    });

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    console.log(data, "data: DesignFileTree");

    return (
        <div className="filetree-container">
            <div className="filetree-header-container">
                <div className="header-icon">
                    <Cuboid size={24} />
                </div>
                <div>Design</div>
            </div>
            <ul className="filetree-content">
                {data.map((item: dataType) => (
                    <FolderEntry
                        isOpen={isOpen}
                        collectionId={item.project_id}
                        name={item.name}
                        setToggleState={setIsOpen}
                        toggleState={isOpen}
                        key={item.project_id}
                        endpoint="canvas/projects"
                    />
                ))}
            </ul>
        </div>
    );
};
