import { configureStore } from "@reduxjs/toolkit";
import { SideBarSlice } from "./SideBarSlice";

export const store = configureStore({
    reducer: {
        sideBarSlice: SideBarSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
