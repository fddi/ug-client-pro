import React, { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { lag } from '../../config/lag';

const FormItem = Form.Item;
export default function ModifyPwd(props) {
    const [loading, setLoading] = useState(false);

    function handlePressEnter(e, id) {
        e.preventDefault();
        const ref = document.getElementById(id)
        ref.focus();
        ref.select();
    }
    const defaultStyle = {
    }
    return (
        <div style={{ ...defaultStyle, ...props.style }}>
            <Alert banner message={lag.alertPasswordReg} showIcon />
            <Form onFinish={() => { }}
                style={{ marginTop: 10, }}
                initialValues={{ userName: props.userName || "" }}
                labelCol={{
                    xs: { span: 22 },
                    sm: { span: 6 },
                }} wrapperCol={{
                    xs: { span: 22 },
                    sm: { span: 16 },
                }}>
                <FormItem
                    label="用户名"
                    name="userName"
                    rules={[{
                        required: true,
                        pattern: /^[A-Za-z0-9]{4,16}/,
                        message: '输入用户名!'
                    }]}
                    hasFeedback
                >
                    <Input onPressEnter={(e) => { handlePressEnter(e, 'p1') }} />
                </FormItem>
                <FormItem
                    label={lag.oldPassword}
                    name="password"
                    rules={[{ required: true, message: lag.alertRequirePwd }]}
                    hasFeedback
                >
                    <Input type="password" autoFocus
                        onPressEnter={(e) => { handlePressEnter(e, 'p2') }} id='p1' />
                </FormItem>
                <FormItem
                    label={lag.newPassword}
                    name="newPassword"
                    rules={[{
                        required: true,
                        pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/,
                        message: lag.alertRequirePwd
                    }]}
                    hasFeedback
                >
                    <Input type="password"
                        onPressEnter={(e) => { handlePressEnter(e, 'p3') }} id='p2' />
                </FormItem>
                <FormItem
                    label={lag.confirmPassword}
                    name="newPassword2"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[{
                        required: true,
                        pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}/,
                        message: lag.alertRequirePwd
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (value && value.length < 8) {
                                return Promise.reject(lag.alertPasswordReg);
                            }
                            if (value && value !== getFieldValue('newPassword')) {
                                return Promise.reject(lag.errorConfirmPassword);
                            }
                            return Promise.resolve();
                        },
                    })]}
                >
                    <Input type="password" id='p3' />
                </FormItem>
                <div style={{ textAlign: "center", paddingLeft: 25, paddingRight: 25, }}>
                    <Button key="submit" type="primary" size="large"
                        htmlType="submit"
                        block
                        loading={loading}>修改</Button>
                </div>
            </Form>
        </div>
    );
}
