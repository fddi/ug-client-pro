import React, { useState, useEffect } from 'react';
import { Button, Tabs } from 'antd';
import { ClearOutlined } from '@ant-design/icons'
import Loadable from 'react-loadable'
import Workbench from '../../page/WorkBench'
import TabProvider from './TabProvider';
import StringUtils from '../../util/StringUtils';
import RoutesIndex from '../../router/RouteIndex';
import Redirect404 from '../../page/404';
import Hold from '../../page/Hold';

const TabPane = Tabs.TabPane;
export default function TabFragment(props) {
    const [menu, setMenu] = useState();
    const [pages, setPages] = useState([]);
    const [activeKey, setActiveKey] = useState();

    function addTabPage(menu) {
        setMenu(menu)
    }

    useEffect(() => {
        let geted = false;
        if (StringUtils.isEmpty(menu) || StringUtils.isEmpty(menu.value)) {
            return
        }
        for (var i = 0; i < pages.length; i++) {
            if (menu.key === pages[i].key) {
                geted = true;
                break;
            }
        }
        if (geted) {
            setActiveKey("tab-main-" + menu.key)
            return;
        }
        pages.push(menu);
        setPages(pages)
        setActiveKey("tab-main-" + menu.key)
    }, [menu])

    useEffect(() => {
        setMenu(props.activeMenu)
    }, [props.activeMenu]);

    const onTabEdit = (targetKey, action) => {
        if (action !== "remove") {
            return;
        }
        let newPages = [];
        let preIndex = 0;
        pages.forEach((item, index) => {
            if (targetKey == ("tab-main-" + item.key)) {
                preIndex = index - 1;
            }
            else {
                newPages.push(item);
            }
        });
        const preActiveKey = preIndex >= 0 ? `tab-main-${pages[preIndex].key}` : "tab-main-default";
        let key = activeKey === targetKey ? preActiveKey : activeKey
        setPages(newPages)
        setActiveKey(key)
    }

    const clearTabs = () => {
        setPages([]);
        setActiveKey("tab-main-default")
    }

    const removeTabPage = (menu) => {
        onTabEdit(menu.key, 'remove');
    }

    function renderTabPanes(data) {
        let items = [];
        data.forEach(item => {
            let TabPage = item.routeCom
            if (!TabPage) {
                TabPage = findRoute(item)
            }
            const pane = (<TabPane tab={(<span style={{ userSelect: 'none', }}>{item.title}</span>)}
                key={"tab-main-" + item.key} closable={true}
                style={{ height: '84vh', overflowY: "auto", overflowX: "hidden", }}>
                <TabProvider addTabPage={addTabPage}
                    removeTabPage={removeTabPage} >
                    <TabPage item={item} />
                </TabProvider>
            </TabPane>);
            items.push(pane);
        });
        return items;
    }

    function findRoute(menu) {
        let LoadableComponent = (null)
        let component = null
        if (!StringUtils.isEmpty(menu)) {
            for (let index = 0; index < RoutesIndex.routes.length; index++) {
                const route = RoutesIndex.routes[index]
                if (route.path === menu.value) {
                    component = route.component
                    break
                }
            }
        }
        if (component == null) {
            LoadableComponent = Redirect404
            switch (menu.type) {
                case '2':
                    break;
                case '3':
                    break;
                default:
                    break;
            }
        } else {
            LoadableComponent = Loadable({
                loader: () => import(`../../page/${component}`),
                loading: Hold
            })
        }
        menu.routeCom = LoadableComponent;
        return LoadableComponent
    }

    return (
        <Tabs
            hideAdd
            type="editable-card"
            onChange={(key) => setActiveKey(key)}
            onEdit={onTabEdit}
            activeKey={activeKey}
            tabBarStyle={{ margin: 0 }}
            className="tabs-page"
            tabBarExtraContent={<Button type='link' icon={<ClearOutlined />}
                onClick={clearTabs} style={{ marginRight: 12, }} />}
        >
            <TabPane tab={(<span style={{ userSelect: 'none', }}>工作台</span>)}
                key="tab-main-default" closable={false}
                style={{ height: '84vh', overflowY: "auto", overflowX: "hidden" }}>
                <Workbench addTabPage={addTabPage} />
            </TabPane>
            {renderTabPanes(pages)}
        </Tabs>
    )
}