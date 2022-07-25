import React, { Component, useEffect, useState } from 'react';
import { post } from '../../config/client';
import { jsonToFormData } from '../../util/FetchTo';
import { Button, Upload, message, Radio, Alert, Spin, Divider, Modal, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import StringUtils from '../../util/StringUtils';
import { lag } from '../../config/lag';

export default function ImpExcelModal(props) {
     const [loading, setLoading] = useState(false)
     const [fileList, setFileList] = useState()
     const [dataType, setDataType] = useState(props.dataType || 'tree')

     useEffect(() => {
          setFileList([])
          setLoading(false)
     }, [props.refreshTime])

     const beforeUpload = (file, fileList) => {
          setFileList([file])
          return false;
     }

     const onRemove = (file) => {
          setFileList([])
     }

     const onUpload = () => {
          const { api, params, onFinish } = props;
          if (fileList == null || fileList.length <= 0) {
               message.warn("请先选择文件");
               return;
          }
          if (StringUtils.isEmpty(api)) {
               message.error("组件调用错误，上传地址为空");
               return;
          }
          setLoading(true)
          let formData = new FormData();
          if (params !== null) {
               formData = jsonToFormData(params);
          }
          formData.append("file", fileList[0]);
          formData.append("dataType", dataType);
          post(api, formData).then((result) => {
               setLoading(false)
               if (result.resultCode === 200) {
                    message.success(result.resultMsg);
                    onFinish && onFinish(result);
               } else {
                    Modal.error({
                         title: '上传失败',
                         content: result.resultMsg,
                    });
               }
          })
     }

     const defaultStyle = {

     }
     return (
          <div style={{ ...defaultStyle, ...props.style }}>
               <Alert message="支持xls,xlsx格式文件。选中文件后，点击提交上传。" banner showIcon type="info" />
               <Spin spinning={loading} style={{ margin: 10, }}>
                    <div style={{ margin: 15, }}>
                         <Radio.Group
                              onChange={(e) => setDataType(e.target.value)}
                              value={dataType} disabled>
                              <Radio value="list">列表数据</Radio>
                              <Radio value="tree">多层级数据</Radio>
                         </Radio.Group>
                         <Upload
                              headers={{ 'X-Requested-With': null }}
                              beforeUpload={beforeUpload}
                              fileList={fileList}
                              accept=".xls,.xlsx"
                              onRemove={onRemove}
                         >
                              <Button icon={<UploadOutlined />} >选择Excel文件</Button>
                         </Upload>
                         <Divider />
                         <div style={{ textAlign: "center" }}>
                              <Button type="primary" onClick={onUpload}>确认提交</Button>
                         </div>
                    </div>
               </Spin>
          </div>
     )
}