const StringUtils = {
  isEmpty: function (str) {
    if (str === null || str === undefined || str === "" || str === "null" || str === "undefined" || JSON.stringify(str) == "{}")
      return true;
    if (str.length === 0)
      return true;
    return false;
  },
  clear: function (str) {
    if (this.isEmpty(str)) {
      return "";
    }
    return str;
  },
  getDiskSizeByUnit: function (size) {
    if (this.isEmpty(size) || size <= 0) {
      return '0Byte';
    }
    if (size < 1024) {
      return `${size}byte`;
    }
    if (size < 1024 * 1024) {
      size = Math.round(parseInt(size) / 1024);
      return `${size}KB`;
    }
    if (size < 1024 * 1024 * 1024) {
      size = Math.round(parseInt(size) / 1024 / 1024);
      return `${size}MB`;
    }
    size = Math.round(parseInt(size) / 1024 / 1024 / 1024);
    return `${size}GB`;
  },
}

export default StringUtils;