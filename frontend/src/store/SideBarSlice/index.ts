import { sidebar_items } from "@/features/SideBar/sidebar_items";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    active: boolean;
    activeLayer: string;
}

const initialState: SliceState = {
    active: false,
    activeLayer: sidebar_items[0].name,
};

export const SideBarSlice = createSlice({
    name: "SideBarSlice",
    initialState,
    reducers: {
        toggleSideBar: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
        updateActiveLayer: (state, action: PayloadAction<string>) => {
            state.activeLayer = action.payload;
        },
    },
});

export const { toggleSideBar, updateActiveLayer } = SideBarSlice.actions;
export default SideBarSlice.reducer;
