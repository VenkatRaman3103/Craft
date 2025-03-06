import { PageItems } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { pageType } from "@/Types/blocks";
import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./index.scss";
import { AddBtn } from "@/Components/Buttons/AddBtn";
import { BlockPrompt } from "@/Components/BlockPrompt";
import * as React from "react";
import { fetchPageData, createBlock } from "./api";
import { FieldSelectionPopup } from "@/Components/FieldSelectionPopup";
import { BlockSelectionPopup } from "@/Components/BlocksSelectionPopup";

const sampleBlocks = [
    {
        id: "block1",
        name: "Normal Block",
        type: "normal",
        description: "Add fields",
    },
    {
        id: "block2",
        name: "Array Bloc",
        type: "array",
        description:
            "Repeatable group of fields or a block that can be reordered",
    },
    {
        id: "block3",
        name: "Nested Block",
        type: "nested",
        description: "Parent block that can hold and organize other blocks",
    },
    {
        id: "block4",
        name: "Reference Block",
        type: "reference",
        description: "Link to existing content from elsewhere in the CMS",
    },
    {
        id: "block5",
        name: "Conditional Block",
        type: "conditional",
        description:
            "Content that displays based on specific conditions or rules",
    },
    {
        id: "block6",
        name: "Dynamic Block",
        type: "dynamic",
        description: "Content that updates automatically based on external API",
    },
    {
        id: "block7",
        name: "HTML Block",
        type: "html",
        description:
            "Direct HTML input for custom markup and advanced formatting",
    },
    {
        id: "block8",
        name: "Code Block",
        type: "code",
        description: "Formatted code blocks with syntax highlighting",
    },
    {
        id: "block9",
        name: "Icon Block",
        type: "icon",
        description:
            "Choose from a library of vector icons with customization options",
    },
    {
        id: "block10",
        name: "Data Block",
        type: "table",
        description: "Structured data with customizable rows and columns",
    },
    {
        id: "block11",
        name: "List Block",
        type: "list",
        description:
            "Ordered or unordered list with customizable items and formatting",
    },
    {
        id: "block12",
        name: "Link Block",
        type: "link",
        description: "Hyperlink with customizable text, target and action type",
    },
    {
        id: "block13",
        name: "Upload Block",
        type: "upload",
        description: "Upload and manage documents, images, or other file types",
    },
    {
        id: "block14",
        name: "Rich Block",
        type: "richtext",
        description:
            "Advanced Rich text editor with formatting tools and inline elements",
    },
    {
        id: "block15",
        name: "User Block",
        type: "user",
        description: "Associate content with specific users or user roles",
    },
];

const sampleFields = [
    {
        id: "field1",
        name: "Text Field",
        type: "text",
    },
    {
        id: "field2",
        name: "Number Field",
        type: "number",
    },
    {
        id: "field3",
        name: "Json Field",
        type: "json",
    },
    {
        id: "field4",
        name: "Multi Select Field",
        type: "multi-select",
    },
    {
        id: "field5",
        name: "Select Field",
        type: "select",
    },
    {
        id: "field6",
        name: "Rich Text Field",
        type: "rich-text",
    },
    {
        id: "field7",
        name: "Date Field",
        type: "date",
    },
    {
        id: "field8",
        name: "Emain Field",
        type: "email",
    },
    {
        id: "field9",
        name: "Upload Field",
        type: "upload",
    },
    {
        id: "field10",
        name: "Relation Field",
        type: "relation",
    },
];

export const Page = () => {
    const { page_id } = useParams();
    const queryClient = useQueryClient();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [blockInputs, setBlockInputs] = useState({});
    const [fields, setFields] = useState([]);

    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);

    const [selectedBlocks, setSelectedBlocks] = useState<
        { blockId: string; blockType: string }[]
    >([]);

    const { data: pageData } = useQuery({
        queryKey: ["pageData", page_id],
        queryFn: () => fetchPageData(page_id),
        enabled: !!page_id,
    });

    const handleAddSelectedFields = (selectedFieldIds: string[]) => {
        const fieldsToAdd = sampleFields
            .filter((field) => selectedFieldIds.includes(field.id))
            .map((field) => ({
                id: `${field.id}-${Date.now()}`,
                name: field.name,
                type: field.type,
            }));

        setFields([...fields, ...fieldsToAdd]);
    };

    const closeFieldPopup = () => {
        setIsFieldPopupOpen(false);
    };

    const openFieldPopup = () => {
        setIsFieldPopupOpen(true);
    };

    const closeBlockPopup = () => {
        setIsBlockPopupOpen(false);
    };

    const openBlockPopup = () => {
        setIsBlockPopupOpen(true);
    };

    const createBlockMutation = useMutation({
        mutationFn: (blockName) =>
            createBlock(page_id, {
                name: blockName,
                description: "",
                scope: "page",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pageData", page_id] });
        },
        onError: (error) => {
            console.error("Failed to create block:", error);
        },
    });

    const handleCreateBlock = (block) => {
        console.log(block, "blockIdCreate");
        const blockName = blockInputs[block.id];
        if (!blockName) return;

        createBlockMutation.mutate(blockName);

        setBlockInputs((prev) => {
            const updated = { ...prev };
            console.log(prev, updated, updated[block.id], "blockName");
            delete updated[block.id];
            return updated;
        });

        setSelectedBlocks((prev) => {
            console.log(prev, block, "prev");
            return prev.filter((item) => item.id !== block.id);
        });

        if (selectedBlocks.length <= 1) {
            setShowBlockPrompt(false);
        }
    };

    const handleInputChange = (blockId: string, value: string) => {
        setBlockInputs((prev) => ({
            ...prev,
            [blockId]: value,
        }));
    };

    function handleBlockPromptCancel(block) {
        console.log(block, "blockCancel");
        setSelectedBlocks((prev) => prev.filter((b) => b.id !== block.id));
    }

    console.log(selectedBlocks, "selectedBlocks");

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
            />
            <div className="blocks-list-container">
                <div className="blocks-list-wrapper">
                    <PageItems pageItems={pageData?.page_items || []} />
                    {showBlockPrompt && (
                        <div className="blocks-prompt-container">
                            {selectedBlocks.map((block) => {
                                return (
                                    <BlockPrompt
                                        key={block.id}
                                        blockInputs={blockInputs}
                                        block={block}
                                        handleCreateBlock={handleCreateBlock}
                                        handleInputChange={handleInputChange}
                                        handleBlockPromptCancel={
                                            handleBlockPromptCancel
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}

                    <div className="add-button-wrapper">
                        <div onClick={openFieldPopup} className="btn">
                            <AddBtn iconLable="Add Field" />
                        </div>

                        <div onClick={openBlockPopup} className="btn">
                            <AddBtn iconLable="Add Blocks" />
                        </div>
                    </div>

                    <FieldSelectionPopup
                        isOpen={isFieldPopupOpen}
                        onClose={closeFieldPopup}
                        onAddFields={handleAddSelectedFields}
                        availableFields={sampleFields}
                    />

                    <BlockSelectionPopup
                        selectedBlocks={selectedBlocks}
                        setSelectedBlocks={setSelectedBlocks}
                        isOpen={isBlockPopupOpen}
                        onClose={closeBlockPopup}
                        availableBlocks={sampleBlocks}
                        setShowBlockPrompt={setShowBlockPrompt}
                    />
                </div>
                {openSideBar && (
                    <div className="sidebar-container">
                        <div className="sidebar-wrapper"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
