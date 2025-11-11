import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    active: boolean;
    type: string | null;
    referenceId: string | null | undefined; // id of the element that opened the modal
    parentType?: string | undefined | null;
}

const initialState: SliceState = {
    active: false,
    type: null,
    referenceId: null,
    parentType: null,
};

export const ModalSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        toggleModal: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
        updateModalType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
        updateReferenceId: (
            state,
            action: PayloadAction<string | null | undefined>,
        ) => {
            state.referenceId = action.payload;
        },
        updateParentType: (
            state,
            action: PayloadAction<string | null | undefined>,
        ) => {
            state.parentType = action.payload;
        },
    },
});

export const {
    updateModalType,
    toggleModal,
    updateReferenceId,
    updateParentType,
} = ModalSlice.actions;
export default ModalSlice.reducer;
