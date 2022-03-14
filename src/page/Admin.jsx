import React, { useState } from 'react';
import {
    Navigate
} from 'react-router-dom';
import { Button, Layout, Spin, Tabs, } from 'antd';
import { ClearOutlined } from '@ant-design/icons'
import Loadable from 'react-loadable'
import { APPNMAE } from '../config/client'
import StringUtils from '../util/StringUtils'
import MenuTree from '../components/admin/MenuTree'
import MainHeader from '../components/admin/MainHeader'
import Workbench from './Workbench'
import Hold from './Hold'
import Page404 from './404'
import AppContainer from './AppContainer'
import Routes from '../route/RouteIndex'
import logo from '../asset/icon.png'
import TabProvider from '../components/admin/TabProvider';
export default function Admin(props) {
    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <p>hello Admin</p>
        </div>
    )
}