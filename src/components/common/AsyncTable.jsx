import React, { useState } from 'react';
import { Table, Input, Avatar, Form } from 'antd';
import StringUtils from '../../util/StringUtils';
import { post } from "../../config/client";
import { useAntdTable, useUpdateEffect } from 'ahooks';
async function queryData({ current, pageSize }, formData, params, modules) {
    const addParams = {
        pageSize: pageSize,
        pageNo: current,
        ...formData,
        ...params
    }
    return post(modules.queryApi, addParams).then((result) => ({
        total: result.resultData && result.resultData.totalElements,
        list: result.resultData && result.resultData.content,
    }));
}

function filterCols(columns) {
    if (columns === null) {
        return null;
    }
    let cols = [];
    columns.forEach(item => {
        if ('hidden' !== item.inputType && 'hidden' !== item.colsType) {
            if (item.inputType === "logo") {
                item.render = (text, record) => { return text ? (<Avatar size={40} src={Auth.getImgUrl(text)} />) : null };
            }
            cols.push(item)
        }
    });
    return cols;
}

/**
 * 数据展示 表格控件
 * **/
export default (props) => {
    const [keys, setKeys] = useState([]);
    const [form] = Form.useForm();
    const { modules } = props;
    const { tableProps, search, params } = useAntdTable((obj, formData) => queryData(obj, formData, props.params, modules), {
        defaultPageSize: 20,
        form,
    });

    useUpdateEffect(() => {
        search.submit();
    }, [props.params, props.refreshTime])

    function onSelect(selectedRowKeys, row) {
        const { handleSelect } = props;
        setKeys(selectedRowKeys)
        handleSelect && handleSelect(selectedRowKeys, row);
    }

    const searchBar = () => (
        <Form form={form}>
            <Form.Item name={modules.searchKey}>
                <Input.Search
                    style={{ marginBottom: 5 }} allowClear
                    onSearch={search.submit} />
            </Form.Item>
        </Form>);
    const header = StringUtils.isEmpty(modules.searchKey) ? false : searchBar;
    return (
        <Table
            style={{ backgroundColor: '#fff', ...props.style }}
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
            title={header}
            scroll={{ y: 420, scrollToFirstRowOnChange: true, ...scroll }}
            rowSelection={{
                columnWidth: 30,
                type: modules.selectType || 'radio',
                selectedRowKeys: keys,
                onChange: (selectedRowKeys, rows) => { onSelect(selectedRowKeys, rows && rows[0]) }
            }}
            {...tableProps}
        />
    );
}