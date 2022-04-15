import React, { useEffect, useState } from 'react';
import { Select, } from 'antd';
import { icons, } from '../common/PreIcon';
import StringUtils from '../../util/StringUtils';
import { post } from "../../config/client";
import { useRequest, useUpdateEffect } from 'ahooks';

export default (props) => {
    const [value, setValue] = useState(props.value || '');
    const { data, loading, run, cancel } = useRequest(post('data/dict-list.json',
        { catalog: props.catalog, dictCode: props.dictCode }),
        { loadingDelay: 1000, manual: true });
    useEffect(() => {
        if (props.catalog !== "icon" && props.catalog !== "TF") {
            loading && cancel();
            run();
        }
    }, [props.catalog, props.dictCode])
    useUpdateEffect(() => {
        setValue(props.value)
    }, [props.value])

    function handleChange(v, opts) {
        setValue(v);
        props.onChange && props.onChange(v, opts);
    }

    function renderOptions(data) {
        const catalog = props.catalog;
        if (StringUtils.isEmpty(catalog)) {
            return (null);
        }
        const itemComs = [];
        switch (catalog) {
            case "icon":
                itemComs.push((<Select.Option value='' key={"icon-nvl"}>
                    无</Select.Option>));
                Object.keys(icons).forEach(item => {
                    itemComs.push((<Select.Option value={item} key={"icon-" + item}>
                        {React.createElement(icons[item])}</Select.Option>));
                });
                break;
            case "TF":
                itemComs.push((<Select.Option value="1" key={"tf-1"}>是</Select.Option>));
                itemComs.push((<Select.Option value="0" key={"tf-0"}>否</Select.Option>));
                break;
            default:
                data.forEach((item) => {
                    itemComs.push((<Select.Option value={item.dictCode}
                        key={"ds-" + item.dictId}>{item.dictName}</Select.Option>));
                })
                break;
        }
        return itemComs;
    }
    const defaultStyle = {
    }
    const autoFocus = props.autoFocus ? true : false;
    return (
        <Select style={{ ...defaultStyle, ...props.style }}
            disabled={props.disabled}
            onChange={handleChange}
            mode={props.mode}
            autoFocus={autoFocus}
            value={value}
            placeholder={props.placeholder}
            showSearch
        >
            {renderOptions(data)}
        </Select>
    )
}