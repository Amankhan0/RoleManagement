// src/features/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface dynemicErrorobj {
    [key: string]: string | number;
}

interface dynemicObj {
    [key: string]: string | number | boolean;
}

interface CounterState {
    apiJson: dynemicObj;
    apiJsonError : dynemicErrorobj;
}

const initialState: CounterState = {
    apiJson: {},
    apiJsonError: {}
};

const ApiReducer = createSlice({
    name: 'ApiReducer',
    initialState,
    reducers: {
        setApiJson: (state, action: PayloadAction<dynemicObj>) => {
            state.apiJson = action.payload;
        },
        setApiJsonError: (state, action: PayloadAction<dynemicErrorobj>) => {
            state.apiJsonError = action.payload;
        },
    },
});

export const { setApiJson,setApiJsonError } = ApiReducer.actions;

export default ApiReducer.reducer;