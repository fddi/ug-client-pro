
import StringUtils from "./StringUtils";
import hmacSHA256 from 'crypto-js/hmac-sha256';

// json to formData
export const jsonToFormData = (json) => {
  const formData = new FormData();
  if (StringUtils.isEmpty(json)) {
    return formData;
  }
  Object.keys(json).sort().forEach(key => {
    let val = json[key];
    formData.append(key, val);
  });
  return formData;
}

export const objToEncodeParamsStr = function (obj) {
  let queryStr = "";
  if (StringUtils.isEmpty(obj)) {
    return queryStr;
  }
  Object.keys(obj).sort().forEach(key => {
    let val = obj[key];
    if (Array.isArray(val)) {
      val = JSON.stringify(val);
    }
    if (!StringUtils.isEmpty(val)) {
      queryStr += encodeURIComponent(key) + '=' + encodeURIComponent(val) + "&";
    }
  });
  if (queryStr.length > 0) {
    queryStr = queryStr.substring(0, queryStr.length - 1);
  }
  return queryStr;
}

export const objToParamsStr = function (obj) {
  let queryStr = "";
  if (StringUtils.isEmpty(obj)) {
    return queryStr;
  }
  Object.keys(obj).sort().forEach(key => {
    let val = obj[key];
    if (Array.isArray(val)) {
      val = JSON.stringify(val);
    }
    if (!StringUtils.isEmpty(val)) {
      queryStr += key + '=' + val + "&";
    }
  });
  if (queryStr.length > 0) {
    queryStr = queryStr.substring(0, queryStr.length - 1);
  }
  return queryStr;
}

export const signData = function (paramsStr, key) {
  const data = paramsStr + "&key=" + key;
  return hmacSHA256(data, key);
}

export default fetchTo = function (fetch_promise, timeout) {
  let abort_fn = null;
  const abort_promise = new Promise((resolve, reject) => {
    abort_fn = () => {
      reject(false);
    };
  });
  const abortable_promise = Promise.race([
    fetch_promise,
    abort_promise
  ]);
  setTimeout(() => {
    abort_fn();
  }, timeout);
  return abortable_promise;
}