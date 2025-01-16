## 更新日志

> 2025-01-16 版本号：`0.0.13`
1. `addButton`,`editButton`,`deleteButton`三个按钮默认添加`e.stopPropagation()`阻止冒泡
2. 完善更多的typescript类型
3. ipage添加`reloadForm`参数，用于打开表单时候重载IForm
4. 减少selectMore减少出现Uncaught ResizeObserver loop completed with undelivered notifications.的情况，目前只有在弹窗中打开后直接关闭弹窗会有

> 2025-01-15 版本号：`0.0.10`
1. IForm的渲染单元isCol默认打开，默认span=12，确保和旧版本逻辑一致
2. select-more如果加载的时候被屏蔽了，会造成监听抛错，虽然不影响业务，但是依然防御一下。

> 2025-01-14 版本号：`0.0.8`
1. ITable添加`showColumnFilter`参数并默认设置为false
2. 补全文档中
3. IForm表单的col参数换到渲染核心

> 2025-01-11 版本号：`0.0.6`
1. 修复在ssr模式编译下报错的问题
2. 补全文档中
3. 修复表格没有prop的时候，被过滤器隐藏的bug

> 2025-01-10 版本号：`0.0.4`
1. 补全文档中
2. 调整部署打包等基础工具

