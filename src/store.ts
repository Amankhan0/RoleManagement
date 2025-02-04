import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import roleApiSlice from './features/RoleApiSlice';
import roleSlice from './features/RoleSlice';
import rolePaginationSlice from './features/RolePaginationSlice';

export const store = configureStore({
    reducer: {
        RoleSlice: roleSlice,
        RoleApiSlice:roleApiSlice,
        RolePaginationSlice:rolePaginationSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
