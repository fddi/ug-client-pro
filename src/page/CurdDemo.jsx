import React, { Fragment, useEffect, useState } from 'react';
import DynamicCurd from '../components/dynamic/DynamicCurd';
import Hold from './Hold'
import Redirect404 from './Redirect404'
import StringUtils from '../util/StringUtils'
import { post } from '../config/client'
import { useRequest } from 'ahooks';
import { Button, Modal, } from 'antd';
import { SwapOutlined, } from '@ant-design/icons'
import ReactJson from 'react-json-view';

export default function CurdDemo(props) {
    const [found, setFound] = useState(true);
    const [modules, setModules] = useState(null);
    const [visible, setVisible] = useState(null);
    const { item, } = props;
    let formCode = item && item.value;
    const { data } = useRequest(() => post('/data/curd.json', { formCode }), {
        loadingDelay: 1000,
    })
    useEffect(() => {
        if (!StringUtils.isEmpty(data)) {
            if (data.resultData) {
                setModules(data.resultData.formMapper)
            } else {
                setFound(false);
            }
        }
    }, [data])
    let Curd = found ? <Hold /> : <Redirect404 />;
    if (!StringUtils.isEmpty(modules)) {
        Curd = (<DynamicCurd modules={modules} params={modules.params}
            actions={[
                <Button icon={<SwapOutlined />} onClick={() => setVisible(true)}>编辑modules数据</Button>
            ]}
        />);
    }
    const jsonEdit = (obj) => {
        setModules(obj.updated_src)
    }
    return (
        <Fragment>
            {Curd}
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