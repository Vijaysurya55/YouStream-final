import { combineReducers } from "redux";
import videoReducer from "./videos/videoReducer";
import authReducer from "./auth/authReducer";
import categoryReducer from "./category/categoryReducer";

const rootReducer =  combineReducers({
    videoState:videoReducer,
    auth:authReducer,
    category:categoryReducer
})
export default rootReducer
export type RootState = ReturnType<typeof rootReducer>