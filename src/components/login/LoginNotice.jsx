import React, { useState, useRef } from 'react';
import { Carousel, Typography } from 'antd'

export default function LoginNotice(props) {

    return (
        <Carousel autoplay={true}>
            <div>
                <Typography style={{ padding: 10 }}>
                    <Typography.Title level={3} style={{ color: '#ccc' }}>项目介绍</Typography.Title>
                    <Typography.Paragraph style={{ color: '#ccc', minHeight: 100 }}>
                        开箱即用的低代码前端管理平台脚手架。
                        <Typography.Link href="https://gitee.com/fddi/ug-client-pro" target="_blank">
                            更多
                        </Typography.Link>
                    </Typography.Paragraph>
                </Typography>
            </div>
            <div>
                <Typography style={{ padding: 10 }}>
                    <Typography.Title level={3} style={{ color: '#ccc' }}>Introduction</Typography.Title>
                    <Typography.Paragraph style={{ color: '#ccc', minHeight: 100 }}>
                        Low code front-end management platform scaffold.
                        <Typography.Link href="https://gitee.com/fddi/ug-client-pro" target="_blank">
                            more
                        </Typography.Link>
                    </Typography.Paragraph>
                </Typography>
            </div>
        </Carousel>
    )
}