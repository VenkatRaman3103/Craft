import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    active: boolean;
}

const initialState: SliceState = {
    active: false,
};

export const SideBarSlice = createSlice({
    name: "SideBarSlice",
    initialState,
    reducers: {
        toggleSideBar: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
    },
});

export const { toggleSideBar } = SideBarSlice.actions;
export default SideBarSlice.reducer;
