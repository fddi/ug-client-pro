import React, { useState } from 'react';
import { Menu } from 'antd';
import { post } from "../../config/client";
import { useRequest } from 'ahooks';

async function queryData(modules) {
    return post(modules.queryApi, { parentKey: 0, ...modules.params }).then((result) => {
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
    const { modules, refreshTime, handleClick } = props;
    const { data } = useRequest(() => queryData(modules),
        {
            loadingDelay: 1000,
            refreshDeps: [modules, refreshTime]
        });

    function handleSelect(e) {
        setSelectedKeys(e.selectedKeys)
        handleClick && handleClick(e.item.props.menu)
    }
    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onSelect={handleSelect}
            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
            items={data}
        />
    );
}