import React, { useEffect, useState } from 'react';
import { Spin, Form, Button, Modal, Card, message, Space, Dropdown, Menu, Row } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { post } from "../../config/client";
import { lag } from "../../config/lag";
import { jsonToFormData } from "../../util/FetchTo";
import StringUtils from '../../util/StringUtils';
import DynamicItem from './DynamicItem';
import { useRequest, useUpdateEffect } from 'ahooks';
import ReactJson from 'react-json-view';

async function queryData(modules, params, row) {
    if (StringUtils.isEmpty(row)) {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
    const rowkey = modules.rowKey || modules.columns[0].dataIndex;
    const v = row[rowkey] || row['key'];
    if (!StringUtils.isEmpty(modules.queryApi) && !StringUtils.isEmpty(v)) {
        return post(modules.queryApi, params).then((result) => result.resultData);
    }
    return new Promise((resolve) => {
        resolve(null);
    });
}

/**
 * 动态表单组件
 * **/
export default function DynamicForm(props) {
    const [form] = Form.useForm();
    const [add, setAdd] = useState(true);
    const [spinning, setSpinning] = useState(false);
    const [item, setItem] = useState();
    const [json, setJson] = useState();
    const [logo, setLogo] = useState();
    const [cover, setCover] = useState();
    const { data, loading } = useRequest(() => queryData(props.modules, props.params, props.row),
        {
            loadingDelay: 1000,
            refreshDeps: [props.row]
        });
    useEffect(() => {
        const logo = {}
        const cover = {}
        const modules = props.modules;
        const columns = modules && modules.columns;
        columns && columns.forEach(col => {
            //组件为头像上传时的参数
            if (col.inputType === "logo") {
                logo.logoIndex = col.dataIndex;
                logo.logoFileIndex = col.fileIndex
            }
            //组件为cover图片上传时的参数
            if (col.inputType === "cover") {
                cover.coverIndex = col.dataIndex;
                cover.coverFileIndex = col.fileIndex
            }
        })
        setLogo(logo);
        setCover(cover);
    }, [props.modules]);
    //选中项变更
    useUpdateEffect(() => {
        reset(props.modules, props.row);
    }, [props.modules, props.row]);
    //查询返回值变更
    useUpdateEffect(() => {
        if (!StringUtils.isEmpty(data)) {
            reset(props.modules, data);
        }
    }, [props.modules, data])
    //重置表单数据
    useUpdateEffect(() => {
        form.resetFields();
    }, [form, item])
    function reset(modules, item) {
        if (StringUtils.isEmpty(item)) {
            item = {};
            setAdd(true);
        } else {
            setAdd(false);
        }
        item.refreshTime = new Date().getTime();
        modules.columns.forEach(col => {
            const defaultValue = StringUtils.isEmpty(col.defaultValue) ? '' : col.defaultValue;
            const initialValue = StringUtils.isEmpty(item[col.dataIndex]) ? defaultValue : item[col.dataIndex];
            item[col.dataIndex] = initialValue;
            if (col.inputType === "date") {
                let m = item[col.dataIndex];
                if (!StringUtils.isEmpty(m)) {
                    m = moment(m, col.format || "YYYY-MM-DD HH:mm:ss");
                    item[col.dataIndex] = m;
                }
            }
            if (col.inputType === "json") {
                let json = item[col.dataIndex];
                if (StringUtils.isEmpty(json)) {
                    json = {};
                } else {
                    try {
                        json = JSON.parse(json);
                    } catch (error) {
                        json = {};
                    }
                }
                setJson(json);
            }
        })
        setItem(item)
    }

    function renderItem(columns, row) {
        if (StringUtils.isEmpty(columns)) {
            return null;
        }
        const itemComs = [];
        columns.forEach(item => {
            switch (item.inputType) {
                case "text":
                    itemComs.push(DynamicItem.text(item, row));
                    break;
                case "textArea":
                    itemComs.push(DynamicItem.textArea(item, row));
                    break;
                case "hidden":
                    itemComs.push(DynamicItem.hidden(item, row));
                    break;
                case "select":
                    itemComs.push(DynamicItem.select(item, row));
                    break;
                case "treeSelect":
                    itemComs.push(DynamicItem.treeSelect(item, row));
                    break;
                case "number":
                    itemComs.push(DynamicItem.number(item, row));
                    break;
                case "logo":
                    itemComs.push(DynamicItem.uploadLogo(item, row, onLogoChange));
                    break;
                case "cover":
                    itemComs.push(DynamicItem.uploadCover(item, row, onCoverChange));
                    break;
                case "date":
                    itemComs.push(DynamicItem.date(item, row));
                    break;
                case "json":
                    itemComs.push(DynamicItem.jsonEdit(item, row, onJsonClick));
                    break;
                default:
                    break;
            }
        });
        return itemComs;
    }

    const onLogoChange = (file) => {
        const newLogo = { ...logo, logoFile: file }
        setLogo(newLogo);
    }

    const onCoverChange = (file) => {
        const newCover = { ...cover, coverFile: file }
        setLogo(newCover);
    }

    const onJsonClick = (dataIndex) => {
        let json = form.getFieldValue(dataIndex);
        if (StringUtils.isEmpty(json)) {
            json = {};
        } else {
            try {
                json = JSON.parse(json);
            } catch (error) {
                message.warn(lag.errorJson);
                json = null;
            }
        }
        if (json == null) {
            return;
        }
        const newJson = { jsonIndex: dataIndex, jsonValue: json, jsonVisible: true }
        setJson(newJson)
    }

    const jsonEdit = (obj) => {
        const newJson = { ...json, jsonValue: obj.updated_src };
        setJson(newJson)
        const data = form.getFieldsValue();
        data[json.jsonIndex] = JSON.stringify(obj.updated_src)
        form.setFieldsValue(data);
    }

    const onFinish = () => {
        form.validateFields().then(values => {
            const { modules, onFinish } = props;
            modules.columns.forEach(col => {
                //date组件格式化
                if (col.inputType === "date" && !StringUtils.isEmpty(values[col.dataIndex])) {
                    values[col.dataIndex] = values[col.dataIndex].format(col.format || 'YYYY-MM-DD HH:mm:ss');
                }
            })
            setSpinning(true)
            const upload = logo || cover ? true : false;
            if (upload) {
                //表单包含文件上传
                const formData = jsonToFormData(values);
                //logo上传
                if (logo && logo.logoIndex) {
                    if (logo.logoFile) {
                        formData.append(logo.logoFileIndex, logo.logoFile)
                    }
                    if (item && !StringUtils.isEmpty(item[logo.logoIndex])) {
                        formData.append(logo.logoIndex, item[logo.logoIndex])
                    }
                }
                //cover上传
                if (cover && cover.coverIndex) {
                    if (cover.coverFile) {
                        formData.append(cover.coverFileIndex, cover.coverFile)
                    }
                    if (item && !StringUtils.isEmpty(item[cover.coverIndex])) {
                        formData.append(cover.coverIndex, item[cover.coverIndex])
                    }
                }
                post(modules.saveApi, formData, false).then((result) => {
                    setSpinning(false);
                    if (result && 200 === result.resultCode) {
                        message.success(result.resultMsg);
                        onFinish && onFinish();
                    } else {
                        const msg = result ? result.resultMsg : lag.errorNetwork;
                        message.error(msg)
                    }
                })
            } else {
                post(modules.saveApi, values).then((result) => {
                    setSpinning(false);
                    if (result && 200 === result.resultCode) {
                        message.success(result.resultMsg);
                        onFinish && onFinish();
                    } else {
                        const msg = result ? result.resultMsg : lag.errorNetwork;
                        message.error(msg)
                    }
                })
            }
        })
    }

    const handleReset = () => {
        const { modules } = props;
        // const rowKey = modules.rowKey || modules.columns[0].dataIndex;
        // const initItem = {};
        // if (!StringUtils.isEmpty(item)) {
        //     initItem['parentId'] = StringUtils.isEmpty(item[rowKey]) ? "0" : item[rowKey];
        //     initItem['unitCode'] = StringUtils.isEmpty(item['unitCode']) ? "" : item['unitCode'];
        //     if (!StringUtils.isEmpty(modules.extra)) {
        //         const key = StringUtils.isEmpty(modules.extra.key) ? "key" : modules.extra.key;
        //         const dataIndex = StringUtils.isEmpty(modules.extra.dataIndex) ? key : modules.extra.dataIndex;
        //         initItem[dataIndex] = item[dataIndex];
        //     }
        // }
        props.onReset && props.onReset()
        reset(modules, null);
    }

    const handleDel = () => {
        const { modules, row } = props;
        if (StringUtils.isEmpty(row)) {
            message.warning(lag.noData);
            return;
        }
        const rowKey = modules.rowKey || modules.columns[0].dataIndex;
        let key = row[rowKey] || row.key;
        if (StringUtils.isEmpty(key) || key == "0") {
            message.warn(lag.npe);
            return;
        }
        key = form.getFieldValue(rowKey);
        if (StringUtils.isEmpty(key) || key == "0") {
            message.warn(lag.npe);
            return;
        }
        const params = {};
        params[rowKey] = key;
        Modal.confirm({
            title: lag.confirmDel,
            content: lag.del,
            okText: lag.ok,
            okType: 'danger',
            cancelText: lag.cancel,
            onOk() {
                doDel(params);
            },
        });
    }

    function doDel(params) {
        const { modules, onFinish } = props;
        setSpinning(true)
        post(modules.delApi, params).then((result) => {
            if (200 === result.resultCode) {
                message.success(result.resultMsg);
                onFinish();
            } else {
                message.error(result.resultMsg);
            }
            setSpinning(false)
        });
    }

    const handleMenuClick = (e) => {
        switch (e.key) {
            case "1":
                handleDel();
                break;
            case "2":
                break;
            default:
                break;
        }
    }

    const saveDisabled = props.modules.saveDisabled ? props.modules.saveDisabled : false;
    const delDisabled = props.modules.delDisabled ? props.modules.delDisabled : false;
    const Save = add ? (<Button icon={<PlusOutlined />} onClick={onFinish} type="primary" danger>增加</Button>)
        : (<Button icon={<CheckOutlined />} onClick={onFinish} type="primary">保存</Button>)
    const extra = (
        <Space>
            {saveDisabled ? (null) : Save}
            <Dropdown overlay={(<Menu onClick={handleMenuClick}>
                <Menu.Item key="2" icon={<ReloadOutlined />}
                    onClick={handleReset} >重置</Menu.Item>
                {delDisabled ? (null) :
                    (<Menu.Item key="1" icon={<DeleteOutlined />} > 删除 </Menu.Item>)}
            </Menu>)}>
                <Button>
                    更多<DownOutlined />
                </Button>
            </Dropdown>
        </Space>);
    return (
        <div style={props.style}>
            <Spin spinning={spinning || loading}>
                <Card
                    bodyStyle={{ padding: 6, }}
                    extra={extra}
                >
                    <Form
                        labelAlign='right'
                        labelCol={{
                            span: 8
                        }}
                        labelWrap={true}
                        initialValues={item}
                        layout="horizontal"
                        form={form}
                        size="middle"
                    >
                        <Row>
                            {renderItem(props.modules.columns, item)}
                        </Row>
                    </Form>
                </Card>
                <Modal
                    title={`JSON编辑器`}
                    visible={json && json.jsonVisible}
                    footer={null}
                    onCancel={() => { setJson({ jsonVisible: false, jsonValue: null, jsonIndex: null }) }}
                    bodyStyle={{ padding: 0, }}
                >
                    <ReactJson src={json && json.jsonValue} theme="monokai" style={{ minHeight: 180 }}
                        onEdit={jsonEdit}
                        onAdd={jsonEdit}
                        onDelete={jsonEdit} />
                </Modal>
            </Spin>
        </div>
    );
}