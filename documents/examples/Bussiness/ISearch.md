## 搜索组件


### 基本用法

:::tip 注意事项
1、ISearch组件只负责发起请求，对数据不做任何处理
:::

:::demo 搜索组件是一个对el-form表单的封装，所有的输入单元和按钮都是`RenderCell`组件

Bussiness/ISearchBase

:::


### 更多搜索
:::demo 当搜索条件过多的时候，可以将一部分不常用的隐藏起来
Bussiness/ISearchMore
:::

### 控制按钮
:::demo 可以完全控制搜索按钮和重置按钮，以及更多的按钮
Bussiness/ISearchButton
:::


## Attributes 属性

|属性|类型|说明|默认值|
|--|--|--|--|
|value|object|表单v-model|{}|
|hideSearch|boolean|不需要展示搜索栏|false|
|resetReQuery|boolean|当重置按钮按下的时候，是否再次发起搜索|true|
|formProps|object|传递给el-form的props参数|配置项`searchFormProps`|
|inputProp|object|默认传递给每一个输入单元`RenderCell`组件的props|配置项`searchInput`|
|buttonProp|object|默认传递给每一个按钮单元`RenderCell`组件的props|配置项`buttonProp`|
|expandButtons|array|扩展按钮的`RenderCell`组件配置|[]|
|searchSubmitButton|object,boolean|false=不显示搜索按钮，object=显示并控制搜索按钮的`RenderCell`组件配置|配置项`searchSubmitButton`|
|searchResetButton|object,boolean|false=不显示重置按钮，object=显示并控制重置按钮的`RenderCell`组件配置|配置项`searchResetButton`|
|searchItems|array|搜索项目列表，每个子项都是一个`RenderCell`组件配置|[]|
|qData|object|查询附加参数，这个参数会附加到查询时候提交的参数里|{}|
|queryFunc|function|查询方法|null|
|autoQuery|boolean|加载组件时候是否自动查询|false|
|allinMore|boolean|所有搜索项是否都放到更多搜索里，方便手机上处理|配置项`allinMore`|
|className|string|组件根节点的class类名，方便控制整体样式|配置项`class.ISearchRoot`|
|singleInput|boolean|单个输入框的时候回车是否直接触发搜索|false,配置项`search.singleInput`|


## Methods 方法
|属性|参数|说明|
|--|--|--|
|changeParams|form,value,loadData|当输入单元发生change事件的时候触发，form是当前表单数据，value是当前变动数据，loadData是荷载数据|
|beforeSearch|formData表单数据的深拷贝|查询前方法，可以对formData进行修改，而不会修改到value|
|searchSuccess|response接口返回对象|查询方法正确完成触发|
|searchFail|error|查询方法失败后触发|
|searchFinally|无|查询方法完成后触发|
|resetFields|form|重置按钮按下后触发|







