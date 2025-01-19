import { configureStore } from '@reduxjs/toolkit';
import UserGuidePreferencesReducer from './UserGuidePreferencesReducer';
import NavigateToReducer from './NavigationPageReducer';
import reducer from './RestClientReducer';
import FrequentlyBoughtTogetherReducer from './offers/FrequentlyBoughtTogetherReducer';

const store = configureStore({
  reducer: {
    userGuidePreferencesReducer: UserGuidePreferencesReducer,
    navigateTo: NavigateToReducer,
    restClientReducer: reducer,
    frequentlyBoughtTogether: FrequentlyBoughtTogetherReducer,
  },
});

export default store;
