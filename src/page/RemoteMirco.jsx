import React, { useEffect } from 'react'
import { loadMicroApp } from 'qiankun';
import Hold from './Hold'

export default function RemoteMirco(props) {
     useEffect(() => {
          props.item && loadMicroApp({
               name: props.item.title,
               entry: props.item.value,
               container: `#container-${props.item.key}`
          });
     }, [])
     return (
          <div style={{ border: 'none', height: 'calc(100vh - 110px)', width: '100%' }}
               id={`container-${props.item.key}`}>
               <Hold />
          </div>
     );
}