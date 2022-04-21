import React, { Fragment, useState, useEffect } from 'react';
import { Tree, Input, message, } from 'antd';
import { post } from "../../config/client";
import StringUtils from '../../util/StringUtils';
import ArrayUtils from '../../util/ArrayUtils';
import { useRequest } from 'ahooks';
let dataList = []
let allRoot;
function searchTree(value) {
    if (StringUtils.isEmpty(value)) {
        return allRoot;
    }
    let selectItems = [];
    for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        const lv = item.title.toUpperCase();
        const vv = StringUtils.isEmpty(item.value) ? null : item.value.toUpperCase();
        const rv = value.toUpperCase();
        if (lv.indexOf(rv) >= 0) {
            selectItems.push(item)
        } else if (vv && vv.indexOf(rv) >= 0) {
            selectItems.push(item)
        }
    }
    let root = null;
    if (selectItems.length > 0) {
        root = { key: 0, children: selectItems };
    }
    return root;
}

async function queryData(modules, params, localSearch = false, v) {
    if (localSearch) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(searchTree(v));
            }, 1000);
        });
    } else {
        return post(modules.queryApi, { parentKey: 0, ...params }).then((result) => {
            if (result && 200 === result.resultCode) {
                const root = result.resultData;
                allRoot = result.resultData;
                ArrayUtils.treeToArray(root, dataList);
                return root;
            } else {
                return null;
            }
        });
    }
}

/**
 * 数据展示 树形控件
 * **/
export default (props) => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const { modules, params, refreshTime } = props;
    const { data, loading, run, cancel } = useRequest(() => queryData(modules, params),
        { loadingDelay: 1000, manual: true });
    useEffect(() => {
        loading && cancel();
        run(modules, params);
        return () => {
            dataList = []
            allRoot = null;
        }
    }, [params, refreshTime])

    const handleSelect = (keys, e) => {
        const { handleSelect } = props;
        const item = e.node.item;
        if (!StringUtils.isEmpty(item.key) && item.key != 0) {
            handleSelect && handleSelect(item);
        }
        setSelectedKeys(keys)
    }

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys)
    };

    const onChange = e => {
        setSelectedKeys([]); setExpandedKeys([]);
        const { value } = e.target;
        run(modules, params, true, value);
    };

    const onDrop = info => {
        const dragNode = info.dragNode.props.item;
        if (dragNode.children != null && dragNode.children.length > 0) {
            message.warn("只能移动叶子节点数据！");
            return;
        }
        const dropNode = info.node.props.item;
        const dropKey = info.dropToGap ? dropNode.parentKey : dropNode.key;
        if (dropKey == dragNode.parentKey) {
            return;
        }
        if (StringUtils.isEmpty(modules.dragDropApi)) {
            return;
        }
        post(modules.dragDropApi, {
            dragKey: dragNode.key,
            dropKey
        }).then((result) => {
            if (result && 200 === result.resultCode) {
                run(modules, params);
            }
        })
    }

    const height = window.innerHeight - 240;
    return (
        <Fragment>
            <Input.Search
                allowClear
                style={{ marginBottom: 5 }}
                onChange={onChange} />
            <Tree.DirectoryTree
                expandAction={false}
                height={height}
                onSelect={handleSelect}
                showLine={false}
                selectedKeys={selectedKeys}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={true}
                draggable
                onDrop={onDrop}
                blockNode={true}
                treeData={data}
                titleRender={(nodeData) => {
                    let title = nodeData.title;
                    if (modules.showVal) {
                        title += "[" + nodeData.value + "]";
                    }
                    if (nodeData.status == "0") {
                        title = (<s>{title}</s>);
                    }
                    return ({ title })
                }}
            />
        </Fragment>
    );
}