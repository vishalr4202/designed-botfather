import { createSelector } from '@reduxjs/toolkit';

export const selectAcg = (state) => state.acgSlice || {};
export const acgSelector = () => createSelector(selectAcg, (acgState) => acgState);