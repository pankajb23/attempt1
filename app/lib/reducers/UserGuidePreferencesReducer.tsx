import { createSlice } from '@reduxjs/toolkit';
import { UserGuidePreferencesService } from '../services/UserGuidePreferencesService';
import { type UserGuidePreferences } from 'app/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const userGuidePreferences: UserGuidePreferencesService = new UserGuidePreferencesService();

const userOnboardingStatesSlicer = createSlice({
    name: 'userAccessibilityReducer',
    initialState: {
        loading: true,
        preferences: null as UserGuidePreferences | null
    },
    reducers: {
        setInitialState: (state, action) => {
            state.loading = false
            state.preferences = action.payload;
            console.log("initialized " + JSON.stringify(action.payload));
            // return action.payload;
        },
        updateAssistanceOnMainPage: (state, action) => {
            const isAssistanceOnMainPageEnabled = action.payload;
            userGuidePreferences.updateShowAssistanceOnMainPageEnabled(isAssistanceOnMainPageEnabled);
        },
        updateShowWarningOnOfferPageEnabled: (state, action) => {
            const isShowWarningOnOfferPageEnabled = action.payload;
            userGuidePreferences.updateShowWarningOnOfferPageEnabled(isShowWarningOnOfferPageEnabled);
        }
    }
});

export const { setInitialState, updateAssistanceOnMainPage, updateShowWarningOnOfferPageEnabled } = userOnboardingStatesSlicer.actions;

//Selectors
// Get the full user accessibility state
export const selectUserAccessibility = (state) => state.userGuidePreferencesReducer;

export const selectShowAssistanceOnMainPage = (state) => state.userGuidePreferencesReducer.preferences?.showAssistanceOnMainPage;

export const selectShowWarningOnOfferPage = (state) => state.userGuidePreferencesReducer.preferences?.showWarningOnOfferPage;

export const selectIsLoading = (state) => state.userGuidePreferencesReducer.loading;

// export
export default userOnboardingStatesSlicer.reducer;

export const UserGuidePreferencesInitializer = ({ userId }: { userId: string }) => {
    const dispatch = useDispatch();
    const isLoadingDone = useSelector(state => selectIsLoading(state));
    useEffect(() => {
        if (isLoadingDone) {
            userGuidePreferences.find(userId).then(data => {
                dispatch(setInitialState(data));
            });
        } else {
            console.log("Loading already done");
        }
    }, []);

    return null;  // This component doesn't render anything
};