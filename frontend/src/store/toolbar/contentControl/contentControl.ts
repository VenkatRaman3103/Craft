import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContentControlState {
    elementContent: string;
    textWrap: string;
}

const initialState: ContentControlState = {
    elementContent: "",
    textWrap: "normal",
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
    },
});

export const { updateElementContent, updateTextWrap } =
    contentControlSlice.actions;

export default contentControlSlice.reducer;
