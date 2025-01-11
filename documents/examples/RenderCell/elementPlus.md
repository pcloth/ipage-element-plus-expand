## element-plus组件库支持
:::tip
element-plus的绝大部分组件都已经配置了支持，你只需要把`el-input`这样的组件名称，去掉el-，变成`input`填写到`slot`字段中即可

例如
```html
const item = {
    id: "name",
    slot: "input",
    label: "姓名"
}
```
:::

## 组件列表
:::tip
组件具体使用方法请查看element-plus官方文档，没列出来的也许只是文档更新较慢。
:::

|slot值|element-plus组件|说明|
|--|--|--|
|input|el-input|Input 输入框|
|input-number|el-input-number|InputNumber 计数器|
|select|el-select|Select 选择器|
|radio|el-radio|Radio 单选框|
|radio-group|el-radio-group|Radio 单选框组|
|checkbox|el-checkbox|Checkbox 复选框|
|checkbox-group|el-checkbox-group|Checkbox 复选框组|
|button|el-button|Button 按钮|
|form|el-form|Form 表单|
|form-item|el-form-item|表单项目|
|col|el-col|布局列|
|row|el-row|布局行|
|table|el-table|表格|
|table-column|el-table-column|表格列|
|pagination|el-pagination|分页组件|
|link|el-link|Link 文字链接|
|autocomplete|el-autocomplete|自动完成|
|cascader|el-cascader|日历|
|color-picker|el-color-picker|ColorPicker 颜色选择器|
|date-picker|el-date-picker|DatePicker 日期选择器|
|time-picker|el-time-picker|TimePicker 时间选择器|
|time-select|el-time-select|TimeSelect 时间选择|
|slider|el-slider|Slider 滑块|
|switch|el-switch|Switch 开关|
|rate|el-rate|Rate 评分|
|upload|el-upload|Upload 上传|
|transfer|el-transfer|Transfer 穿梭框|
|cascader|el-cascader|Cascader 级联选择器|
|popconfirm|el-popconfirm| Popconfirm 气泡确认框| 