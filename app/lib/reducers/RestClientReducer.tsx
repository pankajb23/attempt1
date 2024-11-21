import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { zip, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { useDispatch} from "react-redux";
import { FetchProductService } from "../services/product/FetchProductService";

const service: FetchProductService = new FetchProductService();

const initialState = {
    loading: true,
    error: null,
    tags: [],
    pids: [],
    pidsTags: []
};

const RestClientSlicer = createSlice({
    name: 'RestClientReducer',
    initialState,
    reducers: {
        setInitialize: (state, action) => {
            const { allTags, products, tags } = action.payload;
            state.loading = false;
            state.error = null;
            state.tags = allTags;
            state.pids = products;
            state.pidsTags = tags;
        }
    }
});

// export
export default RestClientSlicer.reducer;

export const { setInitialize } = RestClientSlicer.actions;

export const selectIsLoading = (state) => {
    console.log("state " + JSON.stringify(state));
    return state.restClientReducer.loading;
}

export const selectPids = (state) => state.restClientReducer.pids;

export const selectTags = (state) => state.restClientReducer.tags;

export const selectVariants = (state) => state.restClientReducer.pidsTags;    

export const ProductCallInitializer = ({ userId }: { userId: string }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("In ProductCallInitializer and initializing things");
        const subscription = zip(
            from(service.findAllTags(userId)),
            from(service.findPids(userId)),
            from(service.findTags(userId))
        ).pipe(
            map(([allTags, products, tags]) => {
                dispatch(setInitialize({ allTags, products, tags }));
            }),
            catchError(error => {
                console.error('RxJS zip error:', error);
                // Return an observable instead of throwing
                return from([]);  // or handle error appropriately
            })
        ).subscribe();

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, [dispatch, userId]); // Add dependencies

    return null;  // or any loading indicator if needed
};