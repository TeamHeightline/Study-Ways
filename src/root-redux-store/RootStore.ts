import {configureStore} from '@reduxjs/toolkit'
import {RootReducer} from "./RootReducer";
import {composeWithDevTools} from "redux-devtools-extension";

const composeEnhancers = composeWithDevTools({
    serialize: {
        map: true,
        set: true,
    }
})

const reduxStore = configureStore({
    reducer: RootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

});

export default reduxStore
