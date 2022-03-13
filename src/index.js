import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './style/index.css';

moment.locale('zh-cn');
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider >,
  document.getElementById('root')
);
