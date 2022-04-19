import React, { useState, useEffect } from 'react';
import { Tag, } from 'antd';
import { post } from "../../config/client";
import { useRequest, useUpdateEffect } from 'ahooks';

export default (props) => {
    const [tags, setTags] = useState(props.selectTags || []);
    const { data, loading, run, cancel } = useRequest(() => post('data/dict-list.json',
    { catalog: props.catalog, dictCode: props.dictCode }),
        { loadingDelay: 1000, manual: true });
    useEffect(() => {
        loading && cancel();
        run();
    }, [props.catalog, props.dictCode])
    useUpdateEffect(() => {
        setTags(selectTags)
    }, [props.selectTags])

    function handleChange(tag, checked) {
        const nextSelectedTags = checked ? [...tags, tag.dictCode] : tags.filter(t => t !== tag.dictCode);
        setTags(nextSelectedTags);
        props.onChange && props.onChange(nextSelectedTags);
    }

    const defaultStyle = {
    }
    return (
        <span
            style={{ ...defaultStyle, ...this.props.style }}
        >
            {data && data.map((tag, index) => {
                return (<Tag.CheckableTag key={`tag-${index}`} style={{ fontSize: '0.9em' }}
                    checked={tags.indexOf(tag.dictCode) > -1}
                    onChange={(checked) => { handleChange(tag, checked) }}
                >{tag.dictName}</Tag.CheckableTag>)
            })}
        </span>
    )
}