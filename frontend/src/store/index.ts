import { configureStore } from "@reduxjs/toolkit";
import { SideBarSlice } from "./SideBarSlice";
import { ModalSlice } from "./ModalSlice";
import { ElementSlice } from "./ElementSlice";
import { CollectionSlice } from "./CollectionSlice";

export const store = configureStore({
    reducer: {
        sideBarSlice: SideBarSlice.reducer,
        modalSlice: ModalSlice.reducer,
        elementSlice: ElementSlice.reducer,
        collectionSlice: CollectionSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
