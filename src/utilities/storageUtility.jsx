export const setToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log('Error in local storage', error);
    }
};

export const getFromLocalStorage = (key) => {
    if (localStorage.getItem(key)) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            return data;
        } catch (err) {
            return localStorage.getItem(key);
        }
    }
    return null;
};

export const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
};