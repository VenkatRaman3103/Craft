import { configureStore, ReducerType } from "@reduxjs/toolkit";
import counterSlice from "./counter/counterSlice";
import borderControlSlice from "./toolbar/borderControl/borderControl";

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        borderControl: borderControlSlice,
    },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
