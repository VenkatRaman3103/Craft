import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ContentSourceType = "raw" | "api" | "cms";

interface ContentControlState {
    elementContent: string;
    textWrap: string;

    contentSource: ContentSourceType;
}

const initialState: ContentControlState = {
    elementContent: "",
    textWrap: "normal",
    contentSource: "raw",
};

const contentControlSlice = createSlice({
    name: "contentControl",
    initialState,
    reducers: {
        updateElementContent: (state, action: PayloadAction<string>) => {
            state.elementContent = action.payload;
        },
        updateTextWrap: (state, action: PayloadAction<string>) => {
            state.textWrap = action.payload;
        },
        updateContentSource: (
            state,
            action: PayloadAction<ContentSourceType>,
        ) => {
            state.contentSource = action.payload;
        },
    },
});

export const { updateElementContent, updateTextWrap, updateContentSource } =
    contentControlSlice.actions;

export default contentControlSlice.reducer;
