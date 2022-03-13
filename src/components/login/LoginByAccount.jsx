import React, { useState, useRef } from 'react';
import { Button, Row, Form, Input, Spin, Alert, Checkbox, Modal, Divider, Space, } from 'antd'
import { TAG } from '../../config/client'
import { lag } from '../../config/lag';
import StringUtils from '../../util/StringUtils'
import ModifyPwd from './ModifyPwd';

const FormItem = Form.Item;
let lastRememberUser = true;
let lastUserName = localStorage.getItem(TAG.userName)
if (StringUtils.isEmpty(lastUserName)) {
    lastUserName = ""
    lastRememberUser = false
}

export default function LoginByAccount(props) {
    const [userName, setUserName] = useState(lastUserName);
    const [rememberUser, setRememberUser] = useState(lastRememberUser);
    const [visible, setVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const initialValues = {
        userName: userName,
    }
    const pwRef = useRef(null);

    function onFinish(values) {
        console.log(values)
        if (values.userName === 'demo' && values.password === 'demo') {
            localStorage.setItem(TAG.userName, values.userName);
            props && props.jump();
        } else {
            setErrorMsg(lag.errorUsernameOrPassword)
        }
    }

    function handlePressEnter(e) {
        e.preventDefault()
        pwRef.current.focus();
        pwRef.current.select();
    }
    const loginAlert = errorMsg && (<Alert banner message={errorMsg} type="error" showIcon />);
    return (
        <Spin spinning={false} tip={lag.infoLoading}>
            <Form onFinish={onFinish} style={{ padding: 30 }}
                initialValues={initialValues}
            >
                <FormItem hasFeedback name="userName"
                    rules={[
                        {
                            required: true,
                            pattern: /^[A-Za-z0-9]{4,16}/,
                            message: lag.alertRequireUsername
                        },
                    ]}>
                    <Input onChange={(e) => { setUserName(e.target.value) }}
                        autoFocus size="large" placeholder="用户名：demo" onPressEnter={handlePressEnter} />
                </FormItem>
                <FormItem hasFeedback name="password"
                    rules={[
                        {
                            required: true,
                            message: lag.alertRequirePwd
                        },
                    ]}>
                    <Input ref={pwRef} size="large" type="password" placeholder="密码：demo" />
                </FormItem>
                <Row style={{ padding: 10 }}>
                    <Checkbox checked={rememberUser}
                        onChange={(e) => { setRememberUser(e.target.checked) }}>{lag.rememberUsername}</Checkbox>
                </Row>
                {loginAlert}
                <Row>
                    <Button type="primary" shape="round" size="large" htmlType="submit" style={{ width: "100%" }} >
                        {lag.login}
                    </Button>
                </Row>
                <Space style={{ margin: 10, }}>
                    <Button type="link" size='small'
                        onClick={() => { setVisible(true) }}>
                        {lag.changePassword}
                    </Button>
                    <Divider type="vertical" />
                    <Button type="link" size='small'
                        onClick={() => { }}>
                        {lag.callAdmin}
                    </Button>
                </Space>
            </Form>
            <Modal
                title={lag.changePassword}
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
                bodyStyle={{ padding: 0, paddingBottom: 20, }}
            >
                <ModifyPwd userName={userName}
                    onFinish={() => setVisible(false)} />
            </Modal>
        </Spin>
    )
}