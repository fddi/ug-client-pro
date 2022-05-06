import { Card, Col, message, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
export default function WorkBench(props) {
    const [deadline] = useState(Date.now() + 1000 * 60 * 30)
    function onFinish() {
        message.error("您已使用半小时！请休息下");
    }
    return (
        <Card>
            <Row gutter={16}>
                <Col span={24}>
                    <Statistic.Countdown
                        title="倒计时" value={deadline} onFinish={onFinish} />
                </Col>
            </Row>
        </Card>
    )
}