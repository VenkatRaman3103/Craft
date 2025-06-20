import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ColorControlState {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    shadowColor: string;
    gradientStart: string;
    gradientEnd: string;
    gradientDirection: string;
    useGradient: boolean;
}

const initialState: ColorControlState = {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    textColor: "#000000",
    shadowColor: "#000000",
    gradientStart: "#ffffff",
    gradientEnd: "#000000",
    gradientDirection: "to right",
    useGradient: false,
};

const colorControlSlice = createSlice({
    name: "colorControl",
    initialState,
    reducers: {
        updateBackgroundColor: (state, action: PayloadAction<string>) => {
            state.backgroundColor = action.payload;
        },
        updateBorderColor: (state, action: PayloadAction<string>) => {
            state.borderColor = action.payload;
        },
        updateTextColor: (state, action: PayloadAction<string>) => {
            state.textColor = action.payload;
        },
        updateShadowColor: (state, action: PayloadAction<string>) => {
            state.shadowColor = action.payload;
        },
        updateGradientStart: (state, action: PayloadAction<string>) => {
            state.gradientStart = action.payload;
        },
        updateGradientEnd: (state, action: PayloadAction<string>) => {
            state.gradientEnd = action.payload;
        },
        updateGradientDirection: (state, action: PayloadAction<string>) => {
            state.gradientDirection = action.payload;
        },
        updateUseGradient: (state, action: PayloadAction<boolean>) => {
            state.useGradient = action.payload;
        },
        resetColorControl: (state) => {
            Object.assign(state, initialState);
        },
    },
});

export const {
    updateBackgroundColor,
    updateBorderColor,
    updateTextColor,
    updateShadowColor,
    updateGradientStart,
    updateGradientEnd,
    updateGradientDirection,
    updateUseGradient,
    resetColorControl,
} = colorControlSlice.actions;

export default colorControlSlice.reducer;
