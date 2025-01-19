import { createSlice } from '@reduxjs/toolkit';
import { NavigationPage } from '../enums/NavigationPage';

const navigationPageReducerSlicer = createSlice({
  name: 'navigationPageReducer',
  initialState: {
    pageView: NavigationPage.MAIN_PAGE,
  },
  reducers: {
    navigateTo: (state, action) => {
      state.pageView = action.payload;
    },
  },
});

export const { navigateTo } = navigationPageReducerSlicer.actions;

//Selectors
// Get the full user accessibility state
export const selectUserCurrentPage = (state) => state.navigateTo.pageView;

// export
export default navigationPageReducerSlicer.reducer;
