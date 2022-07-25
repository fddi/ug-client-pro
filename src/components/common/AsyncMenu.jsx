import React, { useState } from 'react';
import { Menu } from 'antd';
import { post } from "../../config/client";
import { useRequest } from 'ahooks';
import { faIcon } from './IconText';

function rebuildData(data) {
    data && data.forEach(item => {
        if (item.icon && typeof item.icon === 'string') {
            const com = faIcon({ name: item.icon });
            item.icon = com;
        }
    })
}

async function queryData(modules) {
    return post(modules.queryApi, { parentKey: 0, ...modules.params }).then((result) => {
        if (result && 200 === result.resultCode) {
            let data = result.resultData
            data && (data[0].selected = true);
            rebuildData(data)
            return data;
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
    const { modules, refreshTime, handleSelect } = props;
    const { data } = useRequest(() => queryData(modules),
        {
            loadingDelay: 1000,
            refreshDeps: [modules, refreshTime]
        });

    function onSelect(e) {
        setSelectedKeys(e.selectedKeys)
        handleSelect && handleSelect({ key: e.key })
    }
    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
            items={data}
        />
    );
}