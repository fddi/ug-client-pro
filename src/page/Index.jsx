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
import ArrayUtils from '../util/ArrayUtils';
const { Header, Content, Sider } = Layout
let menuTree;
let menuList = []
async function queryData(localSearch, key) {
    if (localSearch && menuTree.top) {
        for (let i = 0; i < menuTree.top.length; i++) {
            if (key === "menu-top-" + menuTree.top[i].key) {
                menuTree.left = menuTree.top[i].children;
                break;
            }
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(menuTree);
            }, 1000);
        });
    }
    return post('data/menu.json').then((result) => {
        if (result && result.resultCode === 200) {
            const menu1 = result.resultData.children;
            let menu2 = [];
            if (!StringUtils.isEmpty(menu1) && menu1.length > 0) {
                menu2 = menu1[0].children;
            }
            menuTree = { top: menu1, left: menu2 };
            ArrayUtils.treeToArray({ key: 0, children: menu1 }, menuList);
        }
        return menuTree;
    })
}
export default function Index(props) {
    const [jump, setJump] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState();
    const { data, loading, run } = useRequest(queryData, { loadingDelay: 1000 });
    function handleMenuClick(e) {
        if (e.key.indexOf("menu-top-") >= 0) {
            run(true, e.key);
        }
        const menu = menuList.find(
            item => (("menu-tree-" + item.key) === e.key || ("menu-top-" + item.key) === e.key));
        setActiveMenu(menu)
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
                    menus={data && data.left} collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header className="header">
                    <MainHeader nickName={`demo`} linkToLogin={() => linkToLogin()}
                        menus={data && data.top} menuClick={(e) => handleMenuClick(e)} />
                </Header>
                <Content className="content">
                    <TabFragment activeMenu={activeMenu} />
                </Content>
            </Layout>
        </Layout>
    </Spin>)
}