import React, { useEffect, useState } from "react";
import "./index.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReferenceBlock, getBlockItems, saveBlock } from "./api";
import { JSONField } from "@/Components/Fields/JsonField";

export const ReferenceBlocks = ({ block }: any) => {
    const { data: referenceBlockData } = useQuery({
        queryFn: () => getReferenceBlock(block.block_id),
        queryKey: ["referenceBlock", block.block_id],
    });

    const { data: blockItems } = useQuery({
        queryFn: () => getBlockItems(block.block_id),
        queryKey: ["blockItems", block.block_id],
    });

    const [selectedCollection, setSelectedCollection] = useState(
        block.collection_id,
    );
    const [secondDropdownValue, setSecondDropdownValue] = useState(
        block.reference_type,
    );
    const [searchText, setSearchText] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [pagesList, setPagesList] = useState();

    const queryClient = useQueryClient();

    const referenceBlockMutate = useMutation({
        mutationFn: (payload) => saveBlock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["referenceBlock"]);
            queryClient.invalidateQueries(["blockItems"]);
            setIsSaving(true);
            setTimeout(() => {
                setIsSaving(false);
                setEditMode(false);
            }, 1500);
        },
    });

    useEffect(() => {
        const pages = referenceBlockData?.collectionsList?.filter(
            (collection) => collection.collection_id == selectedCollection,
        );
        if (pages && pages.length > 0) {
            setPagesList(pages[0].pages);
        }
    }, [referenceBlockData, selectedCollection]);

    useEffect(() => {
        if (blockItems && blockItems.length > 0) {
            const selectedIds = blockItems.map((item) => item.item_id);
            setSelectedItems(selectedIds);
        }
    }, [blockItems]);

    const handleFirstDropdownChange = (e) => {
        setSelectedCollection(e.target.value);
    };

    const handleSecondDropdownChange = (e) => {
        setSecondDropdownValue(e.target.value);
        setSelectedItems([]);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleItemSelect = (itemId) => {
        if (secondDropdownValue === "one") {
            setSelectedItems([itemId]);
        } else if (secondDropdownValue === "many") {
            if (selectedItems.includes(itemId)) {
                setSelectedItems(selectedItems.filter((id) => id !== itemId));
            } else {
                setSelectedItems([...selectedItems, itemId]);
            }
        }
    };

    const handleGetClick = () => {
        console.log("Get button clicked", {
            firstDropdownValue: selectedCollection,
            secondDropdownValue,
            searchText,
            selectedItems,
        });
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "list" ? "json" : "list");
    };

    function handleSave() {
        const payload = {
            pagesList: selectedItems,
            reference_type: secondDropdownValue,
            block_id: block.block_id,
        };
        setIsSaving(true);
        referenceBlockMutate.mutate(payload);
    }

    function toggleEditMode() {
        setEditMode(!editMode);
    }

    const jsonData = {
        value: pagesList || [],
    };

    const fullJsonData = {
        value: {
            block_id: block.block_id,
            reference_type: secondDropdownValue,
            selectedItems: selectedItems,
            collection_id: selectedCollection,
            pagesList: pagesList || [],
        },
    };

    return (
        <div className="reference-blocks-container">
            <div className="reference-blocks-wrapper">
                <div className="dropdown-row">
                    <div className="dropdown-container">
                        <select
                            value={selectedCollection}
                            onChange={handleFirstDropdownChange}
                            className="dropdown"
                            disabled={!editMode}
                        >
                            {referenceBlockData?.collectionsList?.map(
                                (collection, ind) => (
                                    <option
                                        key={ind}
                                        value={collection.collection_id}
                                    >
                                        {collection.name}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                    <button
                        onClick={handleGetClick}
                        className="get-button"
                        disabled={!editMode}
                    >
                        Get
                    </button>
                </div>

                <div className="dropdown-container">
                    <select
                        value={secondDropdownValue}
                        onChange={handleSecondDropdownChange}
                        className="dropdown"
                        disabled={!editMode}
                    >
                        <option value="all">all</option>
                        <option value="one">one</option>
                        <option value="many">many</option>
                        <option value="conditional">conditional</option>
                    </select>
                </div>

                <div className="view-toggle-container">
                    <button
                        onClick={toggleViewMode}
                        className="view-toggle-button"
                    >
                        {viewMode === "list" ? "Show JSON" : "Show List"}
                    </button>
                </div>

                <div className="items-container">
                    {viewMode === "list" ? (
                        <ul className="items-list">
                            {pagesList?.map((item) => (
                                <li
                                    key={item.id || item.page_id}
                                    className="item"
                                >
                                    {secondDropdownValue === "one" && (
                                        <input
                                            type="radio"
                                            name="itemSelection"
                                            checked={selectedItems.includes(
                                                item.page_id,
                                            )}
                                            onChange={() =>
                                                handleItemSelect(item.page_id)
                                            }
                                            className="radio-input"
                                            disabled={!editMode}
                                        />
                                    )}
                                    {secondDropdownValue === "many" && (
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.page_id,
                                            )}
                                            onChange={() =>
                                                handleItemSelect(item.page_id)
                                            }
                                            className="checkbox-input"
                                            disabled={!editMode}
                                        />
                                    )}
                                    <span className="item-name">
                                        {item.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="json-view">
                            <JSONField data={jsonData} />
                            {/* <JSONField data={fullJsonData} /> */}
                        </div>
                    )}
                </div>

                <button
                    className={`action-button ${editMode ? "save-button" : "edit-button"}`}
                    onClick={editMode ? handleSave : toggleEditMode}
                    disabled={isSaving}
                >
                    {isSaving ? "Saved!" : editMode ? "Save" : "Edit"}
                </button>
            </div>
        </div>
    );
};
