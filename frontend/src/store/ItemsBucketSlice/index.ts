import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    bucket: any;
}

const initialState: SliceState = {
    bucket: {},
};

export const ItemsBucketSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updateBucket: (
            state,
            action: PayloadAction<{ key: string | null; obj: any }>,
        ) => {
            const key = action.payload.key;

            if (!key) return;

            if (!state.bucket[key]) {
                state.bucket[key] = [];
            }

            state.bucket[key].push(action.payload.obj);
        },
    },
});

export const { updateBucket } = ItemsBucketSlice.actions;
export default ItemsBucketSlice.reducer;
