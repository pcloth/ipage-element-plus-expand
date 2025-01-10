
## 在表单中使用

这是整个系列的核心组件，它负责将js和json数据渲染成element-ui的一些组件

## 基础渲染、传参和事件
:::demo 尝试一下选择性别
RenderCell/inForm
:::

## 知识点
1. `isFormItem=true`之后，会给组件外层包裹一个`el-form-item`组件
2. `id`字段将会作为el-form-item组件的prop传入，并和rules联动起来
3. `slot`字段将会指定渲染组件的类型
4. `tip`字段将会放到一些组件的`default`插槽里(button,span等)
5. `formData`参数会添加到事件返回的荷载`loadData.data`，这意味着您可以在某个组件参数item.on的事件中，直接修改其他组件的value
6. `show`字段将会控制组件的显示与否，等同于v-show
