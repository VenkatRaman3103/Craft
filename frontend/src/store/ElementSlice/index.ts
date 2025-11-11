import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    activeElementId: string | null;
    activeElementType: string | null;
}

const initialState: SliceState = {
    activeElementId: null,
    activeElementType: null,
};

export const ElementSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updateActiveElementId: (state, action) => {
            state.activeElementId = action.payload;
        },

        updateActiveElementType: (state, action: PayloadAction<string>) => {
            state.activeElementType = action.payload;
        },
    },
});

export const { updateActiveElementId, updateActiveElementType } =
    ElementSlice.actions;
export default ElementSlice.reducer;
