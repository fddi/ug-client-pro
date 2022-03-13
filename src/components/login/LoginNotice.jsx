import React, { useState, useRef } from 'react';
import { Carousel, Typography } from 'antd'

export default function LoginNotice(props) {

    return (
        <Carousel autoplay={true}>
            <div>
                <Typography style={{ padding: 10 }}>
                    <Typography.Title level={3} style={{ color: '#ccc' }}>项目介绍</Typography.Title>
                    <Typography.Paragraph style={{ color: '#ccc' }}>
                        AntV 是蚂蚁金服全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、不限可能的数据可视化最佳实践。得益于丰富的业务场景和用户需求挑战，AntV 经历多年积累与不断打磨，已支撑整个阿里集团内外 20000+ 业务系统，通过了日均千万级 UV 产品的严苛考验。
                        我们正在基础图表，图分析，图编辑，地理空间可视化。
                        <Typography.Link href="https://gitee.com/fddi/react-antd-start" target="_blank">
                            更多
                        </Typography.Link>
                    </Typography.Paragraph>
                </Typography>
            </div>
            <div>
                <Typography style={{ padding: 10 }}>
                    <Typography.Title level={3} style={{ color: '#ccc' }}>Introduction</Typography.Title>
                    <Typography.Paragraph style={{ color: '#ccc' }}>
                        In the process of internal desktop applications development, many different design specs and
                        implementations would be involved, which might cause designers and developers difficulties and
                        duplication and reduce the efficiency of development.
                        <Typography.Link href="https://gitee.com/fddi/react-antd-start" target="_blank">
                            更多
                        </Typography.Link>
                    </Typography.Paragraph>
                </Typography>
            </div>
        </Carousel>
    )
}