import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: PagesType = {
    pages: null,
};

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
