// export const BASEURL = 'https://13.235.150.170:443/';
export const BASEURL = 'http://localhost:8001/';
// export const BASEURL = 'https://7d30-106-51-173-126.ngrok-free.app/';

export const ACTION_CODES = {
    LOGIN: 'login',
    USER_DASH: 'dashboard',
    FS_LOGIN: 'firstStockLogin',
    GET_ACCESS_TOKEN: 'getAccessToken',
    ADMIN_DASH: 'getAllUsers',
    ADMIN_GET_MARGIN: 'getAccountBalance',
    ADMIN_GET_POSITIONS: 'getPositions',
    ADMIN_GET_PROFILE: 'getProfile',
    ADMIN_GET_ORDERS: 'getOrders',
    USER_GET_MARGIN: 'getUserAccountBalance',
    USER_GET_POSITIONS: 'getUserPositions',
    USER_GET_PROFILE: 'getUserProfile',
    USER_GET_ORDERS: 'getUserOrders',
    GET_INSTRUMENTS: 'getInstruments',
    SET_BASIC_TRADE: 'setBasicTrade',
    GET_FS_USER_PROFILE: "fsuserDetails",
    FS_USER_ORDERS: "fsorders",
    FS_USER_POSITIONS: "fspositions",
    FS_PLACE_SINGLE_ORDER: 'fsplacesingleorder',
    FS_PLACE_MULTIPLE_ORDER: 'fsplacemultiorders',
    FS_SHORT_STRADDLE: 'fsshortstraddle',
    FS_LONG_STRADDLE: 'fslongstraddle',
    FS_SHORT_STRANGLE: 'fsshortstrangle',
    FS_LONG_STRANGLE: 'fslongstrangle',
    FS_BULL_SPREAD: 'fsBullCallSpread',
    FS_BEAR_SPREAD: 'fsBearPutSpread',
    FS_GET_INSTRUMENTS: 'fsgetInstruments',
    FS_GET_USERKEYS: 'fsGetUserKeys',
    GET_SETS: 'getAllSets',
    SET_PRIMARY_USER_DETAIL: 'primaryUserDetail',
    PLACE_SET_ORDER: 'placeSetOrders',
    PLACE_TRAILING_ORDER: 'placeTrailingSetOrders',
    EXIT_SET_ORDER: 'exitSetOrders',
    PRIMARY_SET_POSITION: 'primarySetPositions',
    NON_PRIMARY_SET_POSITION: 'primarySetPositions',
    SET_MULTI_ORDERS: 'setplacemultipleorders',
    SET_SHORT_STRADDLE: 'setshortStraddle',
    SET_SHORT_STRANGLE: 'setshortStrangle',
    SET_LONG_STRADDLE: 'setlongStraddle',
    SET_LONG_STRANGLE: 'setlongStrangle',
    SET_BULL_CALL: 'setbullCallSpread',
    SET_BEAR_PUT: 'setbearPutSpread',
    SET_LOGIN_ALL: 'setloginAll'
};

export const STORE_KEYS = {
    LOGIN_DATA: 'loginData',
    USER_DASH_DATA: 'userDashData',
    FS_LOGIN: 'fs_loginData',
    ACCESS_TOKEN: 'accessToken',
    ADMIN_ALL_USERS: 'allusers',
    ADMIN_GET_MARGIN: 'adminGetMargin',
    ADMIN_GET_POSITIONS: 'adminGetPositions',
    ADMIN_GET_PROFILE: 'adminGetProfile',
    ADMIN_GET_ORDERS: 'adminGetOrders',
    USER_GET_MARGIN: 'getUserAccountBalance',
    USER_GET_POSITIONS: 'getUserPositions',
    USER_GET_PROFILE: 'getUserProfile',
    USER_GET_ORDERS: 'getUserOrders',
    INSTRUMENTS: 'instruments',
    SET_BASIC_TRADE: 'basicTrade',
    FS_USER_PROFILE: "fsuserDetails",
    FS_USER_GET_ORDERS: "fsorders",
    FS_USER_POSITION: "fspositions",
    FS_PLACE_SINGLE_ORDER: 'fsplacesingleorder',
    FS_PLACE_MULTIPLE_ORDER: 'fsplacemultiorders',
    FS_SHORT_STRADDLE: 'fsshortstraddle',
    FS_LONG_STRADDLE: 'fslongstraddle',
    FS_SHORT_STRANGLE: 'fsshortstrangle',
    FS_LONG_STRANGLE: 'fslongstrangle',
    FS_BULL_SPREAD: 'fsBullCallSpread',
    FS_BEAR_SPREAD: 'fsBearPutSpread',
    FS_GET_INSTRUMENTS: 'fsgetInstruments',
    FS_GET_USERKEYS: 'fsGetUserKeys',
    GET_SETS: 'allSets',
    SET_PRIMARY_USER_DETAIL: 'primaryUserDetail',
    PLACE_SET_ORDER: 'placeSetOrders',
    PLACE_TRAILING_ORDER: 'placeTrailingSetOrders',
    EXIT_SET_ORDER: 'exitSetOrders',
    PRIMARY_SET_POSITION: 'primarySetPositions',
    NON_PRIMARY_SET_POSITION: 'NonPrimarySetPositions',
    SET_MULTI_ORDERS: 'setplacemultipleorders',
    SET_SHORT_STRADDLE: 'setshortStraddle',
    SET_SHORT_STRANGLE: 'setshortStrangle',
    SET_LONG_STRADDLE: 'setlongStraddle',
    SET_LONG_STRANGLE: 'setlongStrangle',
    SET_BULL_CALL: 'setbullCallSpread',
    SET_BEAR_PUT: 'setbearPutSpread',
    SET_LOGIN_ALL: 'setloginAll'
};