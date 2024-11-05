import { configureStore } from '@reduxjs/toolkit';
import UserGuidePreferencesReducer from "./UserGuidePreferencesReducer";
import NavigateToReducer from "./NavigationPageReducer";

const store = configureStore({
    reducer: {
        userGuidePreferencesReducer: UserGuidePreferencesReducer,
        navigateTo: NavigateToReducer
    }
});

export default store;