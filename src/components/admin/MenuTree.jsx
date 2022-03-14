import React, { useState } from 'react';
import { Menu, } from 'antd';
import { Icon } from '../common/PreIcon';
import StringUtils from '../../util/StringUtils';
const SubMenu = Menu.SubMenu;

export default function MenuTree(props) {

     const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);

     function getItems(menus) {
          const items = [];
          for (var i = 0; menus != null && i < menus.length; i++) {
               items.push(getNode(menus[i]));
          }
          return items;
     }

     function getNode(menu) {
          if (menu.type == "5") {
               return;
          }
          let menuTree = menu.children;
          if (StringUtils.isEmpty(menuTree) || menuTree.length === 0) {
               return (<Menu.Item key={"menu-tree-" + menu.key} menu={menu}>
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
               onClick={props.menuClick}
          >
               {getItems(props.menus)}
          </Menu>
     );
}