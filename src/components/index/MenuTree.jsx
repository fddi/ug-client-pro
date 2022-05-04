import React, { useState, useEffect } from 'react';
import { Menu, } from 'antd';
import { Icon } from '../common/PreIcon';
import StringUtils from '../../util/StringUtils';
const SubMenu = Menu.SubMenu;

export default function MenuTree(props) {

     const [selectedKeys, setSelectedKeys] = useState([]);
     useEffect(() => {
          if (props.activeMenu) {
               setSelectedKeys([`menu-tree-${props.activeMenu.key}`]);
          }
     }, [props.activeMenu]);

     function getItems(menus) {
          const items = [];
          for (var i = 0; menus != null && i < menus.length; i++) {
               items.push(getNode(menus[i]));
          }
          return items;
     }

     function getNode(menu) {
          if (menu.type === "5") {
               return;
          }
          let menuTree = menu.children;
          if (StringUtils.isEmpty(menuTree) || menuTree.length === 0) {
               return (<Menu.Item key={"menu-tree-" + menu.key} >
                    <Icon type={menu.icon} />
                    <span className="nav-text">{menu.title}</span>
               </Menu.Item>);
          }
          return (<SubMenu key={"menu-tree-" + menu.key}
               title={<span><Icon type={menu.icon} />
                    <span className="nav-text">{menu.title}</span></span>}>
               {getItems(menuTree)}
          </SubMenu>
          );
     }

     return (
          <Menu
               theme="dark"
               mode={props.mode}
               onSelect={props.onSelect}
               selectedKeys={selectedKeys}
          >
               {getItems(props.menus)}
          </Menu>
     );
}