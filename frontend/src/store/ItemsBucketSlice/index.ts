import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface SliceState {
    promptBucket: any;
    dataBucket: any;
}

const initialState: SliceState = {
    promptBucket: {},
    dataBucket: {},
};

export const ItemsBucketSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updatePromptBucket: (
            state,
            action: PayloadAction<{ key: string | null; obj: any }>,
        ) => {
            const key = action.payload.key;

            if (!key) return;

            if (!state.promptBucket[key]) {
                state.promptBucket[key] = [];
            }

            state.promptBucket[key].push(action.payload.obj);
        },

        updateDataBucket: (
            state,
            action: PayloadAction<{ key: string | null; obj: any }>,
        ) => {
            const key = action.payload.key;
            const obj = action.payload.obj;

            state.dataBucket[key] = obj;
        },
    },
});

export const { updatePromptBucket, updateDataBucket } =
    ItemsBucketSlice.actions;
export default ItemsBucketSlice.reducer;
