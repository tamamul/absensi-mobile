

import { CONSTANT } from '../helpers/constant';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { jsonToQueryString } from '../helpers/index';

export async function fetchApi(url, params = {}) {
    try {
        const header = {
            'Access-Control-Allow-Origin': '*',
            'Authorization': await AsyncStorage.getItem(CONSTANT.KEY_TOKEN)
        };

        let config = {
            headers: header,
        };

        const result = await axios.get(CONSTANT.KEY_API_URL + url + "?" + jsonToQueryString(params), config);
        if (result.data.code === CONSTANT.KEY_ERROR_AUTH) {
            let paramsAuth = JSON.parse(await AsyncStorage.getItem(CONSTANT.KEY_SESSION_ID));
            const response = await postApi('auth/login', paramsAuth);
            const res = response.data;
            console.log('response login', response);
            if (res.code == CONSTANT.KEY_SUCCESS) {
                await AsyncStorage.multiSet([
                    [CONSTANT.KEY_TOKEN, res.data.token],
                    [CONSTANT.KEY_USER, JSON.stringify(res.data.user)],
                ]);
                return fetchApi(url, params)
            }
        }
        return result;
    } catch (e) {
        console.log('e', e)
    }
}

export async function postApi(url, params) {
    // const url = '/public/auth/update';
    try {

        // const formData = new FormData();

        // Object.keys(params).map(function (key) {
        //     formData.append(key, params[key]);
        // })

        const token = await AsyncStorage.getItem(CONSTANT.KEY_TOKEN);
        const result = await axios({
            url: CONSTANT.KEY_API_URL + url,
            method: 'POST',
            data: params,
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': token
            }
        });

        if (url != 'auth/login' && result.data.code == CONSTANT.KEY_ERROR_AUTH && token != '') {
            let paramsAuth = JSON.parse(await AsyncStorage.getItem(CONSTANT.KEY_SESSION_ID));
            const response = await postApi('auth/login', paramsAuth);
            const res = response.data;
            console.log('response login', response);
            if (res.code == CONSTANT.KEY_SUCCESS) {
                await AsyncStorage.multiSet([
                    [CONSTANT.KEY_TOKEN, res.data.token],
                    [CONSTANT.KEY_USER, JSON.stringify(res.data.user)],
                ]);
                return postApi(url, params);
            }
        }
        // console.log(`result ${url}`, result);
        return result;
    } catch (e) {
        console.log(`error ${url}`, e.response);
    }
}


export async function fetchCheckAccount(method) {
    const url = 'checkacc.php';

    const formData = new FormData();

    // Object.keys(params).map(function (key) {
    //     formData.append(key, params[key]);
    // })

    return axios({
        url: CONSTANT.KEY_API_URL + url + "?" + jsonToQueryString(method),
        method: 'POST',
        // data: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Basic YnJva2VyOmJyb2tlcl8xMjM='
        }
    });
}