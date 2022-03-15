import React, { useState } from "react";
import { Avatar, Upload, message, } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { getFileByBase64 } from '../../util/FileUtils';
import { lag } from "../../config/lag";

export default function UploadLogo(props) {
     const [file, setFile] = useState();
     const [data, setData] = useState();

     useEffect(() => {
          setData(props.url)
     }, [props.url])

     beforeUpload = async (file) => {
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

     const uploadButton = (
          <div>
               <PlusOutlined />
               <div className="ant-upload-text">{lag.uploadLogo}</div>
          </div>
     );
     return (
          <Upload
               listType="picture-card"
               className="avatar-uploader c-avatar"
               showUploadList={false}
               beforeUpload={beforeUpload}
               customRequest={() => { }}
          >
               {data ? <Avatar size={90} src={data} /> : uploadButton}
          </Upload>
     )
}