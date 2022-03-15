import React, { useState, useEffect } from 'react';
import { Menu, Modal, Progress, } from 'antd';
import { UserOutlined, PoweroffOutlined, CloudDownloadOutlined, RollbackOutlined, } from '@ant-design/icons'
import { lag } from '../../config/lag'
import StringUtils from '../../util/StringUtils';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu

export default function HeaderView(props) {
     const [selectedKeys, setSelectedKeys] = useState([]);

     useEffect(() => {
          if (props.menus && props.menus.length > 0) {
               let sk = ["menu-top-" + props.menus[0].key];
               setSelectedKeys(sk);
          }
     }, [])

     function handleMenuClick(e) {
          switch (parseInt(e.key)) {
               case 101:
                    props.linkToLogin();
                    break;
               case 102:
                    break;
               default:
                    props.menuClick(e)
                    break;
          }
     }

     function handleMenuSelect(e) {
          switch (parseInt(e.key)) {
               case 101:
                    break;
               case 102:
                    break;
               default:
                    setSelectedKeys(e.selectedKeys)
                    break;
          }
     }

     function buildItems(menus) {
          const items = [];
          if (StringUtils.isEmpty(menus)) {
               return items;
          }
          for (var i = 0; i < menus.length; i++) {
               items.push(getItem(menus[i]));
          }
          return items;
     }

     function getItem(menu) {
          if (menu.type == "5") {
               return;
          }
          return (<Menu.Item key={"menu-top-" + menu.key} menu={menu}>{menu.title}</Menu.Item>);
     }

     return (
          <div>
               <Menu
                    key="menu-header-1"
                    theme="light"
                    mode="horizontal"
                    style={{ lineHeight: '64px' }}
                    onClick={(e) => { handleMenuClick(e) }}
                    selectedKeys={selectedKeys}
                    onSelect={(e) => { handleMenuSelect(e) }}
               >
                    {buildItems(props.menus)}
                    <SubMenu key="header-sm-1" style={{ float: 'right' }}
                         title={<span><UserOutlined />{props.nickName}</span>}>
                         <Menu.Item key="102">
                              <Link to="/index" replace={true}>
                                   <RollbackOutlined />返回首页</Link></Menu.Item>
                         <Menu.Item key="101"><PoweroffOutlined />退出登录</Menu.Item>
                    </SubMenu>
               </Menu>
          </div>
     );
} 