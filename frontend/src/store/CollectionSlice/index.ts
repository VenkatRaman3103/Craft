import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CollectionSliceState {
    activeCollectionId: string | null | undefined;
}

const initialState: CollectionSliceState = {
    activeCollectionId: null,
};

export const CollectionSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updateActiveCollectionId: (
            state,
            action: PayloadAction<string | null | undefined>,
        ) => {
            state.activeCollectionId = action.payload;
        },
    },
});

export const { updateActiveCollectionId } = CollectionSlice.actions;
export default CollectionSlice.reducer;
