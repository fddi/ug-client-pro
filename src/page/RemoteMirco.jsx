import React from 'react'
import { post } from '../config/client'
import StringUtils from '../util/StringUtils'
import { useRequest } from 'ahooks';
import { loadMicroApp } from 'qiankun';
import Hold from './Hold'

async function queryData(item) {
     let v = item && item.value;
     if (!StringUtils.isEmpty(v) && v.indexOf('http') === 0) {
          item.publishUri = v;
          return new Promise((resolve) => {
               resolve(item);
          });
     }
     return post("hot/info", {
          hotKey: v
     }).then((result) => result.resultData)
}

export default function RemoteMirco(props) {
     useRequest(() => queryData(props.item), {
          loadingDelay: 1000,
          onSuccess: (data) => {
               loadMicroApp({
                    name: data.title,
                    entry: data.publishUri,
                    container: `#container-${props.item.key}`
               });
          }
     })
     return (
          <div style={{ border: 'none', height: 'calc(100vh - 110px)', width: '100%' }}
               id={`container-${props.item.key}`}>
               <Hold />
          </div>
     );
}