import { message } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import DynamicCurd from '../components/dynamic/DynamicCurd';
import Page404 from './404'
import Hold from './Hold'
import StringUtils from '../util/StringUtils'
import { post } from '../config/client'

export default (props) => {
    const { item, location } = props;
    const [verify, setVerify] = useState(0);
    const [modules, setModules] = useState({});
    const query = (formCode) => {
        post('/data/mapper', { formCode }).then((result) => {
            if (result && 200 == result.resultCode) {
                const data = result.resultData;
                const verify = data && !StringUtils.isEmpty(data.formMapper) ? 1 : -1;
                try {
                    setVerify(verify);
                    setModules(JSON.parse(data.formMapper));
                } catch (error) {
                    console.log(error)
                    message.error("配置数据不是有效的JSON数据");
                    setVerify(-1);
                }
            } else {
                setVerify(-1);
            }
        })
    }
    useEffect(() => {
        console.log("run ......" + new Date().getTime());
        const state = location && location.state;
        let formCode = item && item.value;
        if (StringUtils.isEmpty(formCode)) {
            formCode = state && state.value;
        }
        if (!StringUtils.isEmpty(formCode)) {
            query(formCode);
        } else {
            setVerify(-1);
        }
    }, []);
    let view = <Hold />;
    switch (verify) {
        case 1:
            view = (<DynamicCurd modules={modules} />);
            break;
        case -1:
            view = <Page404 />;
            break;
        default: break;
    }
    return (
        <Fragment>
            {view}
        </Fragment>
    );
}