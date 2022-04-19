import React, { useState, useEffect } from 'react';
import {
    Navigate
} from 'react-router-dom';
import { Layout, Spin, } from 'antd';
import { useRequest } from 'ahooks';
import { APPNMAE, post } from '../config/client'
import StringUtils from '../util/StringUtils'
import MenuTree from '../components/index/MenuTree'
import MainHeader from '../components/index/MainHeader'
import logo from '../asset/icon.png'
import TabFragment from '../components/index/TabFragment';
const { Header, Content, Sider } = Layout
export default function Index(props) {
    const [jump, setJump] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState();

    const { data, loading } = useRequest(() => post('data/menu.json'), { loadingDelay: 1000 });
    console.log(data)
    let menuTree;
    if (data && data.resultCode === 200) {
        const menu1 = data.resultData.children;
        let menu2 = [];
        if (!StringUtils.isEmpty(menu1) && menu1.length > 0) {
            menu2 = menu1[0].children;
        }
        menuTree = { top: menu1, left: menu2 };
    }

    function handleMenuClick(e) {
        let tree = menuTree;
        if (e.key.indexOf("menu-top-") >= 0) {
            for (let i = 0; i < menuTree.top.length; i++) {
                if (e.key === "menu-top-" + menuTree.top[i].key) {
                    tree.left = menuTree.top[i].children;
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