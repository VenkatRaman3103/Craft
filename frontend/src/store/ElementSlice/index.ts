import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    activeElementId: string | null;
}

const initialState: SliceState = {
    activeElementId: null,
};

export const ElementSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updateActiveElementId: (state, action) => {
            state.activeElementId = action.payload;
        },
    },
});

export const { updateActiveElementId } = ElementSlice.actions;
export default ElementSlice.reducer;
