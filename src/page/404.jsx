import React from 'react';
import Icon404 from '../asset/404.svg'
import { lag } from '../config/lag'

export default function Redirect404(props) {

     return (
          <div style={{ paddingTop: 100, textAlign: "center", height: "100%", background: '#fff' }}>
               <img alt="" src={Icon404} />
               <br />
               <br />
               <p style={{ fontSize: 20, fontWeight: "bold" }}>{lag.loadFail}</p>
          </div>
     );

}
