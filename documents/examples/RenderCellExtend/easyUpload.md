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
