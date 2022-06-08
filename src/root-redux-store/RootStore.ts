import {applyMiddleware, createStore} from "redux";
import {RootReducer} from "./RootReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

const composeEnhancers = composeWithDevTools({
    serialize: {
        map: true,
        set: true,
    }
})

const reduxStore = createStore(RootReducer, composeEnhancers(applyMiddleware(thunk)));

export default reduxStore
