import { backendUrl } from "@/config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const PagePrompt = ({
    title,
    setTitle,
    isCreating,
    handleSave,
}: {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    isCreating: any;
    handleSave: any;
}) => {
    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="page-image-wrapper">
                    <div className="page-image"></div>
                </div>
                <div className="collection-content-container">
                    <div className="collection-content-wrapper">
                        <input
                            type="text"
                            value={title}
                            placeholder="Page Title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="heading"
                        />
                        <button
                            className="go-to-page-btn"
                            onClick={handleSave}
                            disabled={isCreating}
                        >
                            {isCreating ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
