import React, { useState } from 'react';
import { TreeSelect, } from 'antd';
import { post } from "../../config/client";
import { useRequest, useUpdateEffect } from 'ahooks';

export default function AsyncTreeSelect(props) {
    const [value, setValue] = useState(props.value || '');
    const { data } = useRequest(() => post(props.queryApi || 'data/dict-tree.json',
        { catalog: props.catalog, dictCode: props.dictCode }).then(result => {
            if (200 === result.resultCode) {
                const root = result.resultData;
                if (root && root.id == '0') {
                    return root.children || [];
                } else {
                    return root ? [root] : []
                }
            } else {
                return [];
            }
        }),
        {
            loadingDelay: 1000,
            refreshDeps: [props.catalog, props.dictCode]
        });
    useUpdateEffect(() => {
        setValue(props.value)
    }, [props.value])

    function handleChange(v, opts) {
        setValue(v)
        props.onChange && props.onChange(v, opts);
    }

    const defaultStyle = {
    }
    const autoFocus = props.autoFocus ? true : false;
    return (
        <TreeSelect style={{ ...defaultStyle, ...props.style }}
            disabled={props.disabled}
            onChange={handleChange}
            autoFocus={autoFocus}
            treeData={data}
            value={value}
            treeCheckable={props.checkable}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            placeholder={props.placeholder}
            treeDataSimpleMode={true}
            showSearch
            allowClear
        />
    )
}