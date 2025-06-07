import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaults } from "lodash";

// TODO: interface for initial state
type pageType = {
    page_id: string;
    name: string;
    project_id: string;
    status: string;
    created_at: string;
    edited_at: string;
};

interface PagesType {
    pages: pageType[] | null;
}

// TODO: initial state itself
const initialState: PagesType = {
    pages: null,
};

// TODO: slice with reducers
const projectSlice = createSlice({
    name: "canvasProject",
    initialState,
    reducers: {
        updatePages: (state, action: PayloadAction<pageType[]>) => {
            state.pages = action.payload;
        },
    },
});

export const { updatePages } = projectSlice.actions;

export default projectSlice.reducer;
