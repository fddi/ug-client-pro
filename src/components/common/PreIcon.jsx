import React from 'react';
import { ApartmentOutlined, AppstoreOutlined, AudioOutlined, BellOutlined, BookOutlined } from '@ant-design/icons';
import { BulbOutlined, CalculatorOutlined, CalendarOutlined, CameraOutlined, CloudOutlined } from '@ant-design/icons';
import { CommentOutlined, CustomerServiceOutlined, DatabaseOutlined, DesktopOutlined, FolderOutlined, TrophyOutlined,BarsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
export const icons = {
    ApartmentOutlined, AppstoreOutlined, AudioOutlined, BellOutlined, BookOutlined,
    BulbOutlined, CalculatorOutlined, CalendarOutlined, CameraOutlined, CloudOutlined,
    CommentOutlined, CustomerServiceOutlined, DatabaseOutlined, DesktopOutlined, FolderOutlined,
    TrophyOutlined, BarsOutlined
}

export const Icon = ({ type, style }) => {
    let com = null;
    Object.keys(icons).forEach(key => {
        if (type === key) {
            com = icons[key];
            return false;
        }
    });
    if (com == null) {
        return null;
    }
    return React.createElement(com, { style: { marginRight: 2, ...style } })
};

export const IconText = ({ color, icon, text, onClick }) => (
    <Button type="link" style={{ padding: 2, }} onClick={onClick}>
        {React.createElement(icon, { style: { color, } })}
        <span style={{ color, }}>{text}</span>
    </Button>
);