import React, { Fragment, useEffect, useState } from 'react';
import Hold from './Hold'
import Redirect404 from './Redirect404'
import StringUtils from '../util/StringUtils'
import { getUrlParams, post } from '../config/client'
import { useRequest } from 'ahooks';
import { Button, Card, Modal, Space, } from 'antd';
import { EditOutlined, } from '@ant-design/icons'
import ReactJson from 'react-json-view';
import DynamicForm from '../components/dynamic/DynamicForm';

export default function DynamicDemo(props) {
    const [found, setFound] = useState(true);
    const [modules, setModules] = useState(null);
    const [visible, setVisible] = useState(null);
    const { item, } = props;

    let params = getUrlParams(item.value);
    let formCode = params.get('formCode');
    const { data } = useRequest(() => post('/data/form.json', { formCode }), {
        loadingDelay: 1000,
    })
    useEffect(() => {
        if (!StringUtils.isEmpty(data)) {
            if (data.resultData) {
                setModules(data.resultData.modules)
            } else {
                setFound(false);
            }
        }
    }, [data])
    let DForm = found ? <Hold /> : <Redirect404 />;
    if (!StringUtils.isEmpty(modules)) {
        DForm = (
            <Card bodyStyle={{ padding: 0 }} bordered={false}>
                <Space style={{
                    padding: 10
                }} size="small">
                    <Button icon={<EditOutlined />} onClick={() => setVisible(true)}>编辑modules数据</Button>
                </Space>
                <DynamicForm modules={modules} />
            </Card>);
    }
    const jsonEdit = (obj) => {
        setModules(obj.updated_src)
    }
    return (
        <Fragment>
            {DForm}
            <Modal
                title={`JSON编辑器`}
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
                bodyStyle={{ padding: 0, }}
            >
                <ReactJson src={modules} theme="monokai" style={{ minHeight: 180 }}
                    onEdit={jsonEdit}
                    onAdd={jsonEdit}
                    onDelete={jsonEdit} />
            </Modal>
        </Fragment>
    );
}