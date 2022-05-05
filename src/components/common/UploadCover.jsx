import React, { useState, useEffect, Fragment } from "react";
import { Upload, message, Button, } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFileByBase64 } from '../../util/FileUtils';
import { lag } from '../../config/lag'
import { useUpdateEffect } from "ahooks";

export default function UploadCover(props) {
     const [file, setFile] = useState();
     const [data, setData] = useState();
     useUpdateEffect(() => {
          setFile(null)
          setData(null)
     }, [props.refreshTime])
     useEffect(() => {
          setData(props.url)
     }, [props.url])

     const beforeUpload = async (file) => {
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
               message.error(lag.alertImgType);
               return false;
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
               message.error(lag.alertImgSize);
               return false;
          }
          const imgData = await getFileByBase64(file);
          setData(imgData);
          setFile(file);
          props.onChange && props.onChange(file);
          return false;
     }

     const onFileDelete = (e) => {
          setFile(null);
          setData(null);
          e.stopPropagation();
     }

     const defaultStyle = { position: "relative", };
     const { style } = props;
     const imgView = (<div style={{ ...defaultStyle, ...style }}>
          <Button style={{ position: 'absolute', top: '45%', left: '45%' }} ghost
               size='large' shape="circle" icon={<DeleteOutlined />} onClick={onFileDelete} />
          <img src={data} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
     </div>);
     const uploadView = (
          <Fragment>
               <p className="ant-upload-drag-icon">
                    <InboxOutlined />
               </p>
               <p className="ant-upload-text">{lag.tipUploadFile}</p>
          </Fragment>);
     return (
          <Upload.Dragger
               beforeUpload={beforeUpload}
               showUploadList={false}
               style={{ ...defaultStyle, ...style }}
               customRequest={() => { }}
          >
               {data ? imgView : uploadView}
          </Upload.Dragger>
     )
}