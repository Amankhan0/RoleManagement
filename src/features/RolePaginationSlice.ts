// src/features/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface dynemicObj {
    [key: string]: string | number | boolean;
}

export interface paginationOBJ {
    page: number;
    limit : number;
    search:dynemicObj;
}

export interface pagination {
    pagination:paginationOBJ
}

const initialState: pagination = {
   pagination:{
    page:1,
    limit:10,
    search:{

    }
   }
};

const RolePaginationReducer = createSlice({
    name: 'RolePaginationReducer',
    initialState,
    reducers: {
        setPagination: (state, action: PayloadAction<paginationOBJ>) => {
            state.pagination = action.payload;
        },
    },
});

export const { setPagination } = RolePaginationReducer.actions;

export default RolePaginationReducer.reducer;