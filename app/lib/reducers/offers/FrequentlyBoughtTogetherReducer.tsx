import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { FrequentlyBoughtTogetherService } from 'app/lib/services/offers/FrequentlyBoughtTogetherService';
import {
  type FrequentlyBoughtTogetherType,
  type Trigger,
  type OfferProductsManual,
  type OfferProductsAutomatic,
  type DiscountState,
} from 'app/components/types/FrequentlyBoughtTogetherTypes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setInitialState } from '../UserGuidePreferencesReducer';

const service = new FrequentlyBoughtTogetherService();

// State interface with both saved and draft versions
interface FrequentlyBoughtTogetherState {
  loading: boolean;
  error: string | null;
  savedContent: FrequentlyBoughtTogetherType | null;
  draftContent: FrequentlyBoughtTogetherType | null;
  hasUnsavedChanges: boolean;
}

const initialState: FrequentlyBoughtTogetherState = {
  loading: true,
  error: null,
  savedContent: null,
  draftContent: null,
  hasUnsavedChanges: false,
};

interface FetchOfferParams {
  userId: string;
  offerName: string;
}

interface UpdateOffer {
  userId: string;
  type: FrequentlyBoughtTogetherType;
  offerId?: string;
}

// Async thunks
export const fetchOfferContent = createAsyncThunk('frequentlyBoughtTogether/fetchContent', async ({ userId, offerName }: FetchOfferParams) => {
  const response = await service.find(userId, offerName);
  return response;
});

export const saveOfferContent = createAsyncThunk('frequentlyBoughtTogether/saveContent', async ({ userId, type, offerId }: UpdateOffer, { rejectWithValue }) => {
  try {
    const response = await service.upsert(userId, type, offerId);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
  }
});

const FrequentlyBoughtTogetherSlicer = createSlice({
  name: 'FrequentlyBoughtTogetherReducer',
  initialState,
  reducers: {
    setInitialState: (state, action: PayloadAction<FrequentlyBoughtTogetherType>) => {
      state.loading = false;
      state.savedContent = action.payload;
      state.draftContent = action.payload;
    },
    // Update specific fields in draft content
    updateOfferName: (state, action: PayloadAction<string>) => {
      if (state.draftContent) {
        state.draftContent.offerName = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateTrigger: (state, action: PayloadAction<Trigger>) => {
      if (state.draftContent) {
        state.draftContent.trigger = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateOfferProducts: (state, action: PayloadAction<OfferProductsManual | OfferProductsAutomatic>) => {
      if (state.draftContent) {
        state.draftContent.offerProducts = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateDiscount: (state, action: PayloadAction<DiscountState>) => {
      if (state.draftContent) {
        state.draftContent.discountState = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateDiscountState: (state, action: PayloadAction<{ field: string; value: any }>) => {
      if (state.draftContent) {
        const { field, value } = action.payload;
        state.draftContent.discountState[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    updateOtherPriorities: (state, action: PayloadAction<{ field: string; value: string }>) => {
      if (state.draftContent) {
        const { field, value } = action.payload;
        state.draftContent.otherPriorities[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    // Reset draft to saved content
    discardChanges: (state) => {
      state.draftContent = state.savedContent ? { ...state.savedContent } : null;
      state.hasUnsavedChanges = false;
    },
    // Update entire draft content
    updateDraftContent: (state, action: PayloadAction<FrequentlyBoughtTogetherType>) => {
      state.draftContent = action.payload;
      state.hasUnsavedChanges = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle initial fetch
      .addCase(fetchOfferContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferContent.fulfilled, (state, action) => {
        state.loading = false;
        state.savedContent = action.payload;
        state.draftContent = { ...action.payload };
        state.hasUnsavedChanges = false;
      })
      .addCase(fetchOfferContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch offer content';
      })
      // Handle save
      .addCase(saveOfferContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOfferContent.fulfilled, (state, action) => {
        state.loading = false;
        state.savedContent = action.payload;
        state.draftContent = { ...action.payload };
        state.hasUnsavedChanges = false;
      })
      .addCase(saveOfferContent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to save offer content';
      });
  },
});

// Export actions
export const { updateOfferName, updateTrigger, updateOfferProducts, updateDiscount, updateDiscountState, updateOtherPriorities, discardChanges, updateDraftContent } =
  FrequentlyBoughtTogetherSlicer.actions;

// Selectors
export const selectLoading = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => state.frequentlyBoughtTogether.loading;

export const selectOfferName = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => {
  return state.frequentlyBoughtTogether.draftContent?.offerName ?? '';
};

export const selectError = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => state.frequentlyBoughtTogether.error;

export const selectSavedContent = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => state.frequentlyBoughtTogether.savedContent;

export const selectDraftContent = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => state.frequentlyBoughtTogether.draftContent;

export const selectHasUnsavedChanges = (state: { frequentlyBoughtTogether: FrequentlyBoughtTogetherState }) => state.frequentlyBoughtTogether.hasUnsavedChanges;

// Initializer component
export const FrequentlyBoughtTogetherInitializer = ({ userId, offerLabel }: { userId: string; offerLabel?: string }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (loading) {
      service.find(userId, offerLabel).then((data) => {
        dispatch(setInitialState(data));
      });
    }
  }, [dispatch, userId]);

  return null;
};

export default FrequentlyBoughtTogetherSlicer.reducer;
