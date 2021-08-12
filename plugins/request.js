// 基于axios封装的请求模块
import axios from 'axios'

export const request = axios.create({
    baseURL: 'http://realworld.api.fed.lagounews.com/'
    // baseURL: 'https://conduit.productionready.io/api'
})

export default ({store}) => {
    // 请求拦截
    request.interceptors.request.use(function (config) {
        const { auth } = store.state
        if(auth && auth.token){
            config.headers.Authorization = `Token ${auth.token}`
        }
        return config;
    }, function (error) {
        // 请求还没有发出去 错误会进去这里
        return Promise.reject(error);
    });

    request.interceptors.response.use(function (response) {
        return response;
    }, function (error) {

        return Promise.reject(error);
    });

}

