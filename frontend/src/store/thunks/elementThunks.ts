import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all elements
export const fetchElements = createAsyncThunk(
    "elements/fetchElements",
    async () => {
        const response = await fetch("/api/elements");
        const data = await response.json();
        return data;
    },
);

// Fetch element styles
export const fetchElementStyles = createAsyncThunk(
    "styles/fetchElementStyles",
    async (elementId: number) => {
        const response = await fetch(`/api/elements/${elementId}/styles`);
        const data = await response.json();
        return { elementId, styles: data };
    },
);

// Update element styles
export const updateElementStyles = createAsyncThunk(
    "styles/updateElementStyles",
    async ({ elementId, styles }: { elementId: number; styles: any }) => {
        const response = await fetch(`/api/elements/${elementId}/styles`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(styles),
        });

        if (!response.ok) {
            throw new Error("Failed to update styles");
        }

        return { elementId, styles };
    },
);
