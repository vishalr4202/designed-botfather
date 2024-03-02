import { call, put, takeEvery } from 'redux-saga/effects';
import { loadStart, apiSuccess, apiFailed, executeACGAction } from './slice';
import ApiService from 'src/services/apiService';
import { BASEURL } from '../constants/apiConstants';
import { removeLocalStorage } from 'src/utilities/storageUtility';

const GET_APIURL = (urlPath) => `${BASEURL}${urlPath}`;

const fetchData = async (payload) => {
    try {
        const API_URL = GET_APIURL(payload?.payload?.urlPath);
        const API_METHOD = payload?.payload?.requestType;
        let response;
        if (API_METHOD === 'GET') {
            response = await ApiService.get(API_URL, payload?.payload?.reqObj);
        } else if (API_METHOD === 'POST') {
            response = await ApiService.post(API_URL, payload?.payload?.reqObj);
        } else if (API_METHOD === 'PUT') {
            response = await ApiService.put(API_URL, payload?.payload?.reqObj);
        } else if (API_METHOD === 'DELETE') {
            response = await ApiService.delete(API_URL, payload?.payload?.reqObj);
        }
        return response;
    } catch (err) {
        return { APIerror: err };
    }
};

export function* executeSaga(bundle) {
    yield put(loadStart());
    try {
        let response = yield call(fetchData, bundle.payload);
        if (response?.APIerror) {
            if (response?.APIerror?.status === 401) {
                // removeLocalStorage('token');
                // localStorage.clear();
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1800);
            }
            yield put(apiFailed(response?.APIerror?.message));
            return;
        }
        if (response) {
            response.storeKey = bundle?.payload?.storeKey;
            response = { ...response, ...bundle?.payload?.uniqueScreenIdentifier };
            yield put(apiSuccess(response));
        } else {
            yield put(apiFailed(response?.APIerror?.message));
        }
    } catch (error) {
        yield put(apiFailed(error));
    }
}

export default function* AWSSaga() {
    yield takeEvery(executeACGAction.type, executeSaga);
}