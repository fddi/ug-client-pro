import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';

export default function MenuTree(props) {

     const [selectedKeys, setSelectedKeys] = useState([]);
     useEffect(() => {
          if (props.activeMenu) {
               setSelectedKeys([props.activeMenu.key + ""]);
          }
     }, [props.activeMenu]);

     return (
          <Menu
               theme="dark"
               mode={props.mode}
               onSelect={props.onSelect}
               selectedKeys={selectedKeys}
               items={props.menus}
          />
     );
}