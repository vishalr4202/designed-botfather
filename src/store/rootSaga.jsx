import {  all } from 'redux-saga/effects';
import acgSaga from './saga';

function* rootSaga() {
    
    yield all([acgSaga()]);
}

export default rootSaga;