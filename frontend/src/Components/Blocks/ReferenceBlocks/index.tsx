import React, { useState } from "react";
import "./index.scss"; // Import the SCSS file

export const ReferenceBlocks = ({ block }) => {
    console.log(block, "blockReferenceData");

    const [firstDropdownValue, setFirstDropdownValue] = useState("1");
    const [secondDropdownValue, setSecondDropdownValue] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState("list");

    const items = [
        { id: 1, name: "Item One" },
        { id: 2, name: "Item Two" },
        { id: 3, name: "Item Three" },
        { id: 4, name: "Item Four" },
        { id: 5, name: "Item Five" },
    ];

    const handleFirstDropdownChange = (e) => {
        setFirstDropdownValue(e.target.value);
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
            firstDropdownValue,
            secondDropdownValue,
            searchText,
            selectedItems,
        });
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === "list" ? "json" : "list");
    };

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
        <div className="reference-blocks-container">
            <div className="reference-blocks-wrapper">
                <div className="dropdown-row">
                    <div className="dropdown-container">
                        <select
                            value={firstDropdownValue}
                            onChange={handleFirstDropdownChange}
                            className="dropdown"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
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

                <div className="search-container">
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="something"
                        className="search-input"
                    />
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
                            {filteredItems.map((item) => (
                                <li key={item.id} className="item">
                                    {secondDropdownValue === "one" && (
                                        <input
                                            type="radio"
                                            name="itemSelection"
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                handleItemSelect(item.id)
                                            }
                                            className="radio-input"
                                        />
                                    )}
                                    {secondDropdownValue === "many" && (
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                handleItemSelect(item.id)
                                            }
                                            className="checkbox-input"
                                        />
                                    )}
                                    <span className="item-name">
                                        {item.name}
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
            </div>
        </div>
    );
};
