import { createSlice } from "@reduxjs/toolkit";

interface CounterSlice {
    num: number;
}

const initialState: CounterSlice = {
    num: 0,
};

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.num += 1;
        },
    },
});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;
