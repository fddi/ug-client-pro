import React, { Fragment } from 'react'
import Redirect404 from './Redirect404'

export default function RemoteIframe(props) {
     return (
          <Fragment>
               {(props.item && props.item.value)
                    ? (<iframe
                         src={props.item.value} title={props.item.title}
                         style={{ border: 'none', height: 'calc(100vh - 110px)', width: '100%' }}></iframe>)
                    : (<Redirect404 />)
               }
          </Fragment>
     );
}