import React, { useState } from 'react';
import { Button } from "antd";
import { RedoOutlined } from '@ant-design/icons';

export default function DataMask(props) {
     const { pressTag, onPress } = props;
     const defaultStyle = {
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex", justifyContent: 'center', alignItems: 'center'
     }
     function onBtnClick() {
          onPress && onPress();
     }

     return (
          <div style={{ ...defaultStyle, ...props.style }}>
               <Button type="primary" onClick={onBtnClick}
                    icon={<RedoOutlined />}>
                    {pressTag}
               </Button>
          </div>
     )
}