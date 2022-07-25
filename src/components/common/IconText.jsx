import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import * as Icons from "react-icons/bi";

export const faIcon = (props) => {
    if (props.name == null || Icons[props.name] == null) {
        return null;
    }
    return React.createElement(Icons[props.name],
        { style: { ...props.style } });
}

export default function IconText(props) {
    const [icon, setIcon] = useState(null);
    useEffect(() => {
        if (props.name) {
            const com = faIcon({ name: props.name, style: props.iconStyle });
            setIcon(com);
        }
    }, [props])
    return (
        <Button type='text' block onClick={props.onClick}>
            <div style={{
                background: props.bgColor || '#fff',
                border: props.border || '1px solid #eee',
                borderRadius: 100000,
                width: 42,
                height: 42,
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...props.style
            }}>
                {icon}
            </div>
            <div style={{
                marginTop: 3,
                textAlign: 'center'
            }}>{props.title}</div>
        </Button >
    );
}