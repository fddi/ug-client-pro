import React from 'react';
import { Form, Input, InputNumber, DatePicker, Col, Button } from 'antd';
import StringUtils from '../../util/StringUtils';
import AsyncSelect from '../common/AsyncSelect';
import AsyncTreeSelect from '../common/AsyncTreeSelect';
import UploadLogo from '../common/UploadLogo';
import UploadCover from '../common/UploadCover';
import { FormOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const itemStyle = {
    margin: 5,
}
const layout = {
    xs: 24,
    sm: 12,
    lg: 8,
    xl: 6
}

const checkDisabled = (item, data) => {
    if (item.disabled) return item.disabled;
    if (data && !StringUtils.isEmpty(data[item.dataIndex]) && item.updateDisabled) {
        return item.updateDisabled;
    }
    return false;
}

export default {
    text(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"ft-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, pattern: new RegExp(item.pattern), message: item.message || '' }]}
                >
                    <Input type="text" placeholder={item.message || ''} disabled={checkDisabled(item, data)}
                        readOnly={item.readOnly} />
                </FormItem>
            </Col>
        )
    },

    textArea(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fta-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, pattern: new RegExp(item.pattern), message: item.message || '' }]}
                >
                    <Input.TextArea type="text" placeholder={item.message || ''}
                        disabled={checkDisabled(item, data)} readOnly={item.readOnly}
                        autoSize={{ minRows: 2, maxRows: 6 }} />
                </FormItem>
            </Col>
        )
    },

    hidden(item, data) {
        return (
            <FormItem
                noStyle
                name={item.dataIndex}
                key={"fh-" + item.dataIndex} >
                <Input type="hidden" />
            </FormItem>
        )
    },

    number(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fn-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, message: item.message || '' }]}
                >
                    <InputNumber style={{ width: '100%' }}
                        type="text" disabled={checkDisabled(item, data)} readOnly={item.readOnly} />
                </FormItem>
            </Col>
        )
    },

    select(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fs-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, message: item.message || '' }]}
                >
                    <AsyncSelect disabled={checkDisabled(item, data)} catalog={item.catalog}
                        mode={item.mode} dictCode={item.dictCode} />
                </FormItem>
            </Col>
        )
    },

    treeSelect(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fts-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, message: item.message || '' }]}
                >
                    <AsyncTreeSelect disabled={checkDisabled(item, data)} catalog={item.catalog}
                        checkable={item.checkable} dictCode={item.dictCode} />
                </FormItem>
            </Col>
        )
    },

    uploadLogo(item, data, onChange) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fts-" + item.dataIndex}
                >
                    <UploadLogo onChange={onChange} refreshTime={data && data.refreshTime}
                        imgKey={data && data[item.dataIndex]} />
                </FormItem>
            </Col>
        )
    },

    date(item, data) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"ft-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, message: item.message || '' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder={item.message || ''}
                        format={item.format || "YYYY-MM-DD HH:mm:ss"}
                        showTime={item.format && item.format.length <= 10 ? false : true}
                        disabled={checkDisabled(item, data)}
                    />
                </FormItem>
            </Col>
        )
    },

    uploadCover(item, data, onChange) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fts-" + item.dataIndex}
                >
                    <UploadCover onChange={onChange} refreshTime={data && data.refreshTime}
                        imgKey={data && data[item.dataIndex]} style={{ width: "100%", height: 160, }} />
                </FormItem>
            </Col>
        )
    },

    jsonEdit(item, data, handleClick) {
        return (
            <Col {...layout} key={"fc-" + item.dataIndex}>
                <FormItem
                    style={itemStyle}
                    label={item.title}
                    key={"fta-" + item.dataIndex}
                    name={item.dataIndex}
                    rules={[{ required: item.required, pattern: new RegExp(item.pattern), message: item.message || '' }]}
                ><Input.TextArea type="text" placeholder={item.message || ''}
                    disabled={checkDisabled(item, data)} readOnly={item.readOnly}
                    autoSize={{ minRows: 2, maxRows: 6 }} />
                </FormItem>
                <Button style={{ position: 'absolute', right: 5, top: 5 }}
                    icon={<FormOutlined />} onClick={() => handleClick(item.dataIndex)} size="small" />
            </Col>
        )
    }
}