import { Blocks } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { backendUrl } from "@/config";
import { pageType } from "@/Types/blocks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./index.scss";
import { AddBtn } from "@/Components/Buttons/AddBtn";
import { BlockPrompt } from "@/Components/BlockPrompt";
import * as React from "react";

export const Page = () => {
    const { page_id } = useParams();
    const [pageData, setPageData] = useState<pageType>();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [blocks, setBlocks] = useState();
    const [showBlockPrompt, setShowBlockPrompt] = useState(false);
    const [newBlockName, setNewBlockName] = useState<string>("");

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setNewBlockName(e.target.value);
    }

    useEffect(() => {
        async function getPageData() {
            const response = await axios.get(`${backendUrl}/page/${page_id}`);
            setPageData(response.data);
        }
        getPageData();
    }, [page_id]);

    useEffect(() => {
        if (pageData) {
            setBlocks(pageData.blocks);
        }
    }, [pageData]);

    async function createNewBlock() {
        if (!newBlockName) {
            console.error("Block name is required");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/block/reference/${page_id}`,
                {
                    name: newBlockName,
                    description: "",
                    scope: "page",
                },
            );
            console.log(response.data, "Created");

            // bookmark: Update the blocks list
            const updatedBlocks = pageData?.blocks
                ? [...pageData.blocks, response.data]
                : [response.data];
            setBlocks(updatedBlocks);

            setShowBlockPrompt(false);
            setNewBlockName("");
        } catch (error) {
            const errorMessage = {
                error,
                message: `Failed to create block: ${page_id}`,
            };
            console.log(errorMessage);
        }
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
                    {blocks && <Blocks blocks={blocks} />}
                    {showBlockPrompt && (
                        <div>
                            <BlockPrompt
                                handleInputChange={handleInputChange}
                                newBlockTitle={newBlockName}
                            />
                            <button onClick={createNewBlock}>
                                Create Block
                            </button>
                        </div>
                    )}
                    <div
                        className="add-blocks-btn-wrapper"
                        onClick={() => {
                            setShowBlockPrompt(true);
                        }}
                    >
                        <AddBtn iconLable="Add Block" />
                    </div>
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
