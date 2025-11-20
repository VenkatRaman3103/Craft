import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
    pageData: any;
}

const initialState: SliceState = {
    pageData: 0,
};

export const PageSlice = createSlice({
    name: "slice",
    initialState,
    reducers: {
        updatePageData: (state, action: PayloadAction) => {
            state.pageData = action.payload;
        },
    },
});

export const { updatePageData } = PageSlice.actions;
export default PageSlice.reducer;
