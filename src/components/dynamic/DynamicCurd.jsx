import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Space } from 'antd';
import { ReloadOutlined, } from '@ant-design/icons';
import DynamicForm from './DynamicForm';
import StringUtils from '../../util/StringUtils';
import AsyncTable from '../common/AsyncTable';
import AsyncTree from '../common/AsyncTree';
import AsyncMenu from '../common/AsyncMenu';
/**
 * 动态CURD界面
 * 
 * **/
export default (props) => {
    const [params, setParams] = useState(props.params);
    const [extraValue, setExtraValue] = useState();
    const [row, setRow] = useState();
    const [refreshTime, setRefreshTime] = useState(new Date().getTime());

    useEffect(() => {
        const item = {};
        item['parentId'] = '0';
        item['unitCode'] = '';
        const { modules, params } = props;
        const cParams = { ...params };
        if (!StringUtils.isEmpty(modules.extra)) {
            const key = StringUtils.isEmpty(modules.extra.key) ? "key" : modules.extra.key;
            const dataIndex = StringUtils.isEmpty(modules.extra.dataIndex) ? key : modules.extra.dataIndex;
            item[dataIndex] = extraValue;
            params[dataIndex] = extraValue;
            setParams(cParams);
        }
        setRow(item);
    }, [extraValue, props.modules, props.params])

    useEffect(() => {
        setRefreshTime(props.refreshTime)
    }, [props.refreshTime])

    const handleExtraSelect = (item) => {
        const { modules, onExtraSelect } = props;
        const key = StringUtils.isEmpty(modules.extra.key) ? "key" : modules.extra.key;
        if (extraValue !== item[key]) {
            setExtraValue(item[key]);
        }
        onExtraSelect && onExtraSelect(item[key]);
    }

    const onRowSelect = (item) => {
        setRow(item);
        props.handleSelect && props.handleSelect(item);
    }

    const onFinish = () => {
        setRefreshTime(new Date().getTime())
        props.onFinish && props.onFinish();
    }

    let spanForm = 13;
    if (StringUtils.isEmpty(modules.extra)) {
        spanForm += 5;
    }
    if (modules.dataType === "table") {
        spanForm += 6;
    }
    let Extra = (null);
    if (!StringUtils.isEmpty(modules.extra)) {
        //数据分类标签控件 支持菜单和树形菜单
        switch (modules.extra.type) {
            case "tree":
                Extra = (
                    <Col span={5} style={{ paddingTop: 5, borderRight: "1px solid #ccc", backgroundColor: "#fff" }}>
                        <AsyncTree modules={modules.extra} refreshTime={refreshTime}
                            params={params} handleSelect={handleExtraSelect} />
                    </Col>);
                break;
            case "menu":
                Extra = (
                    <Col span={5} style={{ height: '100%', }}>
                        <AsyncMenu modules={modules.extra} refreshTime={refreshTime}
                            params={params} handleSelect={handleExtraSelect} />
                    </Col>);
                break;
            default:
                break;
        }
    }
    let TreeData = (null);
    let TableData = (null);
    switch (modules.type) {
        //数据展示控件 支持树和表格
        case "tree":
            TreeData = (
                <Col span={6} style={{ paddingTop: 5, backgroundColor: "#fff" }}>
                    <AsyncTree modules={modules} refreshTime={refreshTime}
                        params={params} handleSelect={onselect} />
                </Col>);
            break;
        case "table":
            TableData = (
                <AsyncTable style={{ marginLeft: 5, marginRight: 5 }}
                    modules={modules} refreshTime={refreshTime}
                    params={params} handleSelect={onselect}
                    scroll={{ x: 600, y: 210 }} />);
            break;
        default:
            break;
    }
    return (
        <Fragment>
            <Space style={{
                backgroundColor: "#fff",
                padding: 10,
                marginBottom: 5,
                width: '100%'
            }} size="small">
                <Button style={{ marginRight: 5, }} icon={<ReloadOutlined />}
                    onClick={onFinish}>重载</Button>
                {props.actions && props.actions.map((Com, index) => {
                    return <Fragment key={`action-${index}`}>{Com}</Fragment>
                })}
            </Space>
            <Row gutter={[8, 8]} style={{ flex: '1', height: '76vh', ...style }}>
                {Extra}
                {TreeData}
                <Col span={spanForm} style={{ overflowY: "auto" }}>
                    {TableData}
                    <DynamicForm modules={modules} style={{ margin: 5 }}
                        row={row} onFinish={onFinish} />
                </Col>
            </Row>
        </Fragment>
    );
}