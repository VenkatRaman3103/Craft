import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    active: boolean;
    type: string | null;
}

const initialState: SliceState = {
    active: false,
    type: null,
};

export const ModalSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        toggleModal: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
        modalType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
    },
});

export const { modalType, toggleModal } = ModalSlice.actions;
export default ModalSlice.reducer;
