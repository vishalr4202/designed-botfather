import { setToLocalStorage, getFromLocalStorage } from './storageUtility';

export const setJWTToken = (token) => {
    setToLocalStorage('token', token);
};
export const setRole = (role) => {
    setToLocalStorage('role',role)
}

export const getJWTToken = () => {
    return getFromLocalStorage('token') || '';
};