import React, { useState } from 'react';
import { Table, Input, Avatar, Form, Card } from 'antd';
import StringUtils from '../../util/StringUtils';
import { post, getImgUrl } from "../../config/client";
import { useAntdTable, useUpdateEffect } from 'ahooks';
async function queryData({ current, pageSize }, formData, modules, extraItem) {
    const addParams = {
        pageSize: pageSize,
        pageNo: current - 1,
        ...modules.params,
        ...formData
    }
    if (!StringUtils.isEmpty(modules.extra)) {
        if (StringUtils.isEmpty(extraItem)) {
            return {
                total: 0,
                list: []
            }
        }
        const key = modules.extra.rowKey;
        const searchKey = StringUtils.isEmpty(modules.extra.searchKey) ? key : modules.extra.searchKey;
        addParams[searchKey] = extraItem[key]
    }
    return post(modules.queryApi, addParams).then((result) => {
        if (modules.pageable === false) {
            return {
                list: result.resultData && result.resultData,
            }
        } else {
            return {
                total: result.resultData && result.resultData.totalElements,
                list: result.resultData && result.resultData.content,
            }
        }
    });
}

function filterCols(columns) {
    if (columns === null) {
        return null;
    }
    let cols = [];
    columns.forEach(item => {
        if ('hidden' !== item.inputType && 'hidden' !== item.colsType) {
            if (item.inputType === "logo") {
                item.render = (text, record) => {
                    return text ? (<Avatar size={40} src={getImgUrl(text)} />) : null
                };
            }
            cols.push(item)
        }
    });
    return cols;
}

/**
 * 数据展示 表格控件
 * **/
export default function AsyncTable(props) {
    const [keys, setKeys] = useState([]);
    const [form] = Form.useForm();
    const { modules, extraItem } = props;
    const { tableProps, search } = useAntdTable((obj, formData) => queryData(obj, formData, modules, extraItem), {
        defaultPageSize: 20,
        form,
    });
    useUpdateEffect(() => {
        search.submit();
        setKeys([])
    }, [modules, extraItem, props.refreshTime])
    useUpdateEffect(() => {
        setKeys([])
    }, [extraItem])
    if (StringUtils.isEmpty(props.modules)) {
        return null;
    }

    function onSelect(selectedRowKeys, row) {
        const { handleSelect } = props;
        setKeys(selectedRowKeys)
        if (modules.selectType == 'checkbox') {
            handleSelect && handleSelect(selectedRowKeys);
        } else {
            handleSelect && handleSelect(row);
        }
    }

    const searchBar = (
        <Form form={form}>
            {StringUtils.isEmpty(modules.searchKey) ? null :
                (<Form.Item name={modules.searchKey} noStyle>
                    <Input.Search
                        style={{ marginBottom: 5 }} allowClear
                        onSearch={search.submit} />
                </Form.Item>)}
        </Form>);
    const pageProp = modules.pageable === false ? { pagination: false } : null;
    return (
        <Card bordered={false} size='small'>
            {searchBar}
            <Table
                style={{ ...props.style }}
                size="small"
                columns={filterCols(modules.columns)}
                rowKey={modules.rowKey}
                onRow={record => {
                    if (modules.selectType === 'checkbox') {
                        return null;
                    }
                    return {
                        onClick: e => { onSelect([record[modules.rowKey]], record) }, // 点击行
                    };
                }}
                bordered
                scroll={{ scrollToFirstRowOnChange: true, ...props.scroll }}
                rowSelection={{
                    columnWidth: 30,
                    type: modules.selectType || 'radio',
                    selectedRowKeys: keys,
                    onChange: (selectedRowKeys, rows) => { onSelect(selectedRowKeys, rows && rows[0]) }
                }}
                {...tableProps}
                {...pageProp}
            />
        </Card>
    );
}