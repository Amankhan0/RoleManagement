import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apireducer from './features/apireducer';
import ApplicationManagement from './features/applicationmanagement';

export const store = configureStore({
    reducer: {
        ApplicationManagementReducer: ApplicationManagement,
        ApiReducer:apireducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
