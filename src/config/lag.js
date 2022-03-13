import { LOCATE } from './client';
import { zh_cn } from './zh_cn';
let param = zh_cn;
switch (LOCATE) {
     case 'zh_cn':
          param = zh_cn;
          break;
     default:
          break;
}

export const lag = param;
