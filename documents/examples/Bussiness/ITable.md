## 表格组件

:::tip
单独使用 ITable 组件，需要手动指定 tableHeight，因为系统默认它是 0
多级表头，可以把配置放到children里
也可以支持slots插槽
:::

### 基本用法

:::demo 表格组件的基本用法，和 el-table 基本一致

Bussiness/ITable
:::


## Attributes 属性
|属性|类型|说明|默认值|
|--|--|--|--|
|data|array|传递给el-table的data|[]|
|columns|array|渲染字段配置，请查阅`columns 配置`|[]|
|tableProps|object|传递给el-table的参数|配置项`tableProps`|
|tableOn|object|传递给el-table的方法|配置项`tableOn`|
|tableHeight|number,string|el-table的默认高度|配置项`tableHeight`=0|
|className|string|根节点的class名|配置项`class.ITableRoot`|
|showColumnFilter|boolen|是否显示字段过滤在操作区|false|
|showColumnKeys|Array\<string\>|当前显示的字段，当`showColumnFilter=true`时生效，数组中的字符串就是prop值|[]|

## columns 配置
|属性|类型|说明|默认值|
|--|--|--|--|
|columnProps|object|传递给el-table-column的参数，具体参数查阅element-plus的文档|无|
|show|boolean,|是否显示当前列|true|
|render|jsx function|直接渲染dom，类似slots.default|无|
|slots|object|插槽内容|{}|
|children|array|多级表头的子表头配置|无|

## Methods 方法
|方法|说明|
|--|--|
|reDraw|手动重绘|


