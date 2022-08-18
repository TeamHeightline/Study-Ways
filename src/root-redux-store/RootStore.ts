import {configureStore} from '@reduxjs/toolkit'
import {RootReducer} from "./RootReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'


const reduxStore = configureStore({
    reducer: RootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

});

export default reduxStore
export type AppDispatch = typeof reduxStore.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export type RootState = ReturnType<typeof reduxStore.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

