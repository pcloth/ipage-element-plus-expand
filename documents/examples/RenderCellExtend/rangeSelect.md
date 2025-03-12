# 范围选择器

## 例子:picker模式
:::tip
通常用来组合一个起始选择range模式，和多个选择器picker模式
:::

:::demo 
RenderCellExtend/rangeSelect
:::

## 例子:range模式
:::demo 
RenderCellExtend/rangeSelect2
:::


## Attributes 属性
|属性|类型|说明|默认值|
|--|--|--|--|
|modelValue|Array|选中值|[]|
|valueIsItem|Boolean|是否采用子项作为value，如果为true，就会把整个子项目作为value的一个值放到数组里|false|
|valueProps|Object|关于子项的label和value的字段名|{value:\"value\",label:\"label\"}|
|itemStyle|Object|子项目的样式，直接写style对象|{}|
|disabled|Boolean|是否禁止修改|false|
|mode|String|模式^[enmu]`'picker'=选择模式 \| 'range'=起始范围`| picker|
|sort|Boolean|是否强制排序，开始必须小于结束|false|
|allowsStartEndSame|Boolean|是否允许开始和结束相同|true|
|limit|Number|picker模式下可以选多少个，0=无限制|0|
|options|Array\<Object\>|可选项，类似el-select组件|[]|
|disabledValues|Array|禁止选中的项目|[]|
|rangeName|Array\<String\>|range模式的时候，开始和结束的显示名称|["开始", "结束"]|


## Events 事件
|事件|说明|参数|
|--|--|--|
|change|选中项目变动的时候触发|value|