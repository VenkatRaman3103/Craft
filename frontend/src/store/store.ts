import { configureStore, ReducerType } from "@reduxjs/toolkit";
import counterSlice from "./counter/counterSlice";
import borderControlSlice from "./toolbar/borderControl/borderControl";
import alignmentSlice from "./toolbar/alignmentControl/alignmentControl";
import projectSlice from "./canvas/projectSlice";
import dimensionControlSlice from "./toolbar/dimensionControl/dimensionControl";
import contentControlSlice from "./toolbar/contentControl/contentControl.ts";
import fontControlSlice from "./toolbar/fontsControl/fontsControl.ts";
import colorControlSlice from "./toolbar/colorControl/colorControl.ts";

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        borderControl: borderControlSlice,
        alignmentControl: alignmentSlice,
        dimensionControl: dimensionControlSlice,
        canvasProject: projectSlice,
        contentControl: contentControlSlice,
        fontControl: fontControlSlice,
        colorControl: colorControlSlice,
    },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
