import React, { useState, useEffect } from 'react';
import { Badge, Col, Menu, Modal, Progress, Row, } from 'antd';
import { UserOutlined, PoweroffOutlined, MessageOutlined, RollbackOutlined, } from '@ant-design/icons'
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
                    break;
               case 102:
                    break;
               case 103:
                    props.linkToLogin();
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
          <Row>
               <Col flex="auto">
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
                    </Menu></Col>
               <Col flex="120px">
                    <Menu
                         key="menu-header-2"
                         theme="light"
                         mode="horizontal"
                         style={{ lineHeight: '64px' }}
                         selectable={false}
                         onClick={(e) => { handleMenuClick(e) }}>
                         <Menu.Item key="101">
                              <Badge count={2} size='small'>
                                   <MessageOutlined />
                              </Badge>
                         </Menu.Item>
                         <SubMenu key="header-sm-1" style={{ float: 'right' }}
                              title={props.nickName}>
                              <Menu.Item key="102">
                                   <Link to="/index" replace={true}><UserOutlined />个人中心</Link></Menu.Item>
                              <Menu.Item key="103"><PoweroffOutlined />退出登录</Menu.Item>
                         </SubMenu>
                    </Menu></Col>
          </Row>
     );
} 