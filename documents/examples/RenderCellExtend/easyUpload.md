# 上传组件

## 基本用法
:::tip
业务中，我们经常会需要重新封装一个上传组件，用来处理多种格式和内容，图片可能还需要剪裁和水印等功能: 这是一个标准的上传图片并剪裁加水印的例子
一般来说，你只需要配置
`action`接口地址;
`responseSrcPath`返回url所在的path
`headers`里面配置接口授权token
上传成功后，v-model就会根据图片`url,url2`这样组成值

注意，测试这个doc的最终上传，请你在本地建立一个简易的上传接收的后端，否则你将在控制台和文件列表面板上看到错误信息，如果你想看完整的例子，后面我会模拟一个接口来返回上传信息；
:::

:::demo 
RenderCellExtend/easyUpload
:::


<div style="margin-top: 120px;"/>

## 自定义上传方法
:::tip
很多时候，我们请求会封装一些东西，那么上传接口我们就可以传入我们的封装好的api方法即可，请注意`responseSrcPath`这个配置，它支持.分割，用来描述接口返回值所在的位置
:::

:::demo 
RenderCellExtend/easyUpload2
:::

<div style="margin-top: 120px;"/>

## 模板上传
:::tip
有些上传业务，固定了要求用户上传内容，就可以直接使用`mode=template`的模式，而不是循环使用N个上传组件。
你看，我们单独设置了每个上传位置的配置，可以控制文件格式，标题栏（如果不配置就最后显示文件名称），尺寸大小等
:::

:::demo 
RenderCellExtend/easyUpload3
:::

<div style="margin-top: 120px;"/>

## 模板标题栏控制
:::tip
有些上传业务，固定了要求用户上传内容，就可以直接使用`mode=template`的模式下，还可以直接使用插槽控制标题栏，这样可以使用更丰富的交互提示用户如何上传
:::

:::demo 
RenderCellExtend/easyUpload4
:::


## Attributes 属性

| 属性 | 类型 | 说明 | 默认值 |
|--|--|--|--|
| mode | String | 上传模式：<br/>`append` - 追加模式，每次上传追加到原有文件列表<br/>`template` - 模板模式，替换原有文件列表（可控制文件类型和尺寸限制） | `'append'` |
| useZoom | Boolean | 是否允许缩放 | `true` |
| forceZoom | Boolean | 是否强制缩放（当 `useZoom` 为 `true` 时生效） | `true` |
| zoomLimit | Object | 缩放限制：<br/>- 单值：优先按该值缩放，另一值按比例<br/>- 双值：裁剪时按限制剪裁<br/>- 未裁剪时按最小值缩放 | 无 |
| quality | Number | 缩放质量（0-1之间的数字） | `0.92` |
| convertExt | String | 转换图片后缀（支持 `jpg`/`webp`/`png`） | 无 |
| useWatermark | Boolean | 是否使用水印 | `true` |
| watermarkFunc | Function | 自定义水印配置函数（优先级高于 `watermarkText`） | 无 |
| watermarkText | String | 默认水印文字（`useWatermark` 为 `false` 时无效） | `'watermark'` |
| allowChangeWatermarkText | Boolean | 是否允许修改水印文字（需启用裁剪） | `true` |
| useCropper | Boolean | 是否允许手动裁剪（裁剪时应用缩放和水印） | `true` |
| modelValue | [String, Array] | 绑定值 | `''` |
| valueFormat | String | 值格式类型：<br/>`string` - 单文件路径（多文件用分隔符）<br/>`array` - 文件路径数组<br/>`array-object` - 对象数组（含 `url` 和 `name`） | `'string'` |
| noDataText | String | 无数据时的提示文本 | `'暂无数据'` |
| valueSplit | String | `valueFormat` 为 `string` 时的文件路径分隔符 | `','` |
| valueProps | Object | `valueFormat` 为 `array-object` 时的字段映射配置 | `{ url: 'url', name: 'name', type: 'type', accept: 'accept', poster: 'poster', controls: 'controls', size: 'size', minSize: 'minSize', duration: 'duration' }` |
| disabled | Boolean | 是否禁用组件 | `false` |
| limit | Number | 最大上传数量（0表示无限制） | `0` |
| size | Number | 文件最大尺寸限制（单位：MB），当模板中有配置的时候，以模板优先 | `0` |
| minSize | Number | 文件最小尺寸限制（单位：MB），当模板中有配置的时候，以模板优先 | `0` |
| accept | String | 允许上传的文件类型（默认根据 `imageTypes` 生成），当模板中有配置的时候，以模板优先 | .png,.jpg,.jpeg |
| uploadClass | String | 组件根节点类名 | `'easy-upload'` |
| uploadButtonClass | String | 上传按钮类名 | `'easy-upload-review-item easy-upload-review-item--upload'` |
| uploadButtonText | String | 上传按钮文本 | `'点击上传'` |
| reviewClass | String | 文件陈列区类名 | `'easy-upload-review-item'` |
| itemWidth | [Number, String] | 陈列区单元素宽度 | `100` |
| itemHeight | [Number, String] | 陈列区单元素高度 | `100` |
| zIndex | Number | 预览框和剪切框的层级 | `2500` |
| showItemTitle | Boolean | 是否显示文件标题 | `true` |
| beforeRemove | Function | 删除前的钩子函数（可返回 `Promise` 或 `Boolean` 控制是否删除） | 无 |
| beforeUpload | Function | 上传前的钩子函数（可返回 `Promise` 或 `Boolean` 控制是否上传） | 无 |
| action | String | 内置上传接口地址 | 无 |
| headers | Object | 内置上传请求头 | `{}` |
| data | Object | 内置上传附加数据 | `{}` |
| name | String | 文件上传时候的字段名，和后端约定 | `file` |
| responseSrcPath | String | 上传响应中文件路径的字段路径（支持 `.` 分割） | `'data.linkPath'` |
| uploadFunc | Function | 自定义上传函数（覆盖内置上传） | 无 |


## Events 事件
|事件|说明|参数|
|---|---|---|
|openfile|打开文件时候的事件|file|
|cropped|裁剪完成|fileblob|
|upload-success|上传完成|file, response, fileList|
|upload-error|上传失败|file, error|
|file-error|文件校验错误，内置文件校验负责校验文件尺寸和格式|file,limitSizeMb,accept|
|delete-file|删除文件|file,index|


