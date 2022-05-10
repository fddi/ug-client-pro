import React, { useState } from 'react';
import '../style/login.css'
import {
    Navigate
} from 'react-router-dom'
import { Layout, Row, Col, Tabs, } from 'antd'
import { APPNMAE } from '../config/client'
import LoginNotice from '../components/login/LoginNotice';
import LoginByAccount from '../components/login/LoginByAccount';
import LoginByQRCode from '../components/login/LoginByQRCode';
import { lag } from '../config/lag';


export default function Login(props) {
    const [jump, setJump] = useState(false);

    if (jump) {
        return (<Navigate to="/index" replace />);
    }
    return (
        <Layout className="content-wrapper">
            <Row className='login-main'>
                <Col  xs={0} sm={0} md={12}
                    className='left-info' >
                    <h2 className="slogan">
                        欢迎使用<br />{APPNMAE}
                    </h2>
                    <div className='notice'>
                        <LoginNotice />
                    </div>
                </Col>
                <Col className="form">
                    <Tabs defaultActiveKey="1" centered>
                        <Tabs.TabPane tab={lag.loginByAccount} key="1">
                            <LoginByAccount jump={() => { setJump(true) }} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={lag.loginByScan} key="2">
                            <LoginByQRCode jump={() => { setJump(true) }} />
                        </Tabs.TabPane>
                    </Tabs>

                </Col>
            </Row>
        </Layout>
    )
};