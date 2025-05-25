import { configureStore, ReducerType } from "@reduxjs/toolkit";
import counterSlice from "./counter/counterSlice";
import borderControlSlice from "./toolbar/borderControl/borderControl";
import alignmentSlice from "./toolbar/alignmentControl/alignmentControl";

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        borderControl: borderControlSlice,
        alignmentControl: alignmentSlice,
    },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
