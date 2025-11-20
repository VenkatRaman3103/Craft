import { configureStore } from "@reduxjs/toolkit";
import { SideBarSlice } from "./SideBarSlice";
import { ModalSlice } from "./ModalSlice";
import { ElementSlice } from "./ElementSlice";
import { CollectionSlice } from "./CollectionSlice";
import { PageSlice } from "./PageSlice";

export const store = configureStore({
    reducer: {
        sideBarSlice: SideBarSlice.reducer,
        modalSlice: ModalSlice.reducer,
        elementSlice: ElementSlice.reducer,
        collectionSlice: CollectionSlice.reducer,
        pageSlice: PageSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
