import { createSlice } from '@reduxjs/toolkit';

const getModifiedResponse = (currentAction) => {
    let finalState = {};
    const { error, other, token, storeKey, ...newAction } = currentAction;
    finalState = {
        [currentAction?.storeKey]: newAction
    };
    return finalState;
};

const updateIdentifiers = (state, payload) => {
    const storeKey = payload?.storeKey;
    let newData = state?.[storeKey];
    newData = { ...newData, ...payload?.uniqueScreenIdentifier };
    return {
        [storeKey]: newData
    };
};

const acgSlice = createSlice({
    name: 'acgSlice',
    initialState: {},
    reducers: {
        loadStart: (state) => {
            return { ...state, isLoading: true, err: null };
        },
        apiSuccess: (state, action) => {

            return {
                ...state,
                ...getModifiedResponse(action?.payload),
                isLoading: false,
                err: null
            };
        },
        apiFailed: (state, action) => {
            return {
                ...state,
                isLoading: false,
                err: action.payload,
                response: {}
            };
        },
        reset: () => {
            return {};
        },
        resetErr: (state) => {
            return { ...state, isLoading: false, err: null };
        },
        updateScreenIdentifiers: (state, action) => {
            return {
                ...state,
                ...updateIdentifiers(state, action?.payload),
                isLoading: false,
                err: null
            };
        },
        setStoreKey: (state, action) => {
            return { ...state, [action?.payload?.storeKey]: action?.payload?.value, isLoading: false, err: null };
        },
        resetStoreKey: (state, action) => {
            return { ...state, [action?.payload?.storeKey]: null, isLoading: false, err: null };
        },
        executeACGAction: (state, action) => {}
    }
});

export const {
    loadStart,
    apiSuccess,
    apiFailed,
    reset,
    resetErr,
    setStoreKey,
    resetStoreKey,
    executeACGAction,
    updateScreenIdentifiers
} = acgSlice.actions;
export const { reducer } = acgSlice;