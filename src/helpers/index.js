
export const toUcFirst = (string) => {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export const jsonToQueryString = (params) => {
    return Object.keys(params).map(function (key) {
        return key + '=' + params[key]
    }).join('&');
}