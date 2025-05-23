import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BorderControl {
    // border radius
    elementRadius: number;

    topLeftRadius: number;
    topRightRadius: number;
    bottomRightRadius: number;
    bottomLeftRadius: number;

    // border width
    elementBoderWidth: number;

    topWidth: number;
    bottomWidth: number;
    leftWidth: number;
    rightWidth: number;

    // style
    borderStyle: string;
}

const initialState: BorderControl = {
    // border radius
    elementRadius: 0,

    topLeftRadius: 0,
    topRightRadius: 0,
    bottomRightRadius: 0,
    bottomLeftRadius: 0,

    // border width
    elementBoderWidth: 1,

    topWidth: 1,
    bottomWidth: 1,
    leftWidth: 1,
    rightWidth: 1,

    // style
    borderStyle: "solid",
};

export const borderControlSlice = createSlice({
    name: "borderControl",
    initialState,
    reducers: {
        // border radius
        updateBoderRadius: (state, action: PayloadAction<number>) => {
            state.elementRadius = action.payload;
        },

        updateTopLeftRadius: (state, action: PayloadAction<number>) => {
            state.topLeftRadius = action.payload;
        },

        updateTopRightRadius: (state, action: PayloadAction<number>) => {
            state.topRightRadius = action.payload;
        },

        updateBottomRightRadius: (state, action: PayloadAction<number>) => {
            state.bottomRightRadius = action.payload;
        },

        updateBottomLeftRadius: (state, action: PayloadAction<number>) => {
            state.bottomLeftRadius = action.payload;
        },

        // border width
        updateElementBoderWidth: (state, action: PayloadAction<number>) => {
            state.elementBoderWidth = action.payload;
        },

        updateTopWidth: (state, action: PayloadAction<number>) => {
            state.topWidth = action.payload;
        },

        updateBottomWidth: (state, action: PayloadAction<number>) => {
            state.bottomWidth = action.payload;
        },

        updateLeftWidth: (state, action: PayloadAction<number>) => {
            state.leftWidth = action.payload;
        },

        updateRightWidth: (state, action: PayloadAction<number>) => {
            state.rightWidth = action.payload;
        },

        // style
        updateBorderStyle: (state, action: PayloadAction<string>) => {
            state.borderStyle = action.payload;
        },
    },
});

export const {
    updateBoderRadius,
    updateRightWidth,
    updateLeftWidth,
    updateBottomWidth,
    updateTopWidth,
    updateElementBoderWidth,
    updateBottomLeftRadius,
    updateBottomRightRadius,
    updateTopRightRadius,
    updateTopLeftRadius,
    updateBorderStyle,
} = borderControlSlice.actions;

export default borderControlSlice.reducer;
