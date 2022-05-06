import React, { useState } from 'react';
import { TreeSelect, } from 'antd';
import { post } from "../../config/client";
import { useRequest, useUpdateEffect } from 'ahooks';

export default function AsyncTreeSelect(props) {
    const [value, setValue] = useState(props.value || '');
    const { data } = useRequest(() => post('data/dict.json',
        { catalog: props.catalog, dictCode: props.dictCode }).then(result => result.resultData),
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
        width: '100%',
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