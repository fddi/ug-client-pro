import React, { useState, useEffect } from 'react';
import { Badge, Col, Menu, Row, } from 'antd';
import { PoweroffOutlined, MessageOutlined, } from '@ant-design/icons'

export default function HeaderView(props) {
     const [menus, setMenus] = useState();
     const [selectedKeys, setSelectedKeys] = useState([]);

     useEffect(() => {
          if (props.menus && props.menus.length > 0) {
               let sk = [props.menus[0].key + ""];
               setSelectedKeys(sk);
          }
          const newMenus = []
          props.menus && props.menus.forEach(item => {
               if (item.type != '5') {
                    delete item.parentId;
                    newMenus.push(item)
               }
          })
          setMenus(newMenus)
     }, [props.menus])

     function handleMenuSelect(e) {
          switch (parseInt(e.key)) {
               case 101:
                    break;
               case 102:
                    break;
               case 103:
                    break;
               default:
                    setSelectedKeys(e.selectedKeys)
                    props.onSelect && props.onSelect(e)
                    break;
          }
     }

     function handleMenuClick(e) {
          switch (parseInt(e.key)) {
               case 101:
                    break;
               case 102:
                    break;
               case 103:
                    props.logout && props.logout();
                    break;
               default:
                    break;
          }
     }

     return (
          <Row>
               <Col flex="auto">
                    <Menu
                         key="menu-header-1"
                         theme="light"
                         mode="horizontal"
                         style={{ lineHeight: '64px' }}
                         selectedKeys={selectedKeys}
                         onSelect={handleMenuSelect}
                         items={menus}
                    /></Col>
               <Col flex="120px">
                    <Menu
                         key="menu-header-2"
                         theme="light"
                         mode="horizontal"
                         style={{ lineHeight: '64px' }}
                         selectable={false}
                         onSelect={handleMenuSelect}
                         onClick={handleMenuClick}
                         items={[{
                              label: (<Badge count={0} size='small'>
                                   <MessageOutlined />
                              </Badge>),
                              key: '101'
                         }, {
                              label: props.nickName,
                              key: "header-sm-1",
                              children: [{
                                   label: '退出登录',
                                   key: "103",
                                   icon: <PoweroffOutlined />
                              }]
                         }]}
                    />
               </Col>
          </Row>
     );
} 