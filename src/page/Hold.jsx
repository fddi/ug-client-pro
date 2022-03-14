import React from 'react'
import { Spin } from 'antd'
import { lag } from '../config/lag'

export default function Hold(props) {
     return (
          <Spin spinning={this.state.spinning} size="large"
               tip={lag.pageLoading}
               style={{ marginTop: 80, width: "100%", height: "60%" }} />
     );
}