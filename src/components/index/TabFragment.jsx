import React, { useState, useEffect } from 'react';
import { Button, Tabs, Popconfirm } from 'antd';
import { ClearOutlined } from '@ant-design/icons'
import Loadable from 'react-loadable'
import Workbench from '../../page/WorkBench'
import TabProvider from './TabProvider';
import StringUtils from '../../util/StringUtils';
import RoutesIndex from '../../router/RouteIndex';
import Redirect404 from '../../page/Redirect404';
import Hold from '../../page/Hold';
import { lag } from '../../config/lag'
let localPages = [];
const TabPane = Tabs.TabPane;

export default function TabFragment(props) {
    const [menu, addMenu] = useState();
    const [pages, setPages] = useState([]);
    const [activeKey, setActiveKey] = useState();
    const [popVisible, setPopVisible] = useState(false);

    useEffect(() => {
        addMenu(props.activeMenu)
    }, [props.activeMenu]);

    useEffect(() => {
        if (menu && menu.key === 0) {
            setActiveKey("tab-main-default")
            return;
        }
        let geted = false;
        if (StringUtils.isEmpty(menu) || StringUtils.isEmpty(menu.value)) {
            return
        }
        for (var i = 0; i < localPages.length; i++) {
            if (menu.key === localPages[i].key) {
                geted = true;
                break;
            }
        }
        if (geted) {
            setActiveKey("tab-main-" + menu.key)
            return;
        }
        localPages.push(menu);
        setPages(localPages)
        setActiveKey("tab-main-" + menu.key)
    }, [menu])

    function addTabPage(menu) {
        addMenu(menu)
    }

    const onTabEdit = (targetKey, action) => {
        if (action !== "remove") {
            return;
        }
        let newPages = [];
        let preIndex = 0;
        localPages.forEach((item, index) => {
            if (targetKey == ("tab-main-" + item.key)) {
                preIndex = index - 1;
            }
            else {
                newPages.push(item);
            }
        });
        const preActiveKey = preIndex >= 0 ? `tab-main-${localPages[preIndex].key}` : "tab-main-default";
        let key = activeKey === targetKey ? preActiveKey : activeKey
        localPages = newPages;
        setPages(localPages)
        onChange(key);
    }

    const clearTabs = () => {
        localPages = [];
        setPages([]);
        setPopVisible(false)
        onChange("tab-main-default")
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
            const pane = (<TabPane tab={(<span style={{ userSelect: 'none', }}>{item.label}</span>)}
                key={"tab-main-" + item.key} closable={true}
                style={{ height: '86vh', overflowY: "auto", overflowX: "hidden", }}>
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
            let path = menu.value;
            if (!StringUtils.isEmpty(path)) {
                let end = path.indexOf("?") > 0 ? path.indexOf("?") : path.length;
                path = path.substring(0, end);
            }
            for (let index = 0; index < RoutesIndex.routes.length; index++) {
                const route = RoutesIndex.routes[index]
                if (route.path === path) {
                    component = route.component
                    break
                }
            }
        }
        if (component == null) {
            LoadableComponent = Redirect404
            switch (menu.type) {
                case '2':
                    LoadableComponent = Loadable({
                        loader: () => import(`../../page/RemoteIframe`),
                        loading: Hold
                    })
                    break;
                case '3':
                    LoadableComponent = Loadable({
                        loader: () => import(`../../page/RemoteMirco`),
                        loading: Hold
                    })
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

    function onChange(activeKey) {
        if (props.onChange) {
            props.onChange(activeKey)
        } else {
            setActiveKey(activeKey)
        }
    }

    return (
        <Tabs
            hideAdd
            type="editable-card"
            onChange={onChange}
            onEdit={onTabEdit}
            activeKey={activeKey}
            tabBarStyle={{ margin: 0 }}
            className="tabs-page"
            tabBarExtraContent={
                <Popconfirm
                    placement="left"
                    title={lag.confirmClearTabs}
                    visible={popVisible}
                    onConfirm={clearTabs}
                    onCancel={() => setPopVisible(false)}
                >
                    <Button type='link' icon={<ClearOutlined />}
                        onClick={() => setPopVisible(true)} style={{ marginRight: 12, }} />
                </Popconfirm>
            }
        >
            <TabPane tab={(<span style={{ userSelect: 'none', }}>工作台</span>)}
                key="tab-main-default" closable={false}
                style={{ height: '86vh', overflowY: "auto", overflowX: "hidden" }}>
                <Workbench addTabPage={addTabPage} />
            </TabPane>
            {renderTabPanes(pages)}
        </Tabs>
    )
}