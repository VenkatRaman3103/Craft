import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type overflowType = "visible" | "hidden" | "scroll" | "auto";

type InitialState = {
    // dimensions
    elementHeight: number;
    elementWidth: number;

    // min max
    elementMinWidth: number;
    elementMaxWidth: number | "none";

    elementMinHeight: number;
    elementMaxHeight: number | "none";

    // overflow
    elementOverFlow: overflowType;
};

const initialState: InitialState = {
    elementHeight: 100,
    elementWidth: 100,

    elementMinHeight: 0,
    elementMaxHeight: "none",

    elementMinWidth: 0,
    elementMaxWidth: "none",

    elementOverFlow: "auto",
};

export const dimensionControlSlice = createSlice({
    name: "dimensionControl",
    initialState,
    reducers: {
        // dimensions
        updateElementWidth: (state, action: PayloadAction<number>) => {
            state.elementWidth = action.payload;
        },

        updateElementHeight: (state, action: PayloadAction<number>) => {
            state.elementHeight = action.payload;
        },

        // min max
        updateElementMinWidth: (state, action: PayloadAction<number>) => {
            state.elementMinWidth = action.payload;
        },

        updateElementMinHeight: (state, action: PayloadAction<number>) => {
            state.elementMinHeight = action.payload;
        },

        updateElementMaxWidth: (
            state,
            action: PayloadAction<number | "none">,
        ) => {
            state.elementMaxWidth = action.payload;
        },

        updateElementMaxHeight: (
            state,
            action: PayloadAction<number | "none">,
        ) => {
            state.elementMaxHeight = action.payload;
        },

        // overflow
        updateElementOverFlow: (state, action: PayloadAction<overflowType>) => {
            state.elementOverFlow = action.payload;
        },
    },
});

export const {
    updateElementWidth,
    updateElementHeight,
    updateElementMinHeight,
    updateElementMinWidth,
    updateElementMaxHeight,
    updateElementMaxWidth,
    updateElementOverFlow,
} = dimensionControlSlice.actions;

export default dimensionControlSlice.reducer;
