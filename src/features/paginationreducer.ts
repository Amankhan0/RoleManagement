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
    limit:1,
    search:{

    }
   }
};

const PaginationReducer = createSlice({
    name: 'ApiReducer',
    initialState,
    reducers: {
        setPagination: (state, action: PayloadAction<paginationOBJ>) => {
            state.pagination = action.payload;
        },
    },
});

export const { setPagination } = PaginationReducer.actions;

export default PaginationReducer.reducer;