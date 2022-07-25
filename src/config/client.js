import fetchTo, { objToEncodeParamsStr, objToParamsStr, signData } from '../util/FetchTo'
import StringUtils from '../util/StringUtils';
import getLocalData from './local_data';

const IS_TEST_DATA = true;
const IS_DEV = false;
const TIMEOUT = 30000;
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
    if (txt.indexOf('http') == 0) {
        return txt
    }
}

export function isJsonPath(path) {
    const regx = /\.json$/;
    return regx.test(path);
}

export function getUrlParams(url) {
    if (StringUtils.isEmpty(url)) {
        return null;
    }
    if (url.indexOf('http') === 0) {
        return (new URL(url)).searchParams;
    } else {
        let path = `${document.location.protocol}//${document.location.hostname}:${document.location.port}/${url}`
        return (new URL(path)).searchParams;
    }
}

export async function post(url, param, isSign = true) {
    if (IS_TEST_DATA) {
        return getLocalData(url, param);
    }
    if (IS_DEV) {
    } else {
        if (url && url.indexOf('http') == 0) {
        } else {
            url = `${APIURL}/${url}`;
        }
    }
    if (param instanceof FormData) {
        return fetchTo(fetch(url,
            {
                method: 'POST',
                mode: 'cors',
                body: param,
                headers: {
                    'Accept': 'application/json',
                    'appId': APPID,
                    'token': getAuthInfo().token || ''
                }
            }
        ).then(response => response.json())
            .catch(reason => { return { resultCode: '500', resultMsg: reason.toString() } }), TIMEOUT)
    }
    let bodyStr = JSON.stringify(param);
    let contentType = 'application/json';
    if (isSign) {
        const paramStr = objToEncodeParamsStr(param);
        const sign = signData(objToParamsStr(param), APPKEY)
        bodyStr = paramStr + "&sign=" + encodeURIComponent(sign);
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    return fetchTo(fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'appId': APPID,
            'token': getAuthInfo().token || ''
        }, body: bodyStr,
    }).then(response => response.json())
        .catch(reason => { return { resultCode: '500', resultMsg: reason.toString() } }), TIMEOUT);
}

export async function get(url, param) {
    if (IS_TEST_DATA) {
        return getLocalData(url, param);
    }
    if (IS_DEV) {
    } else {
        if (url && url.indexOf('http') == 0) {
        } else {
            url = `${APIURL}/${url}`;
        }
    }
    url = url + "?" + objToParamsStr(param);
    return fetchTo(fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'token': getAuthInfo().token || ''
        }
    }), TIMEOUT)
        .then((response) => response.json())
}