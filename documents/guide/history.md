## 更新日志

#### 2025-07-07 版本号 `0.0.30`
1、修复上传组件响应bug

#### 2025-06-28 版本号 `0.0.27`
1、导出组件添加了`customizeCreateExcel`方法，完全控制excel文件的内容


#### 2025-05-23 版本号 `0.0.26`
1、导出组件添加了`xlsxProps`参数
2、导出组件`beforeCreateExcel`参数支持异步方法


#### 2025-04-24 版本号 `0.0.25`
1、移除一些调试console
2、上传组件的valueFormat=`array<object>`模式的bug修复；
3、完善一些文档细节

#### 2025-04-21 版本号 `0.0.23` 
1、`easy-upload`上传组件的所有参数都支持了全局配置
2、上传组件添加了`zoomFunc`和`ratioList`参数
3、ipage组件中的操作区按钮`columnButtons`，将el-table-column组件插槽的scope传递给了loadData.qData

#### 2025-04-18 版本号 `0.0.20`
1. 修复已知的bug
2. 添加`easy-upload`上传组件

#### 2025-02-13 版本号：`0.0.15`
1. ISearch组件添加`singleInput`属性，用于单个输入框回车后是否直接搜索，默认false
2. 避免单个输入框回车后直接刷新浏览器的form提交

#### 2025-02-11 版本号：`0.0.14`
1. 添加`v-ipage-money`指令
2. 将`v-mask`指令改为`v-ipage-mask`指令，统一管理



#### 2025-01-16 版本号：`0.0.13`
1. `addButton`,`editButton`,`deleteButton`三个按钮默认添加`e.stopPropagation()`阻止冒泡
2. 完善更多的typescript类型
3. ipage添加`reloadForm`参数，用于打开表单时候重载IForm
4. 减少selectMore减少出现Uncaught ResizeObserver loop completed with undelivered notifications.的情况，目前只有在弹窗中打开后直接关闭弹窗会有

#### 2025-01-15 版本号：`0.0.10`
1. IForm的渲染单元isCol默认打开，默认span=12，确保和旧版本逻辑一致
2. select-more如果加载的时候被屏蔽了，会造成监听抛错，虽然不影响业务，但是依然防御一下。

#### 2025-01-14 版本号：`0.0.8`
1. ITable添加`showColumnFilter`参数并默认设置为false
2. 补全文档中
3. IForm表单的col参数换到渲染核心

#### 2025-01-11 版本号：`0.0.6`
1. 修复在ssr模式编译下报错的问题
2. 补全文档中
3. 修复表格没有prop的时候，被过滤器隐藏的bug

#### 2025-01-10 版本号：`0.0.4`
1. 补全文档中
2. 调整部署打包等基础工具

