import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer } from 'redux-persist';
import createReducer from './reducers';
import rootSaga from './rootSaga';
import localforage from 'localforage';
// import localStorage from 'redux-persist/es/storage';
import createTransform from 'redux-persist/es/createTransform';

const whitelistTransform = createTransform(null, (inboundState, key) => {
    if (key === 'acgSlice') {
        const newState = {
            loginData: inboundState?.loginData,
            instruments: inboundState?.instruments,
            userDtl: inboundState?.userDtl,
            clientDropdown: inboundState?.clientDropdown,
            routesPrivileges: inboundState?.routesPrivileges,
            defaultPage: inboundState?.defaultPage
        };
        return newState;
    }
    return null;
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage: localforage,
    transforms: [whitelistTransform]
};

const persistedReducer = persistReducer(persistConfig, createReducer());

export default function configureAppStore(initialState = {}) {
    const sagaMiddleware = createSagaMiddleware({});
    const middlewares = [sagaMiddleware];
    const store = configureStore({
        reducer: persistedReducer,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => [
            ...getDefaultMiddleware({
                thunk: false,
                immutableCheck: false,
                serializableCheck: false
            }),
            ...middlewares
        ]
    });
    sagaMiddleware.run(rootSaga);

    // if (module.hot) {
        // module.hot.accept('./reducers', () => store.replaceReducer(persistedReducer));
    // }
    () => store.replaceReducer(persistedReducer)
    return store;
}