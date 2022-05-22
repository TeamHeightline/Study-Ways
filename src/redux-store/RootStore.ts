import {applyMiddleware, createStore} from "redux";
import {RootReducer} from "./RootReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

const reduxStore = createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default reduxStore
