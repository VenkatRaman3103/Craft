import { PageItems } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./index.scss";
import { AddBtn } from "@/Components/Buttons/AddBtn";
import { BlockPrompt } from "@/Components/BlockPrompt";
import { fetchPageData, createBlock } from "./api";
import { FieldSelectionPopup } from "@/Components/FieldSelectionPopup";
import { BlockSelectionPopup } from "@/Components/BlocksSelectionPopup";
import { FieldsPromt } from "@/Components/FieldsPromt";
import { sampleFields } from "@/Data/fields";
import { sampleBlocks } from "@/Data/blocks";
import { fieldPromt } from "@/Types/fields";

export const Page = () => {
    const { page_id } = useParams();
    const queryClient = useQueryClient();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [showFieldPromt, setShowFieldPromt] = useState(false);
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    const [isFieldPopupOpen, setIsFieldPopupOpen] = useState(false);
    const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
    const [promtFields, setPromtFields] = useState<fieldPromt[]>([]);

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

    function handleFieldsCancel(promtField: fieldPromt) {
        setPromtFields((prev: fieldPromt[]) =>
            prev.filter((field) => field.id !== promtField.id),
        );

        if (promtFields.length <= 1) {
            setShowFieldPromt(false);
        }
    }

    console.log(selectedBlocks, "selectedBlocks");
    console.log(promtFields, "promtfields");
    console.log(pageData, "pageData");

    if (!pageData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="page-content-container">
            <PageIntro
                data={pageData}
                openSideBar={openSideBar}
                setOpenSideBar={setOpenSideBar}
            />
            <div className="blocks-list-container">
                <div className="blocks-list-wrapper">
                    <PageItems
                        queryClient={queryClient}
                        pageItems={pageData.page_items || []}
                        page_id={page_id}
                    />

                    {showFieldPromt && (
                        <div className="fields-prompt-container">
                            {promtFields.map((field: fieldPromt) => (
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
                <div
                    className={`sidebar-container ${openSideBar ? "open" : ""}`}
                >
                    <div className="sidebar-wrapper"></div>
                </div>
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

export const AddPageItemsBtn = ({
    openFieldPopup,
    openBlockPopup,
}: {
    openFieldPopup: () => void;
    openBlockPopup: () => void;
}) => {
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
