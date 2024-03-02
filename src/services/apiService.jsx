/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { setJWTToken, getJWTToken ,setRole} from 'src/utilities/tokenUtility';

class ApiService {
     service;
     currentUrl;

    constructor() {
        const service = axios.create({
            headers: {}
        });
        this.service = service;
        this.currentUrl = '';
    }

    getHeader = (contentType) => {
        if (contentType === 'multipart/form-data') {
            return {
                'Content-Type': 'multipart/form-data',
                Authorization: getJWTToken(),
                "ngrok-skip-browser-warning":true
            };
        } else {
            return {
                'Content-Type': 'application/json;charset=UTF-8',
                Authorization:  getJWTToken(),
                "ngrok-skip-browser-warning":true
            };
        }
    };

    getFormattedError = (err) => {
        try {
            if (err?.data?.status) {
                console.log(err,"err 1")
                return {
                    status:  err?.data?.status,
                    message: err?.data?.message,
                    apiErrStatus: err?.data?.status,
                };
            }
            if(err?.data?.data){
                console.log(err,"err 2")
                return {
                    status:err?.data?.statusCode,
                    message:err?.data?.data
                };
            }
            if (err?.data?.status && err?.data?.data) {
                console.log(err,"err 3")
                return {
                    status: err?.data?.status,
                    message: err?.data?.data,
                    apiErrStatus: err?.data?.status,
                };
            }
            if (err?.data?.status && !err?.data?.data) {
                console.log(err,"err 4")
                return {
                    status: err?.data?.status,
                    message: err?.data?.data,
                    apiErrStatus: err?.data?.status,
                };
            }
            if(err?.message && !err?.data){
                console.log(err,"err 5")
                return{
                    status:err?.status,
                    message:err?.message
                }  
            }
            if(err?.data?.fs_error && err?.data?.fs_error?.status === 401){
                console.log(err,"err 6")
                return{
                    status:err?.data?.fs_error?.status,
                    message:err?.data?.fs_error?.reason
                }
            }
            if(err?.data?.fs_error){
                console.log(err,"err 6")
                return{
                    status:err?.data?.fs_error?.status,
                    message:err?.data?.fs_error?.reason
                }
            }
             
            return {
                status: err?.status,
                message: 'Something went wrong',
                Error: err.message
            };
        } catch (e) {
            return {
                status: 'error',
                message: 'Something went wrong',
                details: 'Internal Server Error'
            };
        }
    };

    get(path, params) {
        this.currentUrl = path;
        return this.service
            .request({
                method: 'GET',
                url: path,
                params: params,
                headers: this.getHeader()
            })
            .then((response) => {
                response?.data?.token && setJWTToken(response?.data?.token); 
                response?.data?.token && setRole(response?.data?.role);
                console.log(response,"sdfasdsacs")
                return response?.data || response;
            })
            .catch((e) => {
                console.log(e?.response?.data,"in get err")
                let resObj
                if(e?.response?.data &&  (e?.response?.data?.code == 401 || e?.response?.data?.status == 401)){
                    resObj = {
                       status: e?.response?.data?.status,
                       message: "Please Login to the broker to view these details",
                   };
               }
               if(e?.response?.data && (e?.response?.data?.code != 401 && e?.response?.data?.status != 401)){
                resObj = {
                   status: e?.response?.data?.status,
                   message: e?.response?.data?.message,
               };
           }
            return this.handleError(resObj)
        });
    }

    put(path, payload, options = {}) {
        return this.service
            .request(this.getRequestObject('PUT', path, payload, options))
            .then((response) => response.data || response)
            .catch((e) => this.handleError(e));
    }

    patch(path, payload, options = {}) {
        return this.service
            .request(this.getRequestObject('PATCH', path, payload, options))
            .then((response) => response.data || response)
            .catch((e) => this.handleError(e));
    }

    delete(path, params) {
        this.currentUrl = path;
        return this.service
            .request({
                method: 'DELETE',
                url: path,
                params: params,
                headers: this.getHeader()
            })
            .then((response) => {
                response?.data?.token && setJWTToken(response?.data?.token);
                return response?.data || response;
            })
            .catch((e) => this.handleError(e));
    }

    post(path, payload, options = {}, contentType = null) {
        return this.service
            .request(this.getRequestObject('POST', path, payload, options, contentType))
            .then((response) => {
                response?.data?.token && setJWTToken(response?.data?.token);  
                response?.data?.token && setRole(response?.data?.role);
                return response?.data || response;
            })
            .catch((e) => {
                console.log(e?.response?.data,"resp")
                let resObj
                if(e?.response?.data?.error){
                     resObj = {
                        status: e?.response?.data?.code,
                        message: e?.response?.data?.error?.message,
                    };
                }
                else if(e?.response?.data?.message){
                    resObj = {
                        status: e?.response?.data?.status,
                        message: e?.response?.data?.message,
                    };
                }
                else{
                     resObj = {
                        status: e?.response?.status,
                        data: e?.response?.data,
                    };
                }
                
                console.log(resObj,"err obj")
                return this.handleError(resObj);
            });
    }

    getRequestObject = (
        method,
        path,
        payload,
        options,
        contentType
    ) => {
        this.currentUrl = path;
        return {
            method: method,
            url: path,
            responseType: options?.responseType || 'json',
            data: payload,
            headers: this.getHeader(contentType)
        };
    };

    handleError = (error) => {
        return Promise.reject(this.getFormattedError(error));
    };
}

const apiServiceInst = new ApiService();

export default apiServiceInst;