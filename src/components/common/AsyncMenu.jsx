import React, { useState, useEffect } from 'react';
import { Menu, } from 'antd';
import { MenuOutlined, } from '@ant-design/icons';
import { post } from "../../config/client";
import StringUtils from '../../util/StringUtils';
import { useRequest } from 'ahooks';

async function queryData(modules, params) {
    return post(modules.queryApi, { parentKey: 0, ...params }).then((result) => {
        if (result && 200 === result.resultCode) {
            result.resultData && (result.resultData[0].selected = true);
            return result.resultData;
        } else {
            return null;
        }
    });
}

/**
 * 数据菜单控件
 * **/
export default function AsyncMenu(props) {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const { modules, params, refreshTime, handleClick } = props;
    const { data, loading, run, cancel } = useRequest(queryData,
        { loadingDelay: 1000, manual: true });

    useEffect(() => {
        loading && cancel();
        run(modules, params);
    }, [params, refreshTime])

    const key = StringUtils.isEmpty(modules.key) ? "key" : modules.key;
    if (data && data[0].selected === true) {
        setSelectedKeys(["menu-tag-" + data[0][key]])
        handleClick && handleClick(data[0])
    }

    function renderMenuItem(items) {
        const itemComs = [];
        const title = StringUtils.isEmpty(modules.title) ? "请添加标题.." : modules.title;
        items.forEach(item => {
            itemComs.push((<Menu.Item key={"menu-tag-" + item[key]} menu={item}>
                <MenuOutlined />
                <span className="nav-text">{item[title]}</span>
            </Menu.Item>));
        });
        return itemComs;
    }

    function handleSelect(e) {
        setSelectedKeys(e.selectedKeys)
        handleClick && handleClick(e.item.props.menu)
    }
    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onSelect={handleSelect}
            style={{ height: '100%', }}
        >
            {renderMenuItem(data)}
        </Menu>
    );
}