import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { applyMiddleware, legacy_createStore as createStore } from "redux";

import rootReducer from "../reducers";

const persistConfig = {
  key: "pagination-data",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = applyMiddleware(thunk);
const store = createStore(persistedReducer, middleware);

const persistor = persistStore(store);
export { store, persistor };
