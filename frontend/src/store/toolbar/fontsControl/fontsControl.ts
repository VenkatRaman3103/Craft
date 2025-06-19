import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FontFamily = string;
export type FontWeight =
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
export type FontStyle = "normal" | "italic";
export type TextDecoration = "none" | "underline" | "line-through" | "overline";
export type TextAlign = "left" | "center" | "right" | "justify";

export interface FontControlState {
    fontFamily: FontFamily;
    fontWeight: FontWeight;
    fontSize: number;
    fontStyle: FontStyle;
    textDecoration: TextDecoration;
    textAlign: TextAlign;
    lineHeight: number;
    letterSpacing: number;
}

const initialState: FontControlState = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
    fontSize: 16,
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    lineHeight: 1.5,
    letterSpacing: 0,
};

const fontControlSlice = createSlice({
    name: "fontControl",
    initialState,
    reducers: {
        updateFontFamily: (state, action: PayloadAction<FontFamily>) => {
            state.fontFamily = action.payload;
        },
        updateFontWeight: (state, action: PayloadAction<FontWeight>) => {
            state.fontWeight = action.payload;
        },
        updateFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload;
        },
        updateFontStyle: (state, action: PayloadAction<FontStyle>) => {
            state.fontStyle = action.payload;
        },
        updateTextDecoration: (
            state,
            action: PayloadAction<TextDecoration>,
        ) => {
            state.textDecoration = action.payload;
        },
        updateTextAlign: (state, action: PayloadAction<TextAlign>) => {
            state.textAlign = action.payload;
        },
        updateLineHeight: (state, action: PayloadAction<number>) => {
            state.lineHeight = action.payload;
        },
        updateLetterSpacing: (state, action: PayloadAction<number>) => {
            state.letterSpacing = action.payload;
        },
        resetFontControl: (state) => {
            return initialState;
        },
    },
});

export const {
    updateFontFamily,
    updateFontWeight,
    updateFontSize,
    updateFontStyle,
    updateTextDecoration,
    updateTextAlign,
    updateLineHeight,
    updateLetterSpacing,
    resetFontControl,
} = fontControlSlice.actions;

export default fontControlSlice.reducer;
