import { Card } from 'antd';
import React from 'react';
import Icon404 from '../asset/404.svg'
import { lag } from '../config/lag'

export default function Redirect404(props) {

     return (
          <Card bordered={false} style={{ paddingTop: 100, textAlign: "center", height: "100%" }}>
               <img alt="" src={Icon404} />
               <br />
               <br />
               <p style={{ fontSize: 20, fontWeight: "bold" }}>{lag.error404}</p>
          </Card>
     );

}
