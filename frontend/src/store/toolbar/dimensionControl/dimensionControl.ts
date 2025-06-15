import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type overflowType = "visible" | "hidden" | "scroll" | "auto";
export type minWidhtType = number | "auto";
export type minHeightType = number | "auto";

export type maxWidhtType = number | "none";
export type maxHeightType = number | "none";

type InitialState = {
    // dimensions
    elementHeight: number;
    elementWidth: number;

    // min max
    elementMinWidth: minWidhtType;
    elementMaxWidth: maxWidhtType;

    elementMinHeight: minHeightType;
    elementMaxHeight: maxHeightType;

    // overflow
    elementOverFlow: overflowType;
};

const initialState: InitialState = {
    elementHeight: 100,
    elementWidth: 100,

    elementMinHeight: "auto",
    elementMaxHeight: "none",

    elementMinWidth: "auto",
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
        updateElementMinWidth: (state, action: PayloadAction<minWidhtType>) => {
            state.elementMinWidth = action.payload;
        },

        updateElementMinHeight: (
            state,
            action: PayloadAction<minHeightType>,
        ) => {
            state.elementMinHeight = action.payload;
        },

        updateElementMaxWidth: (state, action: PayloadAction<maxWidhtType>) => {
            state.elementMaxWidth = action.payload;
        },

        updateElementMaxHeight: (
            state,
            action: PayloadAction<maxHeightType>,
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
