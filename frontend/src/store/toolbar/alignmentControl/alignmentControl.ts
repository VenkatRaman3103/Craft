import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Aligment = {
    type: "flex" | "grid";
    flexDirection: "row" | "column";
    isReveresed: boolean;
    alignItems:
        | "start"
        | "end"
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-between"
        | "space-around"
        | "space-evenly";
    justifyContent:
        | "start"
        | "end"
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-between"
        | "space-around"
        | "space-evenly";
    gap: number;
};

const initialState: Aligment = {
    type: "flex",
    flexDirection: "row",
    isReveresed: false,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 0,
};

export const alignmentSlice = createSlice({
    name: "align",
    initialState,
    reducers: {
        updateAlignType: (state, action: PayloadAction<"flex" | "grid">) => {
            state.type = action.payload;
        },

        updateFlexDirection: (
            state,
            action: PayloadAction<"row" | "column">,
        ) => {
            state.flexDirection = action.payload;
        },

        updateIsReveresed: (state, action: PayloadAction<boolean>) => {
            state.isReveresed = action.payload;
        },

        updateAlignItems: (
            state,
            action: PayloadAction<
                | "start"
                | "end"
                | "center"
                | "space-between"
                | "space-around"
                | "space-evenly"
                | "flex-start"
                | "flex-end"
            >,
        ) => {
            state.alignItems = action.payload;
        },

        updateJustifyContent: (
            state,
            action: PayloadAction<
                | "start"
                | "end"
                | "center"
                | "space-between"
                | "space-around"
                | "flex-start"
                | "flex-end"
                | "space-evenly"
            >,
        ) => {
            state.justifyContent = action.payload;
        },

        updateGap: (state, action: PayloadAction<number>) => {
            state.gap = action.payload;
        },
    },
});

export const {
    updateAlignType,
    updateAlignItems,
    updateIsReveresed,
    updateFlexDirection,
    updateJustifyContent,
    updateGap,
} = alignmentSlice.actions;

export default alignmentSlice.reducer;
