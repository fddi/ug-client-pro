import React from 'react';
import { TabContext } from './TabContext';

React.createContext();
export default function TabProvider(props) {
    const { addTabPage, removeTabPage, menu } = props;
    return (
        <TabContext.Provider
            value={{
                addTabPage,
                removeTabPage,
                menu,
            }}
        >
            {props.children}
        </TabContext.Provider>
    )
}