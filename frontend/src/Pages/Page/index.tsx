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
import { FieldsPromt } from "@/Components/FieldsPromt";

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
        type: "text_field",
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
        type: "multi_select_field",
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
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [promtFields, setPromtFields] = useState([]);

    const { data: pageData } = useQuery({
        queryKey: ["pageData", page_id],
        queryFn: () => fetchPageData(page_id),
        enabled: !!page_id,
    });

    const handleAddSelectedFields = (selectedFieldIds) => {
        const fieldsToAdd = sampleFields
            .filter((field) => selectedFieldIds.includes(field.id))
            .map((field) => ({
                id: `${field.id}-${Date.now()}`,
                name: field.name,
                type: field.type,
            }));

        setPromtFields([...promtFields, ...fieldsToAdd]);

        if (selectedFieldIds.length > 0) {
            setShowFieldPromt(true);
        }
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

    const handleBlocksSelected = (newSelectedBlocks) => {
        setSelectedBlocks((prev) => [...prev, ...newSelectedBlocks]);

        if (newSelectedBlocks.length > 0) {
            setShowBlockPrompt(true);
        }
    };

    const handleBlockPromptCancel = (block) => {
        setSelectedBlocks((prev) =>
            prev.filter(
                (b) =>
                    (b.instanceId || b.blockId) !==
                    (block.instanceId || block.blockId),
            ),
        );

        if (selectedBlocks.length <= 1) {
            setShowBlockPrompt(false);
        }
    };

    function handleFieldsCancel(promtField) {
        setPromtFields((prev) =>
            prev.filter((field) => field.id !== promtField.id),
        );

        if (promtFields.length <= 1) {
            setShowFieldPromt(false);
        }
    }

    console.log(selectedBlocks, "selectedBlocks");
    console.log(promtFields, "fields");

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

                    {showFieldPromt && (
                        <div className="fields-prompt-container">
                            {promtFields.map((field) => (
                                <div key={field.id}>
                                    <FieldsPromt
                                        field={field}
                                        queryClient={queryClient}
                                        page_id={page_id}
                                        handleFieldsCancel={handleFieldsCancel}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {showBlockPrompt && (
                        <div className="blocks-prompt-container">
                            {selectedBlocks.map((block) => (
                                <BlocksPropmts
                                    key={block.instanceId || block.blockId}
                                    block={block}
                                    page_id={page_id}
                                    queryClient={queryClient}
                                    onCancel={() =>
                                        handleBlockPromptCancel(block)
                                    }
                                />
                            ))}
                        </div>
                    )}

                    <AddPageItemsBtn
                        openFieldPopup={openFieldPopup}
                        openBlockPopup={openBlockPopup}
                    />

                    <FieldSelectionPopup
                        isOpen={isFieldPopupOpen}
                        onClose={closeFieldPopup}
                        onAddFields={handleAddSelectedFields}
                        availableFields={sampleFields}
                    />

                    <BlockSelectionPopup
                        isOpen={isBlockPopupOpen}
                        onClose={closeBlockPopup}
                        availableBlocks={sampleBlocks}
                        onBlocksSelected={handleBlocksSelected}
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

export const BlocksPropmts = ({ block, page_id, queryClient, onCancel }) => {
    const [blockInput, setBlockInput] = useState("");

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

    const handleCreateBlock = () => {
        if (!blockInput) return;

        createBlockMutation.mutate(blockInput);
        onCancel();
    };

    const handleInputChange = (value) => {
        setBlockInput(value);
    };

    const blockDetails = sampleBlocks.find((b) => b.id === block.blockId);
    if (!blockDetails) return null;

    return (
        <BlockPrompt
            blockInputs={{ [block.instanceId || block.blockId]: blockInput }}
            blockData={block}
            block={{
                id: block.instanceId || block.blockId,
                name: blockDetails.name,
                type: block.blockType,
            }}
            handleCreateBlock={handleCreateBlock}
            handleInputChange={(_, value) => handleInputChange(value)}
            handleBlockPromptCancel={onCancel}
        />
    );
};

export const AddPageItemsBtn = ({ openFieldPopup, openBlockPopup }) => {
    return (
        <div className="add-button-wrapper">
            <div onClick={openFieldPopup} className="btn">
                <AddBtn iconLable="Add Field" />
            </div>

            <div onClick={openBlockPopup} className="btn">
                <AddBtn iconLable="Add Blocks" />
            </div>
        </div>
    );
};
