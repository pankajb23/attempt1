import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserGuidePreferencesService } from '../services/UserGuidePreferencesService';
import { type UserGuidePreferences } from 'app/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const userGuidePreferences: UserGuidePreferencesService = new UserGuidePreferencesService();

// Create async thunks for API calls
export const updateAssistanceOnMainPageThunk = createAsyncThunk(
    'userPreferences/updateAssistance',
    async (isEnabled: boolean, thunkAPI) => {
        try {
            console.log("userPreferences pressed " + isEnabled);
            const response = await userGuidePreferences.updateShowAssistanceOnMainPageEnabled(isEnabled);
            console.log("userPreferences post " + isEnabled + " response " + response);
            return isEnabled;
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Update failed:", err);
                return thunkAPI.rejectWithValue(err.message);
            }
        }
    }
);


export const updateWarningOnOfferPageThunk = createAsyncThunk(
    'userPreferences/updateWarning',
    async (isEnabled: boolean) => {
        await userGuidePreferences.updateShowWarningOnOfferPageEnabled(isEnabled);
        return isEnabled;
    }
);


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
            // return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAssistanceOnMainPageThunk.fulfilled, (state, action) => {
                console.log("userPreferences pressed in extra reducers " + action.payload);
                if (state.preferences) {
                    state.preferences.isShowAssistanceOnMainPageEnabled = action.payload;
                }
            })
            .addCase(updateWarningOnOfferPageThunk.fulfilled, (state, action) => {
                if (state.preferences) {
                    state.preferences.isShowWarningOnOfferPageEnabled = action.payload;
                }
            });
    }
});

export const { setInitialState } = userOnboardingStatesSlicer.actions;

//Selectors
// Get the full user accessibility state
export const selectUserAccessibility = (state) => state.userGuidePreferencesReducer;

export const selectShowAssistanceOnMainPage = (state) => state.userGuidePreferencesReducer.preferences?.isShowAssistanceOnMainPageEnabled;

export const selectShowWarningOnOfferPage = (state) => state.userGuidePreferencesReducer.preferences?.isShowWarningOnOfferPageEnabled;

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