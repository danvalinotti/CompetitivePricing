import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';
import rootReducer from "../reducers/index";
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'

// Configure store with reducers and create
const store = createStore(rootReducer, applyMiddleware(thunk,logger,promiseMiddleware));

export default store;
