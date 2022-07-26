## 动态表单DynamicForm
> 配置modules元素，渲染一个动态表单。
```jsx
<DynamicForm modules={modules} onFinish={func} row={obj}/>
```

|属性|说明|类型|默认值
|-|-|-|-|
|modules|模组数据|obj||
|row|初始填充数据|obj||
|onFinish|提交完成事件|()=>{}||

### modules配置说明
```js
{
    title:title, //标题
    rowKey: key,//id字段名
    findOneApi:url,//数据请求接口，非空则携带row[rowKey]参数请求数据
    saveApi: url, //保存数据接口
    delApi: url,  //删除数据接口
    saveDisabled:false, //保存按钮是否隐藏
    delDisabled:false, //删除按钮是否隐藏
    columns: [
        { 
            title: '文本',//标题
            dataIndex: dataKey, //数据项名称
            inputType: "text", //可用 text | textArea | hidden | select | treeSelect | number | logo | date | json
            disabled:false, //是否可填写
            updateDisabled:false, //是否可修改
            required:true,//是否必填
            pattern:/^[A-Za-z0-9]{1,16}/,//校验数据的正则表达式
            message:msg //校验提示信息
            readOnly:false||"readOnly",//只读
            catalog:catalog,//查询目录编码 select和treeSelect 时可用 值为"TF"为是否选项 为"icon" 图标选项
            dictCode:code,//查询字典编码 select和treeSelect 时可用
            mode:mode,//select可用 设置多选
            checkable:false,//treeSelect可用 设置多选
            fileIndex:fileName,//logo可用 上传文件名称
            format: "YYYY-MM-DD",//date可用 格式化日期数据
            defaultValue:"" //默认值

        }, ...{}
    ],
}
```
## 动态CURD页面DynamicCurd

> 配置modules元素，渲染一个通用场景的CURD页面。界面分为页头操作栏、数据导航栏、数据展示栏、和表单栏。通过modules定义组合显示。

```jsx
<DynamicCurd modules={modules} refreshTime={time} 
    onExtraSelect={func} onFinish={func} handleSelect={func}
    actions={[
        <Button>头部操作栏配置</Button>
    ]}
/>
```


|属性|说明|类型|默认
|-|-|-|-|
|modules|模组数据|obj||
|refreshTime|重载数据参数|time||
|onExtraSelect|左侧数据导航栏选中事件|(v)=>{}||
|onFinish|提交完成事件|(row)=>{}||
|handleSelect|数据选中事件|(row)=>{}||
|actions|页头操作栏组件列表|react nodes[]||

### modules配置说明
```js
{
    title:title, //标题
    rowKey: key,//id字段名
    findOneApi:url,//数据请求接口，非空则携带row[rowKey]参数请求数据
    saveApi: url, //保存数据接口
    delApi: url,  //删除数据接口
    saveDisabled:false, //保存按钮是否隐藏
    delDisabled:false, //删除按钮是否隐藏
    //curd配置
    type: "table", //数据集展示组件配置 可用 table | tree
    queryApi:url, //数据集查询接口
    params: obj, //数据集查询参数
    dragDropApi:url, //拖拽响应接口 type为tree时可用
    searchKey:key, //搜索栏参数名配置
    extra:{
        rowKey: key,  //id字段名
        type: "tree", //数据导航组件配置 可用 menu | tree
        queryApi:url, //数据集查询接口
        params: obj,  //数据集查询参数
        dragDropApi:url, //tree拖拽更改接口 type为tree时可用
        searchKey:key
    }, //左侧数据导航栏modules配置 
    columns: [
        { 
            //表单配置
            title: '文本',//标题
            dataIndex: dataKey, //数据项名称
            inputType: "text", //可用 text | textArea | hidden | select | treeSelect | number | logo | date | json
            disabled:false, //是否可填写
            updateDisabled:false, //是否可修改
            required:true,//是否必填
            pattern:/^[A-Za-z0-9]{1,16}/,//校验数据的正则表达式
            message:msg //校验提示信息
            readOnly:false||"readOnly",//只读
            catalog:catalog,//查询目录编码 select和treeSelect 时可用 值为"TF"为是否选项 为"icon" 图标选项
            dictCode:code,//查询字典编码 select和treeSelect 时可用
            mode:mode,//select可用 设置多选
            checkable:false,//treeSelect可用 设置多选
            fileIndex:fileName,//logo可用 上传文件名称
            format: "YYYY-MM-DD",//date可用 格式化日期数据
            defaultValue:"", //默认值
            //数据集展示配置
            width:number, //table列宽
            colsType: 'hidden', //设为hidden table列不显示
            //其他table参数，参照ant-design table组件
        }, ...{}
    ],
}
```