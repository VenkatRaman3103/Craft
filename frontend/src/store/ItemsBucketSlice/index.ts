import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    promptBucket: Record<string, any[]>;
    dataBucket: Record<string, any>;
}

const initialState: SliceState = {
    promptBucket: {},
    dataBucket: {},
};

export const ItemsBucketSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        // Sets the entire array for a key (replaces existing items)
        setPromptBucket: (
            state,
            action: PayloadAction<{ key: string | null; items: any[] }>,
        ) => {
            const key = action.payload.key;
            if (!key) return;
            state.promptBucket[key] = action.payload.items;
        },

        // Adds a single item (with duplicate check)
        updatePromptBucket: (
            state,
            action: PayloadAction<{ key: string | null; obj: any }>,
        ) => {
            const key = action.payload.key;
            if (!key) return;

            if (!state.promptBucket[key]) {
                state.promptBucket[key] = [];
            }

            // Check for duplicate by name before adding
            const exists = state.promptBucket[key].some(
                (item) => item.name === action.payload.obj.name
            );
            
            if (!exists) {
                state.promptBucket[key].push(action.payload.obj);
            }
        },

        updateDataBucket: (
            state,
            action: PayloadAction<{ key: string | null; obj: any }>,
        ) => {
            const key = action.payload.key;
            const obj = action.payload.obj;
            if (!key) return;
            state.dataBucket[key] = obj;
        },

        clearDataBucket: (
            state,
            action: PayloadAction<{ key: string | null }>,
        ) => {
            const key = action.payload.key;
            if (!key) return;
            delete state.dataBucket[key];
        },
    },
});

export const { setPromptBucket, updatePromptBucket, updateDataBucket, clearDataBucket } =
    ItemsBucketSlice.actions;
export default ItemsBucketSlice.reducer;
