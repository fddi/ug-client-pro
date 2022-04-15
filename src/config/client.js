import fetchTo, { objToEncodeParamsStr, objToParamsStr, signData } from '../util/FetchTo'

export const APPID = "ug-client-pro";
export const APPNMAE = "ug-client-pro";
export const APPKEY = "7cb5ab1ee33dba7bbb172ef5c7a5a70fa665c926";
export const LOCATE = "zh_cn";
export const TAG = {
    token: APPID + "-token",
    userName: APPID + "-userName",
    menu: "Menu",
};
export function getAuthInfo() {
    let tokenInfo = sessionStorage.getItem(TAG.token);
    if (tokenInfo === null || tokenInfo === "")
        return {};
    tokenInfo = JSON.parse(tokenInfo);
    return tokenInfo;
}
const timeout = 30000;
export function post(url, param, isSign = true) {
    const regx = /\.json$/;
    if (regx.test(url)) {
        get(url, param)
        return
    }
    if (param && param instanceof FormData) {
        return fetchTo(fetch(url,
            {
                method: 'POST',
                mode: 'cors',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'token': getAuthInfo().token || ''
                }
            }
        ).then(response => response.json()), timeout)
    }
    let bodyStr = JSON.stringify(param);
    let contentType = 'application/json';
    if (isSign) {
        param.appId = APPID;
        const appKey = APPKEY;
        const paramStr = objToEncodeParamsStr(param);
        bodyStr = paramStr + "&sign=" + signData(objToParamsStr(param), appKey);
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    return fetchTo(fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'token': getAuthInfo().token || ''
        }, body: bodyStr,
    }), timeout).then((response) => response.json())
}

export function get(url, param) {
    url = url + "?" + objToParamsStr(param);
    return fetchTo(fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'token': getAuthInfo().token || ''
        }
    }), timeout)
        .then((response) => response.json())
}