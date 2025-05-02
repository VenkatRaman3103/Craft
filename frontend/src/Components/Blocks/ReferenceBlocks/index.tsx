import React, { useEffect, useState } from "react";
import "./index.scss";
import { useQuery } from "@tanstack/react-query";
import { getReferenceBlock } from "./api";

export const ReferenceBlocks = ({ block }: any) => {
    const { data: refenceBlockdata } = useQuery({
        queryFn: () => getReferenceBlock(block.block_id),
        queryKey: () => ["referenceBlock", block.block_id],
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

    const [pagesList, setPagesList] = useState();

    useEffect(() => {
        const pages = refenceBlockdata?.collectionsList.filter(
            (collection) => collection.collection_id == selectedCollection,
        );
        console.log(pages ? pages : "", "pagesOSmenkbb");
        setPagesList(pages[0]?.pages);
    }, [refenceBlockdata, selectedCollection]);

    const items = [
        { id: 1, name: "Item One" },
        { id: 2, name: "Item Two" },
        { id: 3, name: "Item Three" },
        { id: 4, name: "Item Four" },
        { id: 5, name: "Item Five" },
    ];

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

    // const filteredItems = items.filter((item) =>
    //     item.name.toLowerCase().includes(searchText.toLowerCase()),
    // );

    function handleSave() {
        const payload = {
            pagesList: selectedItems,
            reference_type: secondDropdownValue,
        };
    }

    console.log(pagesList, "blockReferenceData");
    console.log(selectedItems, "selectedItems");

    return (
        <div className="reference-blocks-container">
            <div className="reference-blocks-wrapper">
                <div className="dropdown-row">
                    <div className="dropdown-container">
                        <select
                            value={selectedCollection}
                            onChange={handleFirstDropdownChange}
                            className="dropdown"
                        >
                            {refenceBlockdata?.collectionsList?.map(
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
                    <button onClick={handleGetClick} className="get-button">
                        Get
                    </button>
                </div>

                <div className="dropdown-container">
                    <select
                        value={secondDropdownValue}
                        onChange={handleSecondDropdownChange}
                        className="dropdown"
                    >
                        <option value="all">all</option>
                        <option value="one">one</option>
                        <option value="many">many</option>
                        <option value="conditional">conditional</option>
                    </select>
                </div>

                {/* <div className="search-container"> */}
                {/*     <input */}
                {/*         type="text" */}
                {/*         value={searchText} */}
                {/*         onChange={handleSearchChange} */}
                {/*         placeholder="something" */}
                {/*         className="search-input" */}
                {/*     /> */}
                {/*     <button className="get-button">Save</button> */}
                {/* </div> */}

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
                                <li key={item.id} className="item">
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
                            <p>json</p>
                        </div>
                    )}
                </div>
                {secondDropdownValue != "all" && (
                    <button className="save-button">Save</button>
                )}
            </div>
        </div>
    );
};
