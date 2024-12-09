import React, { createContext, useContext, useState, useCallback } from 'react';

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [modalsAndStoreId, setModalsAndStoreId] = useState({ isLoading: true });

    const updateModalsAndStoreId = useCallback((updater) => {
        // If updater is a function, call it with the previous state
        if (typeof updater === 'function') {
            setModalsAndStoreId(prevState => {
                const newState = updater(prevState);
                const finalState = { ...prevState, ...newState };
                console.log("Updating state: ", newState, finalState, prevState);
                return finalState;
            });
        } else {
            // If it's not a function, merge it with the existing state
            setModalsAndStoreId(prevState => {
                console.log("Updating state:", updater);
                return { ...prevState, ...updater };
            });
        }
    }, []);

    console.log("State to persist", modalsAndStoreId)
    if (modalsAndStoreId.storeId !== undefined) {
        const uri = `/api/storeId/modals/update`;
        const stateToPresist = async (uri, modalsAndStoreId) => {
            const response = await fetch(`${uri}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeId: modalsAndStoreId.storeId,
                    mainPageModalClose: modalsAndStoreId.mainPageModalState,
                    offerPageModalClose: modalsAndStoreId.offerPageModalState
                }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;

        };

        stateToPresist(uri, modalsAndStoreId).then((result) => {
            console.log("Response from stateToPresist: ", result);
        }).catch((error) => {
            console.error("Error from stateToPresist: ", error);
        });
    }else{
        console.log("Store ID is not defined yet");
    }


    return (
        <StoreContext.Provider value={{ modalsAndStoreId, setModalsAndStoreId, updateModalsAndStoreId }}>
            {children}
        </StoreContext.Provider>
    );
}

// Custom Hook for Consuming Context
export function useStoreContext() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStoreContext must be used within a StoreProvider");
    }
    return context;
}