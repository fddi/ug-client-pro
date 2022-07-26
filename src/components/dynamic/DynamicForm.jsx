import React, { useEffect, useState } from 'react';
import { Spin, Form, Button, Modal, Card, message, Space, Dropdown, Menu, Row } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, DownOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import { post } from "../../config/client";
import { lag } from "../../config/lag";
import { jsonToFormData } from "../../util/FetchTo";
import StringUtils from '../../util/StringUtils';
import DynamicItem from './DynamicItem';
import { useRequest, useUpdateEffect } from 'ahooks';
import ReactJson from 'react-json-view';

async function queryData(modules, row) {
    if (StringUtils.isEmpty(row)) {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
    const rowkey = modules.rowKey || modules.columns[0].dataIndex;
    const v = row[rowkey] || row['id'];
    if (!StringUtils.isEmpty(modules.findOneApi) && !StringUtils.isEmpty(v)) {
        const params = {};
        params[rowkey] = v
        return post(modules.findOneApi, params).then((result) => result.resultData);
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
    const [insert, setInsert] = useState(true);
    const [spinning, setSpinning] = useState(false);
    const [item, setItem] = useState();
    const [json, setJson] = useState();
    const [logo, setLogo] = useState();
    const { data, loading } = useRequest(() => queryData(props.modules, props.row),
        {
            loadingDelay: 1000,
            refreshDeps: [props.row]
        });
    useEffect(() => {
        const logo = {}
        const modules = props.modules;
        const columns = modules && modules.columns;
        columns && columns.forEach(col => {
            //组件为头像上传时的参数
            if (col.inputType === "logo") {
                logo.logoIndex = col.dataIndex;
                logo.logoFileIndex = col.fileIndex
            }
        })
        setLogo(logo);
        handleInsert();
    }, [props.modules]);
    //选中项变更
    useUpdateEffect(() => {
        setInsert(StringUtils.isEmpty(props.row))
        reset(props.modules, props.row, props.extraItem)
    }, [props.modules, props.row]);
    //查询返回值变更
    useUpdateEffect(() => {
        setInsert(StringUtils.isEmpty(data))
        reset(props.modules, data, props.extraItem);
    }, [props.modules, data])
    //额外项选择变更
    useUpdateEffect(() => {
        setInsert(true)
        reset(props.modules, null, props.extraItem);
    }, [props.modules, props.extraItem])
    //重置表单数据
    useUpdateEffect(() => {
        form.resetFields();
    }, [form, item])

    function reset(modules, item, extraItem) {
        if (StringUtils.isEmpty(item)) {
            item = {};
            item['parentId'] = "0"
        }
        if (!StringUtils.isEmpty(modules.extra) && !StringUtils.isEmpty(extraItem)) {
            const key = StringUtils.isEmpty(modules.extra.rowKey) ? "key" : modules.extra.rowKey;
            const searchKey = StringUtils.isEmpty(modules.extra.searchKey) ? key : modules.extra.searchKey;
            //额外项保存
            item[searchKey] = extraItem[key];
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
            const upload = StringUtils.isEmpty(logo) ? false : true;
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
                post(modules.saveApi, formData, false).then((result) => {
                    setSpinning(false);
                    if (result && 200 === result.resultCode) {
                        message.success(result.resultMsg);
                        onFinish && onFinish();
                        reset(props.modules, null, props.extraItem);
                    } else {
                        const msg = result ? result.resultMsg : lag.errorNetwork;
                        Modal.error({
                            title: '操作失败',
                            content: result.resultMsg,
                        });
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
                        Modal.error({
                            title: '操作失败',
                            content: result.resultMsg,
                        });
                    }
                })
            }
        })
    }

    const handleInsert = () => {
        const { modules } = props;
        const rowKey = modules.rowKey || modules.columns[0].dataIndex;
        const initItem = {};
        initItem['parentId'] = "0"
        if (!StringUtils.isEmpty(item)) {
            //新增时默认选中项为父项
            initItem['parentId'] = item[rowKey] || "0";
        }
        props.onReset && props.onReset()
        setInsert(true);
        reset(modules, initItem, props.extraItem);
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
            message.warn(lag.noKey);
            return;
        }
        key = form.getFieldValue(rowKey);
        if (StringUtils.isEmpty(key) || key == "0") {
            message.warn(lag.noKey);
            return;
        }
        const params = {};
        params[rowKey] = key;
        Modal.confirm({
            title: lag.confirmDel,
            content: `${lag.del}:${rowKey}=${key}`,
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
                reset(props.modules, null, props.extraItem);
            } else {
                Modal.error({
                    title: '操作失败',
                    content: result.resultMsg,
                });
            }
            setSpinning(false)
        });
    }

    const handleMenuClick = (e) => {
        switch (e.key) {
            case "1":
                handleInsert()
                break;
            case "2":
                handleDel();
                break;
            default:
                break;
        }
    }

    const items = [{ key: "1", icon: <PlusOutlined />, label: "新增" },
    { key: "2", icon: <DeleteOutlined />, label: "删除" }];
    const saveDisabled = props.modules.saveDisabled ? props.modules.saveDisabled : false;
    const delDisabled = props.modules.delDisabled ? props.modules.delDisabled : false;
    delDisabled && items.pop();
    const Save = insert ? (<Button icon={<CheckOutlined />} onClick={onFinish} type="primary" danger>新增提交</Button>)
        : (<Button icon={<CheckOutlined />} onClick={onFinish} type="primary">保存提交</Button>)
    const extra = (
        <Space>
            {saveDisabled ? (null) : Save}
            <Dropdown overlay={(<Menu
                onClick={handleMenuClick}
                items={items}
            />)}>
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
                    title={
                        <Space style={{ color: '#1890ff' }}>
                            <FormOutlined /><span>{props.modules.title}</span>
                        </Space>}
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