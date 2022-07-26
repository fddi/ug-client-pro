/* 
*  静态路由配置表/index 路由下子路由
*  component相对于src/pages目录
*/
export default {
    routes: [
        { path: '/index/workbench', component: 'Workbench' },
        { path: '/index/404', component: '404' },
        { path: '/index/hold', component: 'Hold' },
        { path: '/index/remote-if', component: 'RemoteIframe' },
        { path: '/index/remote-mirco', component: 'RemoteMirco' },
        { path: '/index/dynamic', component: 'DynamicDemo' },
        { path: '/index/curd', component: 'CurdDemo' },
    ]
}