import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, Space, Card } from 'antd';
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
export default function DynamicCurd(props) {
    const [extraItem, setExtraItem] = useState();
    const [row, setRow] = useState();
    const [refreshTime, setRefreshTime] = useState(new Date().getTime());
    useEffect(() => {
        props.refreshTime && setRefreshTime(props.refreshTime)
    }, [props.refreshTime])
    if (StringUtils.isEmpty(props.modules)) {
        return null;
    }
    const handleExtraSelect = (item) => {
        setExtraItem(item)
        props.onExtraSelect && props.onExtraSelect(item);
    }

    const onRowSelect = (item) => {
        setRow(item);
        props.handleSelect && props.handleSelect(item);
    }

    const onFinish = () => {
        setRefreshTime(new Date().getTime())
        props.onFinish && props.onFinish();
    }
    const { modules } = props;
    let spanForm = 13;
    if (StringUtils.isEmpty(modules.extra)) {
        spanForm += 5;
    }
    if (modules.type === "table") {
        spanForm += 6;
    }
    let Extra = (null);
    if (!StringUtils.isEmpty(modules.extra)) {
        //查询分类标签控件 支持菜单和树形菜单
        switch (modules.extra.type) {
            case "tree":
                Extra = (
                    <Col span={5} style={{ height: '100%', overflowY: 'auto' }}>
                        <AsyncTree modules={modules.extra} refreshTime={refreshTime}
                            handleSelect={handleExtraSelect} />
                    </Col>);
                break;
            case "menu":
                Extra = (
                    <Col span={5} style={{ height: '100%', }}>
                        <AsyncMenu modules={modules.extra} refreshTime={refreshTime}
                            handleSelect={handleExtraSelect} />
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
                <Col span={6}>
                    <AsyncTree modules={modules} refreshTime={refreshTime}
                        extraItem={extraItem} handleSelect={onRowSelect} />
                </Col>);
            break;
        case "table":
            TableData = (
                <AsyncTable
                    modules={modules} refreshTime={refreshTime}
                    extraItem={extraItem} handleSelect={onRowSelect}
                    scroll={{ x: 600, y: 210 }} />);
            break;
        default:
            break;
    }
    return (
        <Fragment>
            <Card bodyStyle={{ padding: 0 }} bordered={false} style={{
                marginBottom: 5,
            }}>
                <Space style={{
                    padding: 10
                }} size="small">
                    <Button style={{ marginRight: 5, }} icon={<ReloadOutlined />}
                        onClick={onFinish}>重载</Button>
                    {props.actions && props.actions.map((Com, index) => {
                        return <Fragment key={`action-${index}`}>{Com}</Fragment>
                    })}
                </Space>
            </Card>
            <Row gutter={[8, 8]} style={{
                height: 'calc(100vh - 155px)', ...props.style
            }}>
                {Extra}
                {TreeData}
                <Col span={spanForm} style={{ height: '100%', overflowY: "auto" }}>
                    {TableData}
                    <DynamicForm modules={modules} row={row} onFinish={onFinish} />
                </Col>
            </Row>
        </Fragment>
    );
}