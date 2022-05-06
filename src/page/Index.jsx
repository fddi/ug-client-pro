import React, { useState } from 'react';
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
    if (localSearch && menuTree.all) {
        for (let i = 0; i < menuTree.all.length; i++) {
            if (key == menuTree.all[i].key) {
                menuTree.left = menuTree.all[i].children;
                break;
            }
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(menuTree);
            }, 1000);
        });
    }
    return post('data/menu.json').then((result) => {
        if (result && result.resultCode === 200) {
            const data = result.resultData.children;
            let menu1 = JSON.stringify(data);
            menu1 = JSON.parse(menu1);
            menu1 = menu1.map(item => {
                item.children = null;
                return item;
            })
            let menu2 = [];
            if (!StringUtils.isEmpty(data) && data.length > 0) {
                menu2 = data[0].children;
            }
            menuTree = { all: data, top: menu1, left: menu2 };
            ArrayUtils.treeToArray({ key: 0, children: data }, menuList);
        }
        return menuTree;
    })
}
export default function Index() {
    const [jump, setJump] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState();
    const { data, loading, run } = useRequest(queryData, { loadingDelay: 1000 });

    function onChange(activeKey) {
        if (activeKey === "tab-main-default") {
            setActiveMenu({ key: 0 })
        } else {
            activeKey = activeKey.substr("tab-main-".length);
            const menu = menuList.find(
                item => (item.key == activeKey));
            menu && setActiveMenu(menu)
        }
    }

    function onTopMenuSelect(e) {
        run(true, e.key);
    }

    function onSelect(e) {
        const menu = menuList.find(item => item.key == e.key);
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
                <MenuTree onSelect={onSelect} mode='inline'
                    menus={data && data.left} collapsed={collapsed} activeMenu={activeMenu} />
            </Sider>
            <Layout>
                <Header className="header">
                    <MainHeader nickName={`demo`} linkToLogin={linkToLogin}
                        menus={data && data.top} onSelect={onTopMenuSelect} />
                </Header>
                <Content className="content">
                    <TabFragment activeMenu={activeMenu} onChange={onChange} />
                </Content>
            </Layout>
        </Layout>
    </Spin>)
}