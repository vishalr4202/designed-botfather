import { combineReducers } from '@reduxjs/toolkit';
import { reducer as acgSlice } from './slice';

export default function createReducer() {
    return combineReducers({
        acgSlice: acgSlice
    });
}