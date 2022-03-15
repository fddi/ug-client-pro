import React, { useState, useEffect } from 'react';
import {
    Navigate
} from 'react-router-dom';
import { Layout, Spin, } from 'antd';
import { APPNMAE, TAG } from '../config/client'
import StringUtils from '../util/StringUtils'
import MenuTree from '../components/index/MenuTree'
import MainHeader from '../components/index/MainHeader'
import logo from '../asset/icon.png'
import TabFragment from '../components/index/TabFragment';
import FetchTo from '../util/FetchTo';
export default function Index(props) {
    const [jump, setJump] = useState(false);
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [menuTree, setMenuTree] = useState();
    const [activeMenu, setActiveMenu] = useState();

    useEffect(() => {
        setLoading(true)
        FetchTo(fetch('data/menu.json', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        }), 120000).then(response => response.json())
            .then(result => {
                if (result && result.resultCode === '200') {
                    const menu1 = result.resultData.children;
                    let menu2 = [];
                    if (!StringUtils.isEmpty(menu1) && menu1.length > 0) {
                        menu2 = menu1[0].children;
                    }
                    setMenuTree({ top: menu1, left: menu2 })
                    setLoading(false)
                }
            })
    }, []);

    function handleMenuClick(e) {
        let tree = menuTree;
        if (e.key.indexOf("menu-top-") >= 0) {
            for (let i = 0; i < menuTop.length; i++) {
                if (e.key === "menu-top-" + menuTop[i].key) {
                    tree = menuTop[i].children;
                    setMenuTree(tree)
                    break;
                }
            }
        }
        setActiveMenu(e.item.props.menu)
    }

    function linkToLogin() {
        sessionStorage.clear();
        setJump(true)
    }

    if (jump) {
        return (<Navigate to="/login" replace />);
    }
    return (<Spin spinning={loading}>
        <Layout>
            <Sider
                className="main-sider"
                width={200}
                collapsible
                collapsed={collapsed}
                onCollapse={(c) => setCollapsed(c)}
                id="menu_sider"
            >
                <div className="logo">
                    <img alt={'logo'} src={logo} />
                    <h1>
                        {APPNMAE}
                    </h1>
                </div>
                <MenuTree menuClick={(e) => handleMenuClick(e)} mode='inline'
                    menus={menuTree && menuTree.left} collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header className="header">
                    <MainHeader nickName={`demo`} linkToLogin={() => linkToLogin()}
                        menus={menuTree && menuTree.top} menuClick={(e) => handleMenuClick(e)} />
                </Header>
                <Content className="content">
                    <TabFragment activeMenu={activeMenu} />
                </Content>
            </Layout>
        </Layout>
    </Spin>)
}