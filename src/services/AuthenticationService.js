import { CONSTANT } from '../helpers/constant'
import { jsonToQueryString } from '../helpers/index'

export const AuthenticationService = {
    fetchApi, fetchRequest
}

async function fetchApi(params) {
    const header = jsonToQueryString(params);
    const url = 'api.php';
    let config = {
        headers: header,
        method: 'GET',
        credentials: 'same-origin'
    };


    return fetch(CONSTANT.KEY_API_URL + url + "?" + jsonToQueryString(params), config)
        .then(response => {
            return response;
        }).then(response => response.json());
}


async function fetchRequest(params) {
    const header = jsonToQueryString(params);
    const url = 'api.php';
    let config = {
        headers: header,
        method: 'GET',
        credentials: 'same-origin'
    };


    return fetch(CONSTANT.KEY_API_URL + url + "?" + jsonToQueryString(params), config)
        .then(response => response).then(response => response.json());
}
