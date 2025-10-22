import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    active: boolean;
    type: string | null;
    referenceId: string | null; // id of the element that opened the modal
}

const initialState: SliceState = {
    active: false,
    type: null,
    referenceId: null,
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
        updateReferenceId: (state, action: PayloadAction<string | null>) => {
            state.referenceId = action.payload;
        },
    },
});

export const { modalType, toggleModal, updateReferenceId } = ModalSlice.actions;
export default ModalSlice.reducer;
