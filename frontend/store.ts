import { configureStore, ThunkAction, Action, createStore, combineReducers } from "@reduxjs/toolkit";
import { SignupSlice } from "@/components/Signup/redux/slice";
import { FriendListSlice } from "./components/FriendsList/redux/slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const makeStore = () =>
    configureStore({
      reducer: {
        [SignupSlice.name]: SignupSlice?.reducer,
        [FriendListSlice.name]: FriendListSlice?.reducer,
      },
      devTools: true,
    }
  );

const rootReducer = combineReducers({
  [SignupSlice.name]: SignupSlice?.reducer,
  [FriendListSlice.name]: FriendListSlice?.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore["getState"]>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

