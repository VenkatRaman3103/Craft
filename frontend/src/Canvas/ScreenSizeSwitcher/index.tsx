import React, { useState, useRef, useEffect } from "react";
import "./index.scss";

import { Monitor, Settings, Smartphone, Tablet } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createNewScreen,
    deleteScreenSize,
    getScreenSizes,
    udpateScreenSizeStatus,
    updateScreenSize,
} from "@/api/screenSizes";

export const ScreenSizeSwitcher = ({ screen, setScreen }: any) => {
    const [showScreenSetting, setShowScreenSetting] = useState<boolean>(false);
    const [activeOptionId, setActiveOptionId] = useState<null | string>(null);
    const [showScreenPrompt, setShowScreenPrompt] = useState(false);
    const [selectedOption, setSelectedOption] = useState<null | string>(null);
    const [listOfScreens, setListOfScreens] = useState([]);
    const [newName, setNewName] = useState("");
    const [newWidth, setNewWidth] = useState("");
    const [newHeight, setNewHeight] = useState("");
    const [editName, setEditName] = useState("");
    const [editWidth, setEditWidth] = useState("");
    const [editHeight, setEditHeight] = useState("");

    const [activeScreenToggle, setActiveScreenToggle] = useState("");

    const screenSizeDropRef = useRef(null);

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryFn: () => getScreenSizes(),
        queryKey: ["screen-size"],
    });

    const createNewScreenMutation = useMutation({
        mutationFn: (payload) => createNewScreen(payload),
        onSuccess: () => {
            setNewWidth("");
            setNewHeight("");
            setNewName("");
            setShowScreenPrompt(false);
            setSelectedOption(null);

            queryClient.invalidateQueries(["screen-size"]);
        },
    });

    const deleteScreenMutation = useMutation({
        mutationFn: (id) => deleteScreenSize(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["screen-size"]);
        },
    });

    const updateScreenSizeMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            console.log(`Updating screen ${id} with:`, updates);
            return updateScreenSize(id, updates);
        },
        onSuccess: () => {
            console.log("Screen size update successful");
            queryClient.invalidateQueries(["screen-size"]);
        },
        onError: (error) => {
            console.error("Screen size update failed:", error);
        },
    });

    const toggleActiveScreenMutation = useMutation({
        mutationFn: ({ id, screenType, status }) =>
            udpateScreenSizeStatus(id, screenType, status),
        onSuccess: () => queryClient.invalidateQueries(["screen-size"]),
    });

    useEffect(() => {
        setListOfScreens(data);
    }, [data]);

    useEffect(() => {
        function handleClickOutSide(event) {
            if (
                screenSizeDropRef.current &&
                !screenSizeDropRef.current.contains(event.target)
            ) {
                setShowScreenSetting(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide);
        };
    }, []);

    const screenIconsSize = 14;
    console.log(data, "dataScreenSizeSwitcher");

    const handleCancel = () => {
        setSelectedOption(null);
        setEditName("");
        setEditWidth("");
        setEditHeight("");
    };

    const handleSave = (item) => {
        console.log("Save button clicked for item:", item);
        console.log("Edit states:", { editName, editWidth, editHeight });

        const updates = {};

        if (editName && editName !== item.name) {
            updates.name = editName;
        }

        if (editWidth && String(editWidth) !== String(item.width)) {
            updates.width = editWidth;
        }

        if (editHeight && String(editHeight) !== String(item.heigth)) {
            updates.heigth = editHeight;
        }

        if (Object.keys(updates).length > 0) {
            updateScreenSizeMutation.mutate({ id: item.id, updates });
        }

        setSelectedOption(null);
        setEditName("");
        setEditWidth("");
        setEditHeight("");
    };

    const handleStartEdit = (item) => {
        setSelectedOption(item.id);
        setEditName(item.name);
        setEditWidth(item.width);
        setEditHeight(item.heigth);
    };

    const handleNewName = (e) => {
        e.preventDefault();
        setNewName(e.target.value);
    };

    const handleNewWidth = (e) => {
        e.preventDefault();
        setNewWidth(e.target.value);
    };

    const handleNewHeight = (e) => {
        e.preventDefault();
        setNewHeight(e.target.value);
    };

    const handleEditName = (e) => {
        e.preventDefault();
        setEditName(e.target.value);
    };

    const handleEditWidth = (e) => {
        e.preventDefault();
        setEditWidth(e.target.value);
    };

    const handleEditHeight = (e) => {
        e.preventDefault();
        setEditHeight(e.target.value);
    };

    const handleNewScreenSize = () => {
        const payload = {
            name: newName,
            heigth: newHeight,
            width: newWidth,
            screenType: screen,
        };
        console.log(payload, "payloadNewScreen");

        createNewScreenMutation.mutate(payload);
    };

    const handleDeleteScreenSize = (id) => {
        deleteScreenMutation.mutate(id);
    };

    const handleToggleActiveScreen = (id) => {
        const temp = { id, screenType: screen, status: "active" };
        toggleActiveScreenMutation.mutate(temp);
    };

    return (
        <div className="device-size-switcher-container">
            <div className="device-size-switcher">
                <div
                    className={`mobile-screen screen-btn ${screen == "mobile" ? "active" : ""}`}
                    onClick={() => setScreen("mobile")}
                >
                    <Smartphone size={screenIconsSize} />
                </div>
                <div
                    className={`desktop-screen screen-btn ${screen == "desktop" ? "active" : ""}`}
                    onClick={() => setScreen("desktop")}
                >
                    <Monitor size={screenIconsSize} />
                </div>
                <div
                    className={`tablet-screen screen-btn ${screen == "tablet" ? "active" : ""}`}
                    onClick={() => setScreen("tablet")}
                >
                    <Tablet size={screenIconsSize} />
                </div>
            </div>
            {showScreenSetting && (
                <div
                    className="settings-drop-down-container"
                    ref={screenSizeDropRef}
                >
                    <div className="settings-drop-down-wrapper">
                        <div className="settings-heading">{screen}</div>

                        {listOfScreens
                            ?.filter((item) => item.screenType == screen)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="setting-option-container"
                                >
                                    <div className="screen-heading-wrapper">
                                        {selectedOption === item.id ? (
                                            <input
                                                className="screen-heading"
                                                value={editName}
                                                onChange={handleEditName}
                                            />
                                        ) : (
                                            <input
                                                className="screen-heading"
                                                value={item.name}
                                                readOnly
                                            />
                                        )}

                                        <div
                                            className={`select-toggle-button ${item.status}`}
                                            onClick={() =>
                                                handleToggleActiveScreen(
                                                    item.id,
                                                )
                                            }
                                        >
                                            <div className="toggle-button"></div>
                                        </div>
                                    </div>
                                    <div className="screen-size-contianer">
                                        <div className="screen-width">
                                            <label>W</label>
                                            {selectedOption === item.id ? (
                                                <input
                                                    type="number"
                                                    value={editWidth}
                                                    onChange={handleEditWidth}
                                                />
                                            ) : (
                                                <input
                                                    type="number"
                                                    value={Number(item.width)}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                        <div className="screen-height">
                                            <label>H</label>
                                            {selectedOption === item.id ? (
                                                <input
                                                    type="number"
                                                    value={editHeight}
                                                    onChange={handleEditHeight}
                                                />
                                            ) : (
                                                <input
                                                    type="number"
                                                    value={Number(item.heigth)}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {selectedOption === item.id ? (
                                        <div className="screen-size-actions">
                                            <div
                                                className="screen-size-save"
                                                onClick={() => handleSave(item)}
                                            >
                                                save
                                            </div>
                                            <div
                                                className="screen-size-cancel"
                                                onClick={handleCancel}
                                            >
                                                cancel
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="screen-size-actions">
                                            <div
                                                className="screen-size-edit"
                                                onClick={() =>
                                                    handleStartEdit(item)
                                                }
                                            >
                                                edit
                                            </div>
                                            <div
                                                className="screen-size-btn -size-delete"
                                                onClick={() =>
                                                    handleDeleteScreenSize(
                                                        item.id,
                                                    )
                                                }
                                            >
                                                delete
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {showScreenPrompt && (
                            <div className="setting-option-container">
                                <div className="screen-heading-wrapper">
                                    <input
                                        className="screen-heading"
                                        placeholder="Enter value..."
                                        value={newName}
                                        onChange={(e) => handleNewName(e)}
                                    />
                                </div>
                                <div className="screen-size-contianer">
                                    <div className="screen-width">
                                        <label>W</label>
                                        <input
                                            type="number"
                                            placeholder="width"
                                            value={newWidth}
                                            onChange={(e) => handleNewWidth(e)}
                                        />
                                    </div>
                                    <div className="screen-height">
                                        <label>H</label>
                                        <input
                                            type="number"
                                            value={newHeight}
                                            placeholder="height"
                                            onChange={(e) => handleNewHeight(e)}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="screen-size-save edit"
                                    onClick={handleNewScreenSize}
                                >
                                    save
                                </div>
                            </div>
                        )}

                        <div
                            className="add-option"
                            onClick={() =>
                                setShowScreenPrompt(!showScreenPrompt)
                            }
                        >
                            {showScreenPrompt ? "cancel" : "add"}
                        </div>
                    </div>
                </div>
            )}
            <div
                className="screen-settings"
                onClick={() => setShowScreenSetting(!showScreenSetting)}
            >
                <div
                    className={`seetings-btn ${showScreenSetting ? "active" : ""}`}
                >
                    <Settings size={screenIconsSize} />
                </div>
            </div>
        </div>
    );
};
