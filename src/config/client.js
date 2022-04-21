import fetchTo, { objToEncodeParamsStr, objToParamsStr, signData } from '../util/FetchTo'

const timeout = 30000;
export const APIURL = "http://localhost";
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

export function getImgUrl(txt) {
    const v = new Date().getTime();
    if (txt.indexOf('http') == 0) {
        return `${txt}${txt.indexOf('?') > 0 ? '&' : '?'}v=${v}`
    }
    return `${APIURL + "/img"}?key=${txt}&v=${v}`
}

export function getFileUrl(txt) {
    const v = new Date().getTime();
    if (txt.indexOf('http') == 0) {
        return `${txt}${txt.indexOf('?') > 0 ? '&' : '?'}v=${v}`
    }
    return `${APIURL + "/file"}?key=${txt}&v=${v}`
}

export async function post(url, param, isSign = true) {
    const regx = /\.json$/;
    if (regx.test(url)) {
        return get(url, param)
    }
    if (param && param instanceof FormData && isSign === false) {
        return fetchTo(fetch(url,
            {
                method: 'POST',
                mode: 'cors',
                body: param,
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
    }).then(response => response.json()), timeout);
}

export async function get(url, param) {
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