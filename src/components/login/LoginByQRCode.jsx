import React, { useState, useRef } from 'react';
import { Space, Button, Divider } from 'antd'
import DataMask from '../common/DataMask';
import { lag } from '../../config/lag';
const testImg = require('../../asset/qr_test.png')

export default function LoginByQRCode(props) {
    const [visible, setVisible] = useState(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <p style={{ textAlign: 'center' }}>{lag.appScan}</p>
            <div style={{ width: 190, height: 190, position: 'relative' }}
                onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}
            >
                <DataMask onPress={() => { setVisible(false) }} pressTag="刷新" style={{ display: visible ? 'flex' : 'none' }} />
                <img src={testImg} style={{ width: 190, height: 190 }} />
            </div>
            <Space style={{ margin: 10, }}>
                <Button type="link" size='small'
                    onClick={() => { }}>
                    {lag.appDl}
                </Button>
                <Divider type="vertical" />
                <Button type="link" size='small'
                    onClick={() => { }}>
                    {lag.callAdmin}
                </Button>
            </Space>
        </div>
    )
}