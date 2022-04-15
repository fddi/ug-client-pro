import React, { Component } from 'react';
import { Table, Input, Avatar } from 'antd';
import StringUtils from '../../utils/StringUtils';
import Fetch from "../../utils/Fetch";
import client from "../../config/client";
import Auth from "../../functions/Auth";

let token;

export default class TableData extends Component {
    constructor(props) {
        super(props);
        token = client.getAuthInfo().token;
        this.state = {
            loading: false,
            searchValue: '',
            selectedRowKeys: [],
            pagination: {
                pageSize: 20, current: 1, total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['20', '50', '100', '200'],
                showTotal: total => `共${total}项`,
                onShowSizeChange: (current, size) => {
                    const pager = { ...this.state.pagination };
                    pager.current = current;
                    pager.pageSize = size;
                    this.setState({ pagination: pager });
                },
            },
        };
    }

    componentDidMount() {
        const { modules, params } = this.props;
        if (StringUtils.isEmpty(modules.tag)) {
            this.querydata(this.state.pagination, params);
        }
    }

    componentDidUpdate(prevProps, prevStatus) {
        const { modules, params, refreshTime } = this.props;
        if ((prevProps.params !== params) ||
            (!StringUtils.isEmpty(refreshTime) && prevProps.refreshTime !== refreshTime)) {
            if (!StringUtils.isEmpty(modules.searchKey)) {
                params[modules.searchKey] = '';
                this.setState({ searchValue: '' });
            }
            this.querydata(this.state.pagination, params);
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        const { params, modules } = this.props;
        const { searchValue } = this.state;
        if (!StringUtils.isEmpty(modules.searchKey) && !StringUtils.isEmpty(searchValue)) {
            params[modules.searchKey] = searchValue;
        }
        this.querydata(pagination, params);
    }

    onSearch = v => {
        const pager = { ...this.state.pagination };
        pager.current = 1;
        const { params, modules } = this.props;
        if (!StringUtils.isEmpty(modules.searchKey)) {
            params[modules.searchKey] = v;
        }
        this.querydata(pager, params);
    }

    querydata(pager, params) {
        let pageSize = pager.pageSize;
        let pageNo = pager.current - 1;
        const { modules } = this.props;
        const addParams = {
            token,
            pageSize: pageSize,
            pageNo: pageNo,
        }
        const values = { ...params, ...addParams };
        this.setState({ loading: true });
        Fetch.post(client.getApi(modules.queryApi), values, (result) => {
            if (result && 200 === result.resultCode) {
                if (modules.pageable === false) {
                    this.setState({
                        selectedRowKeys: [],
                        list: result.resultList,
                        pagination: false,
                    });
                } else {
                    pager.total = result.resultPage.totalElements;
                    this.setState({
                        selectedRowKeys: [],
                        list: result.resultPage.content,
                        pagination: pager
                    });
                }
            } else {
                this.setState({
                    selectedRowKeys: [],
                    list: [],
                });
            }
            this.setState({ loading: false })
        });
    }

    filterCols(columns) {
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

    onSelect(selectedRowKeys, row) {
        const { handleSelect } = this.props;
        this.setState({ selectedRowKeys });
        handleSelect && handleSelect(selectedRowKeys, row);
    }

    render() {
        const { modules, scroll, style } = this.props;
        const pagination = modules.pageable === false ? false : this.state.pagination;
        const searchBar = () => (<Input.Search
            style={{ marginBottom: 5 }} allowClear
            value={this.state.searchValue}
            onChange={(e) => { this.setState({ searchValue: e.target.value }) }}
            onSearch={this.onSearch} />);
        const header = StringUtils.isEmpty(modules.searchKey) ? false : searchBar;
        return (
            <Table
                style={{ backgroundColor: '#fff', ...style }}
                size="small"
                columns={this.filterCols(modules.columns)}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                dataSource={this.state.list}
                pagination={pagination}
                rowKey={modules.rowKey}
                onRow={record => {
                    if (modules.selectType === 'checkbox') {
                        return null;
                    }
                    return {
                        onClick: e => { this.onSelect([record[modules.rowKey]], record) }, // 点击行
                    };
                }}
                bordered
                title={header}
                scroll={{ y: 420, scrollToFirstRowOnChange: true, ...scroll }}
                rowSelection={{
                    columnWidth: 30,
                    type: modules.selectType || 'radio',
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: (selectedRowKeys, rows) => { this.onSelect(selectedRowKeys, rows && rows[0]) }
                }} />
        );
    }
}