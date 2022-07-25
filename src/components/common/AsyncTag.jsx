import React, { useState } from 'react';
import { message, Tag, } from 'antd';
import { post } from "../../config/client";
import { useRequest, useUpdateEffect } from 'ahooks';

async function queryData(catalog, dictCode) {
    return post('data/dict.json', { catalog, dictCode }).then(result => {
        if (result.resultCode == '200') {
            return result.resultData
        } else {
            message.error(result.resultMsg)
            return null
        }
    })
}

export default function AsyncTag(props) {
    const [tags, setTags] = useState(props.selectTags || []);
    const { data } = useRequest(() => queryData(props.catalog, props.dictCode),
        {
            loadingDelay: 1000,
            refreshDeps: [props.catalog, props.dictCode]
        });
    useUpdateEffect(() => {
        setTags(props.selectTags)
    }, [props.selectTags])

    function handleChange(tag, checked) {
        const nextSelectedTags = checked ? [...tags, tag.value] : tags.filter(t => t !== tag.value);
        setTags(nextSelectedTags);
        props.onChange && props.onChange(nextSelectedTags);
    }

    const defaultStyle = {
    }
    return (
        <span
            style={{ ...defaultStyle, ...props.style }}
        >
            {data && data.map((tag, index) => {
                return (<Tag.CheckableTag key={`tag-${index}`} style={{ fontSize: '0.9em' }}
                    checked={tags.indexOf(tag.value) > -1}
                    onChange={(checked) => { handleChange(tag, checked) }}
                >{tag.title}</Tag.CheckableTag>)
            })}
        </span>
    )
}