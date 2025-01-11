## 例子
:::tip
业务中常见的场景是当一个下拉框需要从接口获取，然后列表可能会很长的情况下，需要这种查询后可以分页的情况，分页将会出现在下拉的最底部
:::

:::demo 
RenderCell/selectMore
:::

## Attributes 属性
:::tip
select-more组件是在element-plus的select组件的基础上封装的，下列属性中只列出了扩展的属性，原本element组件select的属性依然有效
:::
|属性|类型|说明|默认值|
|--|--|--|--|
|service|Function|下拉组件数据来源方法，分页参数由配置`search`控制，返回数据和total由`response`配置控制|必须填写，不然会出错|
|labelField|string|标签数据的key|'label'|
|valueField|string|value数据的key|'value'|
|keyField|string|循环dom的key|'id'|
|searchKey|string|搜索接口使用的字段|'keyword'|
|additionalParams|object|搜索额外传入的搜索参数|{}|
|labelFieldArr|array|显示多个label，显示的时候用-分割字段|[]|
|labelFunc|Function|用户自己控制label的显示内容|无|
|disabledFunc|Function|如何处理某个行禁止选中的方法|() => false|
|echoFunc|Function|当value有数据的时候，如何回显数据，请注意，这个接口只接收一个array作为返回值|无|

## Events 事件
|事件|说明|参数|
|--|--|--|
|getCurrentItem|change的时候，提交出来当前选中的item，而不是value，多选的时候是一个array，单选是一个object|currentItem|