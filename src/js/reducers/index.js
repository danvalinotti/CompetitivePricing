import { combineReducers } from "redux";
import dashBoardReducer from "./dashBoardReducer";
import {reducer as formReducer} from "redux-form"

export default combineReducers({dashBoardReducer,form: formReducer});