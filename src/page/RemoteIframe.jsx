import React, { Fragment } from 'react'
import Redirect404 from './Redirect404'
import { post } from '../config/client'
import StringUtils from '../util/StringUtils'
import { useRequest } from 'ahooks';
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

export default function RemoteIframe(props) {
     const { data } = useRequest(() => queryData(props.item), { loadingDelay: 1000 })
     return (
          <Fragment>
               {(data && data.publishUri) ? (<iframe
                    src={data.publishUri} title={data.title}
                    style={{ border: 'none', height: '88vh', width: '100%' }}></iframe>) : (<Redirect404 />)}
          </Fragment>
     );
}