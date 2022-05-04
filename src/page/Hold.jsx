import React from 'react'
import { Skeleton } from 'antd'

export default function Hold() {
     return (
          <div style={{ padding: 30 }}>
               <Skeleton active paragraph={{ rows: 12 }} />
          </div>
     );
}