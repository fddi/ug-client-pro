## AsyncMenu
>用于数据导航栏

```jsx
<AsyncMenu modules={modules} refreshTime={time} 
handleSelect={func} />
```

|属性|说明|类型|默认
|-|-|-|-|
|modules|模组数据|obj||
|refreshTime|重载数据参数|time||
|handleSelect|数据选中事件|(key)=>{}||

### modules配置说明
```js
{
    queryApi:url, //数据集查询接口
    params: obj //数据集查询参数
}
```

## AsyncTree
>可用于数据导航栏，也可用于数据展示栏

```jsx
<AsyncTree modules={modules} refreshTime={time} 
handleSelect={func} />
```

|属性|说明|类型|默认
|-|-|-|-|
|modules|模组数据|obj||
|refreshTime|重载数据参数|time||
|handleSelect|数据选中事件|(key)=>{}||

### modules配置说明
```js
{
    queryApi:url, //数据集查询接口
    params: obj, //数据集查询参数
    selectType: '', // 设置checkbox支持多选
    dragDropApi:url, // 拖拽响应接口
    showVal:bol  //label是否连值一起显示
}
```

## AsyncTable
>用于数据展示栏

```jsx
<AsyncTable modules={modules} refreshTime={time} 
handleSelect={func} scroll={obj}/>
```

|属性|说明|类型|默认
|-|-|-|-|
|modules|模组数据|obj||
|refreshTime|重载数据参数|time||
|handleSelect|数据选中事件|(key)=>{}||
|scroll|table滚动配置参照ant-desing组件table配置|||


### modules配置说明
```js
{
    queryApi:url, //数据集查询接口
    params: obj, //数据集查询参数
    selectType: '', // 设置checkbox支持多选
    pageable:true,//是否分页
    rowKey: key,//id字段名
    searchKey:key, //搜索栏参数名配置
    columns: [...] //ant-desing组件table配置
}
```

## AsyncSelect
>表单下拉框组件

```jsx
<AsyncSelect value={value} queryApi={url} catalog={catalog} 
dictCode={dictCode} onChange={func} mode={mode}
autoFocus={bol} placeholder={placeholder} disabled={disabled}
/>
```

|属性|说明|类型|默认
|-|-|-|-|
|value|受控值|value||
|queryApi|请求接口|url||
|catalog|目录|catalog||
|dictCode|父级字典编码|dictCode||
|onChange|选择变化事件|(v,opts)=>{}||
|mode|设置 Select 的模式为多选或标签|multiple或tags||
|autoFocus|焦点选中|bol|false|
|placeholder|默认文本|text||
|disabled|是否可用|||


## AsyncTreeSelect
>表单树形下拉框组件

```jsx
<AsyncTreeSelect value={value} queryApi={url} catalog={catalog} 
dictCode={dictCode} onChange={func} checkable={bol}
autoFocus={bol} placeholder={placeholder} disabled={disabled}
/>
```

|属性|说明|类型|默认
|-|-|-|-|
|value|受控值|value||
|queryApi|请求接口|url||
|catalog|目录|catalog||
|dictCode|父级字典编码|dictCode||
|onChange|选择变化事件|(v,opts)=>{}||
|checkable|设置 Select是否可多选||
|autoFocus|焦点选中|bol|false|
|placeholder|默认文本|text||
|disabled|是否可用|||

## AsyncTag
>标签组选择组件

```jsx
<AsyncTag selectTags={tags} queryApi={url} catalog={catalog} 
dictCode={dictCode} onChange={func} 
/>
```

|属性|说明|类型|默认
|-|-|-|-|
|selectTags|选中标签组|[]||
|queryApi|请求接口|url||
|catalog|目录|catalog||
|dictCode|父级字典编码|dictCode||
|onChange|选择变化事件|(tags)=>{}||



