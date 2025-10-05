import { configureStore } from "@reduxjs/toolkit";
import { SideBarSlice } from "./SideBarSlice";
import { ModalSlice } from "./ModalSlice";

export const store = configureStore({
    reducer: {
        sideBarSlice: SideBarSlice.reducer,
        modalSlice: ModalSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
