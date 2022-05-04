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
            console.log(params)
            return result
        })
}