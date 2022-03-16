import React from 'react'
import { Skeleton } from 'antd'
import { lag } from '../config/lag'

export default function Hold(props) {
     return (
          <div style={{ padding: 20, width: "100%", height: "100%", background: '#fff' }}>
               <Skeleton active />
               <Skeleton active />
          </div>
     );
}