import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apireducer from './features/apireducer';
import rolemanagementreducer from './features/rolemanagementreducer';
import paginationreducer from './features/paginationreducer';

export const store = configureStore({
    reducer: {
        RoleManagementReducer: rolemanagementreducer,
        ApiReducer:apireducer,
        PaginationReducer:paginationreducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
