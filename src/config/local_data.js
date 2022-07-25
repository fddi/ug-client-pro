import fetchTo from '../util/FetchTo'
import { getAuthInfo } from './client'
export default async function getLocalData(url, params) {
    return fetchTo(fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'token': getAuthInfo().token || ''
        }
    }), 3000)
        .then((response) => response.json())
        .then(result => {
            if (url.indexOf('dict') > 0) {
                const data = searchDict(params, result.resultData)
                const table = params.table;
                if (table && data) {
                    result.resultData = {};
                    result.resultData.content = data.children
                    result.resultData.totalElements = data.length
                } else if (url.indexOf('tree') > 0) {
                    result.resultData = data;
                } else {
                    result.resultData = data.children;
                }
                return result
            }
            return result
        })
}

function searchDict(params, data) {
    const dictCode = params.dictCode;
    if (data['value'] == dictCode) {
        return data;
    }
    if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
            const item = data.children[i];
            const r = searchDict(params, item);
            if (r) { return r; }
        }
    }
    return null;
}